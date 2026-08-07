import json
import base64
from django.conf import settings
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import viewsets, permissions, status, generics, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    Category, Course, Chapter, Lesson, Enrollment, LessonProgress,
    CourseReview, Certificate, StudentProfile, TeacherProfile, User,
    PaymentOrder
)
from .serializers import (
    UserSerializer, CategorySerializer, CourseListSerializer, CourseDetailSerializer,
    LessonSerializer, ChapterSerializer, EnrollmentSerializer, LessonProgressSerializer,
    CourseReviewSerializer, CertificateSerializer, CustomTokenObtainPairSerializer,
    TeacherProfileSerializer, StudentProfileSerializer
)
from .utils import generate_esewa_signature


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

        if course.price > 0:
            return Response(
                {
                    "detail": "This is a paid course. Please complete payment first."
                },
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
# 5. STUDENT ACTIONS (Enrollments, Certificates)
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

        # Prevent double purchases if already enrolled
        if Enrollment.objects.filter(student=student_profile, course=course).exists():
            return Response({"error": "You are already enrolled in this course."}, status=status.HTTP_400_BAD_REQUEST)

        # Free course -> enroll immediately
        if course.price <= 0:
            Enrollment.objects.create(student=student_profile,course=course)
            
            return Response({
                "free": True,
                "course_slug": course.slug,
                "message": "Enrolled successfully."
            })

        # Create a Pending Payment Order
        order, created = PaymentOrder.objects.create(
            student=student_profile,
            course=course,
            status = PaymentOrder.Status.PENDING,
            defaults = {
                'amount': course.price,
            },
        )

        if not created and order.amount != course.price:
            order.amount = course.price
            order.save(update_fields=["amount"])

        # eSewa Configuration values
        product_code = getattr(settings, 'ESEWA_PRODUCT_CODE', 'EPAYTEST')
        secret_key = getattr(settings, 'ESEWA_SECRET_KEY', '8gBmpyzACX4A') # Default eSewa Test Key
        
        # eSewa requires formatted total string
        total_amount = f"{order.amount:.2f}" if isinstance(order.amount, float) else str(order.amount)
        transaction_uuid = str(order.transaction_uuid)

        # Generate Signature
        signature = generate_esewa_signature(
            total_amount=total_amount,
            transaction_uuid=transaction_uuid,
            product_code=product_code,
            secret_key=secret_key
        )

        # eSewa v2 Form Payload
        esewa_payload = {
            "amount": total_amount,
            "failure_url": f"http://localhost:3000/payment/failure?transaction_uuid={transaction_uuid}",
            "product_delivery_charge": "0",
            "product_service_charge": "0",
            "product_code": product_code,
            "signature": signature,
            "signed_field_names": "total_amount,transaction_uuid,product_code",
            "success_url": "http://localhost:3000/payment/success",
            "tax_amount": "0",
            "total_amount": total_amount,
            "transaction_uuid": transaction_uuid
        }

        print("\n========== ESEWA PAYLOAD ==========")
        print("Signing String:", f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}")
        print("Signature:", signature)

        for key, value in esewa_payload.items():
            print(f"{key}: {value}")
        print("===================================\n")
            

        return Response(esewa_payload, status=status.HTTP_200_OK)


class VerifyEsewaPaymentView(APIView):
    """
    Verifies base64 encoded response from eSewa,
    marks PaymentOrder as COMPLETE, and enrolls the student.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        encoded_data = request.data.get("data")
        
        if not encoded_data:
            return Response({"error": "No payment data provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Decode eSewa base64 string
            decoded_bytes = base64.b64decode(encoded_data)
            decoded_json = json.loads(decoded_bytes.decode('utf-8'))
            
            transaction_uuid = decoded_json.get("transaction_uuid")
            payment_status = decoded_json.get("status") # COMPLETE
            ref_id = decoded_json.get("reference_id")

            order = PaymentOrder.objects.get(transaction_uuid=transaction_uuid)

            if order.student != request.user.student_profile:
                    return Response(
                        {"error": "Unauthorized payment."},
                        status=status.HTTP_403_FORBIDDEN,
                    )

            if order.status == PaymentOrder.Status.COMPLETE:
                return Response(
                    {
                    "message": "Payment already Verified",
                    "course_slug": order.course.slug,
                    }
                )
            
            

            if payment_status == "COMPLETE":
                order.status = PaymentOrder.Status.COMPLETE
                order.ref_id = ref_id
                order.save()

                # Automatically enroll student into the course
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