from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from .views import InitiateEsewaPaymentView, VerifyEsewaPaymentView


router = DefaultRouter()

router.register(r'categories', views.CategoryViewSet)
router.register(r'courses', views.CourseViewSet)
router.register(r'chapters', views.ChapterViewSet)
router.register(r'lessons', views.LessonViewSet)
router.register(r'enrollments', views.EnrollmentViewSet, basename='enrollment')
router.register(r'reviews', views.CourseReviewViewSet)
router.register(r'certificates', views.CertificateViewSet, basename='certificate')
router.register(r'teacher-courses', views.TeacherCourseViewSet, basename='teacher-courses')
router.register(r'quizzes', views.QuizViewSet, basename='quiz')


urlpatterns = [
    path('', include(router.urls)),

    # Auth & Profiles
    path('register/', views.RegisterView.as_view(), name='register'),
    path('teacher/profile/', views.TeacherProfileDetail.as_view(), name='teacher-profile'),
    path('student/profile/', views.StudentProfileDetail.as_view(), name='student-profile'),
    path('me/', views.CurrentUserView.as_view(), name='current-user'),

    # JWT
    path('token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.LogoutView.as_view(), name='logout'),

    # eSewa
    path('payments/initiate/', InitiateEsewaPaymentView.as_view(), name='esewa-initiate'),
    path('payments/verify/', VerifyEsewaPaymentView.as_view(), name='esewa-verify'),

    # Quizzes
    path(
        'quizzes/<int:quiz_id>/start/',
        views.StartQuizView.as_view(),
        name='quiz-start',
    ),

    path(
        'quiz-attempts/<int:attempt_id>/submit/',
        views.SubmitQuizView.as_view(),
        name='quiz-submit',
    ),

    path(
        'quiz-attempts/<int:attempt_id>/results/',
        views.QuizResultsView.as_view(),
        name='quiz-results',
    ),

    path(
        'quiz-history/',
        views.StudentQuizHistoryView.as_view(),
        name='quiz-history',
    ),
]