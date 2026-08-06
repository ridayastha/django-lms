import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator


# ==========================================
# 1. USER & PROFILES
# ==========================================

class User(AbstractUser):
    """
    Custom User model extending Django's built-in AbstractUser.
    Allows defining roles like Admin, Teacher, and Student.
    """
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        TEACHER = "TEACHER", "Teacher"
        STUDENT = "STUDENT", "Student"

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.STUDENT)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to="profiles/", blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    def is_teacher(self):
        return self.role == self.Role.TEACHER

    def is_student(self):
        return self.role == self.Role.STUDENT


class TeacherProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="teacher_profile")
    qualification = models.CharField(max_length=200)
    expertise = models.CharField(max_length=250, help_text="Comma-separated list of skills")
    website = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"Teacher: {self.user.get_full_name() or self.user.username}"


class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="student_profile")
    interests = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Student: {self.user.get_full_name() or self.user.username}"


# ==========================================
# 2. COURSE STRUCTURE
# ==========================================

class Category(models.Model):
    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True, null=True)
    icon = models.ImageField(upload_to="categories/", blank=True, null=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.title


class Course(models.Model):
    class Level(models.TextChoices):
        BEGINNER = "BEGINNER", "Beginner"
        INTERMEDIATE = "INTERMEDIATE", "Intermediate"
        ADVANCED = "ADVANCED", "Advanced"

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="courses")
    teacher = models.ForeignKey(TeacherProfile, on_delete=models.CASCADE, related_name="courses")
    featured_img = models.ImageField(upload_to="courses/thumbnails/", blank=True, null=True)
    level = models.CharField(max_length=20, choices=Level.choices, default=Level.BEGINNER)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Chapter(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="chapters")
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.course.title} - Chapter {self.order}: {self.title}"


class Lesson(models.Model):
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=200)
    video_url = models.URLField(blank=True, null=True, help_text="YouTube/Vimeo or self-hosted URL")
    content = models.TextField(blank=True, null=True, help_text="Text content or notes for the lesson")
    duration_minutes = models.PositiveIntegerField(default=0)
    is_preview = models.BooleanField(default=False, help_text="Can be viewed without purchasing")
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.chapter.title} - Lesson {self.order}: {self.title}"


class LessonAttachment(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="attachments")
    title = models.CharField(max_length=150)
    file = models.FileField(upload_to="lessons/attachments/")

    def __str__(self):
        return self.title


# ==========================================
# 3. ENROLLMENT & PROGRESS
# ==========================================

class Enrollment(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    enrolled_at = models.DateTimeField(auto_now_add=True)
    last_accessed = models.DateTimeField(auto_now=True)
    is_completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ("student", "course")

    def __str__(self):
        return f"{self.student.user.username} -> {self.course.title}"


class LessonProgress(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name="lesson_progress")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="progress")
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        unique_together = ("student", "lesson")

    def __str__(self):
        return f"{self.student.user.username} - {self.lesson.title} ({'Done' if self.is_completed else 'In Progress'})"


# ==========================================
# 4. REVIEWS & CERTIFICATES
# ==========================================

class CourseReview(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="reviews")
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("course", "student")

    def __str__(self):
        return f"{self.course.title} - {self.rating} Stars"


class Certificate(models.Model):
    certificate_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    enrollment = models.OneToOneField(Enrollment, on_delete=models.CASCADE, related_name="certificate")
    issued_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Certificate {self.certificate_id} - {self.enrollment.student.user.username}"