import base64
import hmac
import hashlib
import json
import uuid

from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import filters, generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db import transaction
from datetime import timedelta
from django.utils import timezone

from .models import (
    Category, Certificate, Chapter, Course, CourseReview,
    Enrollment, Lesson, LessonProgress, PaymentOrder, Quiz, QuizAttempt,
    StudentProfile, TeacherProfile, User, Question, Answer 
)
from .serializers import (
    CategorySerializer,
    CertificateSerializer,
    ChapterSerializer,
    CourseDetailSerializer,
    CourseListSerializer,
    CourseReviewSerializer,
    CustomTokenObtainPairSerializer,
    EnrollmentSerializer,
    LessonProgressSerializer,
    LessonSerializer,
    QuizSerializer,
    QuizResultSerializer,
    QuizAttemptSerializer,
    StudentProfileSerializer,
    SubmitQuizSerializer,
    TeacherProfileSerializer,
    UserSerializer,
)

from .utils import generate_esewa_signature


# ==========================================
# HELPER FUNCTIONS
# ==========================================

def verify_esewa_response_signature(decoded_json, secret_key):
    """
    Dynamically computes HMAC-SHA256 signature for eSewa response payloads
    based on the exact order listed in 'signed_field_names'.
    Format: key1=value1,key2=value2,...
    """
    signed_field_names_str = decoded_json.get("signed_field_names", "")
    if not signed_field_names_str:
        return None

    signed_field_names = [f.strip() for f in signed_field_names_str.split(",") if f.strip()]
    
    signed_parts = []
    for field in signed_field_names:
        value = decoded_json.get(field, "")
        signed_parts.append(f"{field}={value}")

    data_to_sign = ",".join(signed_parts)

    secret = secret_key.encode("utf-8")
    message = data_to_sign.encode("utf-8")

    digest = hmac.new(secret, message, hashlib.sha256).digest()
    return base64.b64encode(digest).decode("utf-8")


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


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)


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
# 2. PROFILE MANAGEMENT
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

        if course.price > 0:
            return Response(
                {"detail": "This is a paid course. Please complete payment first."},
                status=status.HTTP_403_FORBIDDEN,
            )

        enrollment, created = Enrollment.objects.get_or_create(student=student_profile, course=course)
        if not created:
            return Response({"detail": "Already enrolled."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Enrolled successfully"}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def enrollment(self, request, *args, **kwargs):
        course = self.get_object()
        student_profile = getattr(request.user, "student_profile", None)

        if not student_profile:
            return Response({"enrolled": False}, status=status.HTTP_200_OK)

        enrolled = Enrollment.objects.filter(student=student_profile, course=course).exists()
        return Response({"enrolled": enrolled}, status=status.HTTP_200_OK)


# ==========================================
# 4. TEACHER MANAGEMENT VIEWS
# ==========================================

class TeacherCourseViewSet(viewsets.ModelViewSet):
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
        course_id = self.request.query_params.get('course_id')
        if course_id:
            return Chapter.objects.filter(course_id=course_id)
        return super().get_queryset()


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
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
            completed = LessonProgress.objects.filter(
                student=student_profile, 
                lesson__chapter__course=lesson.chapter.course, 
                is_completed=True
            ).count()
            enrollment.is_completed = completed == total and total > 0
            enrollment.save()

        return Response({"status": "Complete"})


# ==========================================
# 5. STUDENT ACTIONS
# ==========================================

class EnrollmentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        student = getattr(self.request.user, "student_profile", None)
        if not student:
            return Enrollment.objects.none()

        return (
            Enrollment.objects
            .filter(student=student)
            .select_related("course")
            .order_by("-last_accessed")
        )


class CourseReviewViewSet(viewsets.ModelViewSet):
    queryset = CourseReview.objects.all()
    serializer_class = CourseReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        student = getattr(self.request.user, 'student_profile', None)
        if not student: 
            raise permissions.PermissionDenied("Only students review.")
        serializer.save(student=student)


class CertificateViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        student = getattr(self.request.user, 'student_profile', None)
        if student:
            return Certificate.objects.filter(enrollment__student=student)
        return Certificate.objects.none()


# ==========================================
# 6. ESEWA PAYMENT VIEWS
# ==========================================

class InitiateEsewaPaymentView(APIView):
    """
    Initiates payment by creating a PENDING PaymentOrder 
    and generating eSewa payload + HMAC signature.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        course_id = request.data.get("course_id")
        
        if not course_id:
            return Response({"error": "course_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            course = Course.objects.get(id=course_id)
            student_profile = getattr(request.user, 'student_profile', None)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        if not student_profile:
            return Response({"error": "Only student profiles can initiate purchases."}, status=status.HTTP_403_FORBIDDEN)

        if Enrollment.objects.filter(student=student_profile, course=course).exists():
            return Response({"error": "You are already enrolled in this course."}, status=status.HTTP_400_BAD_REQUEST)

        if course.price <= 0:
            Enrollment.objects.get_or_create(student=student_profile, course=course)
            return Response({
                "free": True,
                "course_slug": course.slug,
                "message": "Enrolled successfully."
            })

        order = PaymentOrder.objects.create(
            student=student_profile,
            course=course,
            amount=course.price,
            status=PaymentOrder.Status.PENDING,
            transaction_uuid=uuid.uuid4(),
        )

        product_code = settings.ESEWA_PRODUCT_CODE
        secret_key = settings.ESEWA_SECRET_KEY
        
        total_amount = f"{order.amount:.2f}"
        transaction_uuid = str(order.transaction_uuid)

        signature = generate_esewa_signature(
            total_amount=total_amount,
            transaction_uuid=transaction_uuid,
            product_code=product_code,
            secret_key=secret_key
        )

        frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3000")

        esewa_payload = {
            "amount": total_amount,
            "failure_url": f"{frontend_url}/payment/failure?transaction_uuid={transaction_uuid}",
            "product_delivery_charge": "0",
            "product_service_charge": "0",
            "product_code": product_code,
            "signature": signature,
            "signed_field_names": "total_amount,transaction_uuid,product_code",
            "success_url": f"{frontend_url}/payment/success",
            "tax_amount": "0",
            "total_amount": total_amount,
            "transaction_uuid": transaction_uuid
        }

        return Response(esewa_payload, status=status.HTTP_200_OK)


class VerifyEsewaPaymentView(APIView):
    """
    Verifies base64 encoded response from eSewa using dynamic signature validation,
    marks PaymentOrder as COMPLETE, and enrolls the student.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        encoded_data = request.data.get("data")
        
        if not encoded_data:
            return Response({"error": "No payment data provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_bytes = base64.b64decode(encoded_data)
            decoded_json = json.loads(decoded_bytes.decode('utf-8'))
            
            transaction_uuid = decoded_json.get("transaction_uuid")
            payment_status = decoded_json.get("status")
            ref_id = decoded_json.get("transaction_code")
            received_signature = decoded_json.get("signature")

            order = PaymentOrder.objects.get(transaction_uuid=transaction_uuid)

            student_profile = getattr(request.user, 'student_profile', None)
            if not student_profile or order.student != student_profile:
                return Response(
                    {"error": "Unauthorized payment."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            if order.status == PaymentOrder.Status.COMPLETE:
                return Response({
                    "message": "Payment already verified",
                    "course_slug": order.course.slug,
                })

            # Dynamically verify eSewa response signature based on signed_field_names
            expected_signature = verify_esewa_response_signature(
                decoded_json=decoded_json,
                secret_key=settings.ESEWA_SECRET_KEY
            )

            if not expected_signature or received_signature != expected_signature:
                return Response(
                    {"error": "Invalid signature. Fraudulent payment response detected."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if payment_status == "COMPLETE":
                order.status = PaymentOrder.Status.COMPLETE
                order.ref_id = ref_id
                order.save()

                Enrollment.objects.get_or_create(
                    student=order.student,
                    course=order.course
                )

                return Response({
                    "message": "Payment verified and student enrolled successfully!",
                    "course_slug": order.course.slug
                })

            else:
                order.status = PaymentOrder.Status.FAILED
                order.save()
                return Response({"error": "Payment failed on eSewa."}, status=status.HTTP_400_BAD_REQUEST)

        except PaymentOrder.DoesNotExist:
            return Response({"error": "Order transaction not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": f"Verification failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


# Add these to your views.py

class QuizViewSet(viewsets.ModelViewSet):
    """ViewSet for quiz management"""
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return quizzes for the course"""
        lesson_id = self.request.query_params.get('lesson_id')
        if lesson_id:
            return Quiz.objects.filter(lesson_id=lesson_id, is_active=True)
        return Quiz.objects.filter(is_active=True)

    def retrieve(self, request, *args, **kwargs):
        """Get quiz with questions for student attempt"""
        quiz = self.get_object()
        
        # Check if student has already attempted this quiz
        student_profile = getattr(request.user, 'student_profile', None)
        if student_profile:
            existing_attempt = QuizAttempt.objects.filter(
                student=student_profile,
                quiz=quiz,
                status=QuizAttempt.AttemptStatus.COMPLETED
            ).first()
            
            if existing_attempt:
                # Return the results if already attempted
                serializer = QuizResultSerializer(existing_attempt)
                return Response({
                    'quiz': QuizSerializer(quiz).data,
                    'attempted': True,
                    'result': serializer.data
                })

        # Return quiz with questions for new attempt
        serializer = self.get_serializer(quiz)
        return Response({
            'quiz': serializer.data,
            'attempted': False
        })


class StartQuizView(APIView):
    """Start a quiz attempt"""
    permission_classes = [IsAuthenticated]

    def post(self, request, quiz_id):
        student_profile = getattr(request.user, 'student_profile', None)
        if not student_profile:
            return Response(
                {"error": "Only students can attempt quizzes"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            quiz = Quiz.objects.get(id=quiz_id, is_active=True)
        except Quiz.DoesNotExist:
            return Response(
                {"error": "Quiz not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if already attempted
        existing_attempt = QuizAttempt.objects.filter(
            student=student_profile,
            quiz=quiz,
        ).first()

        if existing_attempt:
            if existing_attempt.status == QuizAttempt.AttemptStatus.COMPLETED:
                return Response(
                    {"error": "You have already completed this quiz"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            elif existing_attempt.status == QuizAttempt.AttemptStatus.IN_PROGRESS:
                deadline = None

                if quiz.time_limit_minutes:
                    deadline = (
                        existing_attempt.started_at + timedelta(minutes=quiz.time_limit_minutes)
                    )
                # Resume existing attempt
                return Response({
                    "message": "Resuming existing attempt",
                    "attempt_id": existing_attempt.id,
                    "started_at": existing_attempt.started_at,
                    "deadline": deadline,
                    "quiz": QuizSerializer(quiz).data
                })

        # Create new attempt
        attempt = QuizAttempt.objects.create(
            student=student_profile,
            quiz=quiz,
            max_score=sum(q.points for q in quiz.questions.all())
        )
        deadline=None
        if quiz.time_limit_minutes:
            deadline = (attempt.started_at + timedelta(minutes=quiz.time_limit_minutes))

        return Response({
            "message": "Quiz started",
            "attempt_id": attempt.id,
            "started_at": attempt.started_at,
            "deadline": deadline,
            "quiz": QuizSerializer(quiz).data,
            "time_limit": quiz.time_limit_minutes
        }, status=status.HTTP_201_CREATED)

       


class SubmitQuizView(APIView):
    """Submit quiz answers and calculate score"""
    permission_classes = [IsAuthenticated]

    def post(self, request, attempt_id):
        student_profile = getattr(request.user, 'student_profile', None)

        if not student_profile:
            return Response(
                {"error": "Only students can submit quizzes"},
                status=status.HTTP_403_FORBIDDEN
            )

        # ==========================================
        # GET ACTIVE ATTEMPT
        # ==========================================

        try:
            attempt = QuizAttempt.objects.select_related(
                'quiz',
                'quiz__lesson',
            ).get(
                id=attempt_id,
                student=student_profile,
                status=QuizAttempt.AttemptStatus.IN_PROGRESS
            )
        except QuizAttempt.DoesNotExist:
            return Response(
                {"error": "Quiz attempt not found or already completed"},
                status=status.HTTP_404_NOT_FOUND
            )
        

        now = timezone.now()
        
        if attempt.quiz.time_limit_minutes and attempt.started_at:
            deadline = (attempt.started_at + timedelta(minutes=attempt.quiz.time_limit_minutes))
            
            if now > deadline:
                attempt.status = QuizAttempt.AttemptStatus.COMPLETED
                attempt.completed_at = now
                attempt.passed = False
                attempt.score = 0
                attempt.save(
                    update_fields=[
                        "status",
                        "completed_at",
                        "passed",
                        "score",
                    ]
                )
                
                return Response(
                    {
                        "error": "Quiz time limit exceeded.",
                        "attempt_id": attempt.id,
                        "time_limit_minutes": attempt.quiz.time_limit_minutes,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # ==========================================
        # VALIDATE REQUEST DATA
        # ==========================================

        serializer = SubmitQuizSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        answers_data = serializer.validated_data["answers"]

        quiz = attempt.quiz

        # Load all questions belonging to this quiz
        questions = {
            question.id: question
            for question in quiz.questions.prefetch_related("options").all()
        }

        # ==========================================
        # VALIDATE QUESTION IDS
        # ==========================================

        for answer_data in answers_data:
            question_id = answer_data["question_id"]

            if question_id not in questions:
                return Response(
                    {
                        "error": (
                            f"Question {question_id} "
                            f"does not belong to this quiz."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        # ==========================================
        # PREVENT DUPLICATE ANSWERS
        # ==========================================

        submitted_question_ids = [
            answer["question_id"]
            for answer in answers_data
        ]

        if len(submitted_question_ids) != len(set(submitted_question_ids)):
            return Response(
                {
                    "error": "Each question can only be answered once."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ==========================================
        # PROCESS SUBMISSION
        # ==========================================

        with transaction.atomic():

            score = 0

            for answer_data in answers_data:

                question_id = answer_data["question_id"]
                question = questions[question_id]

                selected_option_id = answer_data.get("selected_option_id")
                short_answer_text = answer_data.get("short_answer_text")

                is_correct = False
                points_earned = 0
                selected_option = None

                # ==========================================
                # MULTIPLE CHOICE / TRUE-FALSE
                # ==========================================

                if question.question_type in [
                    Question.QuestionType.MULTIPLE_CHOICE,
                    Question.QuestionType.TRUE_FALSE,
                ]:

                    if selected_option_id is not None:

                        selected_option = next(
                            (
                                option
                                for option in question.options.all()
                                if option.id == selected_option_id
                            ),
                            None
                        )

                        # Option does not belong to this question
                        if selected_option is None:
                            return Response(
                                {
                                    "error": (
                                        f"Option {selected_option_id} "
                                        f"does not belong to "
                                        f"question {question_id}."
                                    )
                                },
                                status=status.HTTP_400_BAD_REQUEST
                            )

                        # Check correctness
                        is_correct = selected_option.is_correct

                        if is_correct:
                            points_earned = question.points
                            score += question.points

                # ==========================================
                # SHORT ANSWER
                # ==========================================

                elif question.question_type == Question.QuestionType.SHORT_ANSWER:

                    # Short answers require manual grading for now.
                    is_correct = False
                    points_earned = 0

                # ==========================================
                # SAVE ANSWER
                # ==========================================

                Answer.objects.create(
                    attempt=attempt,
                    question=question,
                    selected_option=selected_option,
                    short_answer_text=short_answer_text,
                    is_correct=is_correct,
                    points_earned=points_earned,
                )

            # ==========================================
            # CALCULATE RESULT
            # ==========================================

            attempt.score = score
            attempt.status = QuizAttempt.AttemptStatus.COMPLETED
            attempt.completed_at = timezone.now()

            score_percentage = (
                (score / attempt.max_score) * 100
                if attempt.max_score > 0
                else 0
            )

            attempt.passed = (
                score_percentage >= quiz.passing_score
            )

            attempt.save()

            # ==========================================
            # UPDATE LESSON PROGRESS
            # ==========================================

            if attempt.passed:

                lesson = quiz.lesson

                LessonProgress.objects.update_or_create(
                    student=student_profile,
                    lesson=lesson,
                    defaults={
                        "is_completed": True,
                        "completed_at": timezone.now(),
                    }
                )

                # ==========================================
                # UPDATE COURSE ENROLLMENT
                # ==========================================

                enrollment = Enrollment.objects.filter(
                    student=student_profile,
                    course=lesson.chapter.course
                ).first()

                if enrollment:

                    total_lessons = Lesson.objects.filter(
                        chapter__course=enrollment.course
                    ).count()

                    completed_lessons = LessonProgress.objects.filter(
                        student=student_profile,
                        lesson__chapter__course=enrollment.course,
                        is_completed=True
                    ).count()

                    enrollment.is_completed = (
                        total_lessons > 0
                        and completed_lessons == total_lessons
                    )

                    enrollment.save()

        # ==========================================
        # RETURN RESULT
        # ==========================================

        return Response(
            {
                "message": "Quiz submitted successfully",
                "attempt_id": attempt.id,
                "score": score,
                "max_score": attempt.max_score,
                "score_percentage": round(score_percentage, 2),
                "passed": attempt.passed,
                "passing_score": quiz.passing_score,
            },
            status=status.HTTP_200_OK
        )
    

class QuizResultsView(APIView):
    """Get detailed quiz results for a specific attempt"""
    permission_classes = [IsAuthenticated]

    def get(self, request, attempt_id):
        student_profile = getattr(request.user, 'student_profile', None)
        if not student_profile:
            return Response(
                {"error": "Only students can view quiz results"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            attempt = QuizAttempt.objects.get(
                id=attempt_id,
                student=student_profile,
                status=QuizAttempt.AttemptStatus.COMPLETED
            )
        except QuizAttempt.DoesNotExist:
            return Response(
                {"error": "Quiz results not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = QuizResultSerializer(attempt)
        return Response(serializer.data)


class StudentQuizHistoryView(APIView):
    """Get all quiz attempts for the current student"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student_profile = getattr(request.user, 'student_profile', None)
        if not student_profile:
            return Response(
                {"error": "Only students can view quiz history"},
                status=status.HTTP_403_FORBIDDEN
            )

        attempts = QuizAttempt.objects.filter(
            student=student_profile
        ).select_related('quiz', 'quiz__lesson', 'quiz__lesson__chapter', 'quiz__lesson__chapter__course')

        serializer = QuizAttemptSerializer(attempts, many=True)
        return Response(serializer.data)