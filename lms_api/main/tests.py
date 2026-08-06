from datetime import timedelta

from django.test import TestCase
from django.utils import timezone

from .models import (
    Category,
    Chapter,
    Course,
    Enrollment,
    Lesson,
    LessonProgress,
    StudentProfile,
    TeacherProfile,
    User,
)
from .serializers import EnrollmentSerializer


class EnrollmentSerializerTests(TestCase):
    def setUp(self):
        student_user = User.objects.create_user(
            username="student_test",
            email="student@example.com",
            password="password123",
        )
        student_profile, _ = StudentProfile.objects.get_or_create(user=student_user)

        teacher_user = User.objects.create_user(
            username="teacher_test",
            email="teacher@example.com",
            password="password123",
            role=User.Role.TEACHER,
        )
        teacher_profile, _ = TeacherProfile.objects.get_or_create(
            user=teacher_user,
            defaults={
                "qualification": "PhD",
                "expertise": "Machine Learning",
            },
        )

        category = Category.objects.create(title="AI", slug="ai")
        course = Course.objects.create(
            title="Course A",
            slug="course-a",
            description="Test course",
            category=category,
            teacher=teacher_profile,
        )
        chapter = Chapter.objects.create(course=course, title="Chapter 1", order=1)
        lesson_one = Lesson.objects.create(chapter=chapter, title="Lesson 1", order=1)
        lesson_two = Lesson.objects.create(chapter=chapter, title="Lesson 2", order=2)

        self.enrollment = Enrollment.objects.create(student=student_profile, course=course)

        LessonProgress.objects.create(
            student=student_profile,
            lesson=lesson_one,
            is_completed=True,
            completed_at=timezone.now(),
        )
        LessonProgress.objects.create(
            student=student_profile,
            lesson=lesson_two,
            is_completed=True,
            completed_at=timezone.now() + timedelta(minutes=1),
        )

    def test_serializer_marks_enrollment_completed_when_all_lessons_are_done(self):
        data = EnrollmentSerializer(self.enrollment).data

        self.assertTrue(data["is_completed"])
