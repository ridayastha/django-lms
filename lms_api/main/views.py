from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .serializers import CustomTokenObtainPairSerializer
from rest_framework import viewsets, permissions, status, generics, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    Category, Course, Chapter, Lesson, Enrollment, LessonProgress, 
    Quiz, QuizAttempt, CourseReview, Certificate, StudentProfile, TeacherProfile, User
)
from .serializers import (
    UserSerializer, CategorySerializer, CourseListSerializer, CourseDetailSerializer, 
    LessonSerializer, ChapterSerializer, EnrollmentSerializer, LessonProgressSerializer, 
    QuizSerializer, QuizAttemptSerializer, CourseReviewSerializer, CertificateSerializer,
    TeacherProfileSerializer, StudentProfileSerializer
)

# ==========================================
# 1. USER AUTH & REGISTRATION
# ==========================================

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ==========================================
# LOGIN (JWT)
# ==========================================

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# ==========================================
# CURRENT USER
# ==========================================

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)


# ==========================================
# LOGOUT
# ==========================================

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"detail": "Logged out successfully."},
                status=status.HTTP_205_RESET_CONTENT,
            )

        except Exception:
            return Response(
                {"detail": "Invalid refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        

# ==========================================
# 2. PROFILE MANAGEMENT (Retrieve & Update)
# ==========================================

class TeacherProfileDetail(generics.RetrieveUpdateAPIView):
    serializer_class = TeacherProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return getattr(self.request.user, 'teacher_profile', None)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

class StudentProfileDetail(generics.RetrieveUpdateAPIView):
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return getattr(self.request.user, 'student_profile', None)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

# ==========================================
# 3. PUBLIC VIEWS (Categories & Courses)
# ==========================================

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.filter(is_published=True)
    lookup_field = "slug" 
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'level']
    search_fields = ['title', 'description']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseListSerializer

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def enroll(self, request, *args, **kwargs):
        course = self.get_object()
        student_profile = getattr(request.user, 'student_profile', None)
        
        if not student_profile:
            return Response({"detail": "Only students can enroll in courses."}, status=status.HTTP_403_FORBIDDEN)

        enrollment, created = Enrollment.objects.get_or_create(student=student_profile, course=course)
        if not created:
            return Response({"detail": "Already enrolled."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Enrolled successfully"}, status=status.HTTP_201_CREATED)

    @action(detail=True,methods=["get"],permission_classes=[permissions.IsAuthenticated],)
    def enrollment(self, request, *args, **kwargs):
        course = self.get_object()
        student_profile = getattr(request.user, "student_profile", None)

        if not student_profile:
            return Response({"enrolled": False},status=status.HTTP_200_OK,)

        enrolled = Enrollment.objects.filter(student=student_profile,course=course,).exists()

        return Response({"enrolled": enrolled},status=status.HTTP_200_OK,)

# ==========================================
# 4. TEACHER MANAGEMENT VIEWS
# ==========================================

class TeacherCourseViewSet(viewsets.ModelViewSet):
    """ Teachers managing their own courses """
    serializer_class = CourseDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        teacher = getattr(self.request.user, 'teacher_profile', None)
        if teacher:
            return Course.objects.filter(teacher=teacher)
        return Course.objects.none()

    def perform_create(self, serializer):
        teacher = getattr(self.request.user, 'teacher_profile', None)
        if not teacher:
            raise permissions.PermissionDenied("Only teachers can create courses.")
        serializer.save(teacher=teacher)

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        teacher = getattr(request.user, 'teacher_profile', None)
        if not teacher:
            return Response({"detail": "Access Denied"}, status=403)
        
        course_count = Course.objects.filter(teacher=teacher).count()
        return Response({"total_courses": course_count})

class ChapterViewSet(viewsets.ModelViewSet):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Allow filtering chapters by course_id in URL: /api/chapters/?course_id=1
        course_id = self.request.query_params.get('course_id')
        if course_id:
            return Chapter.objects.filter(course_id=course_id)
        return super().get_queryset()

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Allow filtering lessons by chapter_id: /api/lessons/?chapter_id=1
        chapter_id = self.request.query_params.get('chapter_id')
        if chapter_id:
            return Lesson.objects.filter(chapter_id=chapter_id)
        return super().get_queryset()

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        lesson = self.get_object()
        student_profile = getattr(request.user, 'student_profile', None)
        if not student_profile:
            return Response({"detail": "Only students track progress."}, status=403)

        progress, _ = LessonProgress.objects.get_or_create(student=student_profile, lesson=lesson)
        progress.is_completed = True
        progress.completed_at = timezone.now()
        progress.save()

        enrollment = Enrollment.objects.filter(student=student_profile, course=lesson.chapter.course).first()
        if enrollment:
            total = Lesson.objects.filter(chapter__course=lesson.chapter.course).count()
            completed = LessonProgress.objects.filter(student=student_profile, lesson__chapter__course=lesson.chapter.course, is_completed=True).count()
            enrollment.is_completed = completed == total and total > 0
            enrollment.save()

        return Response({"status": "Complete"})

# ==========================================
# 5. STUDENT ACTIONS (Enrollments, Quizzes, Certificates)
# ==========================================

class EnrollmentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        student = getattr(self.request.user, 'student_profile', None)
        if student:
            return Enrollment.objects.filter(student=student)
        return Enrollment.objects.none()

class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        quiz = self.get_object()
        student = getattr(request.user, 'student_profile', None)
        if not student: return Response({"detail": "Denied"}, status=403)
        
        answers = request.data.get('answers', {})
        total = quiz.questions.count()
        if total == 0: return Response({"detail": "Empty Quiz"}, status=400)

        correct = 0
        for q in quiz.questions.all():
            if str(q.id) in answers and q.choices.filter(id=answers[str(q.id)], is_correct=True).exists():
                correct += 1

        score = (correct / total) * 100
        attempt = QuizAttempt.objects.create(student=student, quiz=quiz, score=score, passed=(score >= quiz.pass_mark_percent))
        return Response(QuizAttemptSerializer(attempt).data, status=201)

class CourseReviewViewSet(viewsets.ModelViewSet):
    queryset = CourseReview.objects.all()
    serializer_class = CourseReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        student = getattr(self.request.user, 'student_profile', None)
        if not student: raise permissions.PermissionDenied("Only students review.")
        serializer.save(student=student)

class CertificateViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        student = getattr(self.request.user, 'student_profile', None)
        if student:
            return Certificate.objects.filter(enrollment__student=student)
        return Certificate.objects.none()