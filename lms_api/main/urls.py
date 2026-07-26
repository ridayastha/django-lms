from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'courses', views.CourseViewSet)
router.register(r'chapters', views.ChapterViewSet) # NEW
router.register(r'lessons', views.LessonViewSet)   # NEW (Changed from ReadOnly)
router.register(r'enrollments', views.EnrollmentViewSet, basename='enrollment')
router.register(r'quizzes', views.QuizViewSet)
router.register(r'reviews', views.CourseReviewViewSet)
router.register(r'certificates', views.CertificateViewSet, basename='certificate')
router.register(r'teacher-courses', views.TeacherCourseViewSet, basename='teacher-courses')

urlpatterns = [
    path('', include(router.urls)),
    
    # Auth & Profiles
    path('register/', views.RegisterView.as_view(), name='register'),
    path('teacher/profile/', views.TeacherProfileDetail.as_view(), name='teacher-profile'), # NEW
    path('student/profile/', views.StudentProfileDetail.as_view(), name='student-profile'), # NEW
    
    # JWT
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]