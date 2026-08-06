from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import (
    User, TeacherProfile, StudentProfile, Category, Course,
    Chapter, Lesson, LessonAttachment, Enrollment,
    LessonProgress, CourseReview, Certificate
)

# ==========================================
# USER & PROFILES SERIALIZERS
# ==========================================

class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "role",
            "bio",
            "profile_picture",
            "phone_number",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def get_profile_picture(self, obj):
        request = self.context.get("request")

        if obj.profile_picture:
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url

        return None
    

class TeacherProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = TeacherProfile
        fields = ['id', 'user', 'qualification', 'expertise', 'website']


class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = StudentProfile
        fields = ['id', 'user', 'interests']


# ==========================================
# COURSE & LESSON SERIALIZERS
# ==========================================

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'title', 'slug', 'description', 'icon']


class LessonAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonAttachment
        fields = ['id', 'title', 'file']


class LessonSerializer(serializers.ModelSerializer):
    attachments = LessonAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'chapter', 'title', 'video_url', 'content', 'duration_minutes', 'is_preview', 'order', 'attachments']


class ChapterSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Chapter
        fields = ['id', 'course', 'title', 'order', 'lessons']


# Brief Serializer for listing courses cleanly
class CourseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'category', 'teacher', 'featured_img', 'level', 'price', 'is_published']

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['category'] = instance.category.title if instance.category else None
        response['teacher'] = instance.teacher.user.get_full_name() if instance.teacher else None
        return response


# Detailed Serializer for retrieving a full course hierarchy
class CourseDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    teacher = TeacherProfileSerializer(read_only=True)
    chapters = ChapterSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'description', 'category', 'teacher', 'featured_img', 'level', 'price', 'is_published', 'chapters', 'created_at', 'updated_at']


# ==========================================
# ENROLLMENT & PROGRESS SERIALIZERS
# ==========================================

class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ['id', 'student', 'lesson', 'is_completed', 'completed_at']


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseListSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all(), source='course', write_only=True)
    total_lessons = serializers.SerializerMethodField()
    completed_lessons = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    next_lesson = serializers.SerializerMethodField()
    completed_lesson_ids = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'course', 'course_id', 'enrolled_at', 'is_completed', 'total_lessons', 'completed_lessons', "completed_lesson_ids",'progress', 'next_lesson', 'last_accessed']

    def get_total_lessons(self, obj):
        return Lesson.objects.filter(chapter__course=obj.course).count()

    def get_completed_lessons(self, obj):
        return LessonProgress.objects.filter(student=obj.student, lesson__chapter__course=obj.course, is_completed=True).count()

    def get_completed_lesson_ids(self, obj):
        return list(LessonProgress.objects.filter(
            student=obj.student,
            lesson__chapter__course=obj.course,
            is_completed=True,
            ).values_list("lesson_id", flat=True)
        )

    def get_progress(self, obj):
        total = self.get_total_lessons(obj)
        completed = self.get_completed_lessons(obj)
        if total == 0:
            return 0

        return round((completed / total) * 100)

    def get_next_lesson(self, obj):
        completed_ids = LessonProgress.objects.filter(student=obj.student,lesson__chapter__course=obj.course,is_completed=True,).values_list("lesson_id", flat=True)

        lesson = (Lesson.objects.filter(chapter__course=obj.course).exclude(id__in=completed_ids).order_by("chapter__order", "order").first())
        if lesson:
            return {
                "id": lesson.id,
                "title": lesson.title,
            }
        return None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        total_lessons = self.get_total_lessons(instance)
        completed_lessons = self.get_completed_lessons(instance)
        representation['is_completed'] = total_lessons > 0 and completed_lessons == total_lessons
        return representation


# ==========================================
# REVIEWS & CERTIFICATES SERIALIZERS
# ==========================================

class CourseReviewSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.user.get_full_name')

    class Meta:
        model = CourseReview
        fields = ['id', 'course', 'student', 'student_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['student']


class CertificateSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='enrollment.student.user.get_full_name')
    course_title = serializers.ReadOnlyField(source='enrollment.course.title')

    class Meta:
        model = Certificate
        fields = ['certificate_id', 'student_name', 'course_title', 'issued_at']


# ==========================================
# AUTHENTICATION SERIALIZERS
# ==========================================

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Returns JWT tokens together with the authenticated user's information.
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Optional custom JWT claims
        token["username"] = user.username
        token["email"] = user.email
        token["role"] = user.role

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # 1. Grab the current request from the serializer context
        request = self.context.get('request')

        # 2. Pass the request context down into the UserSerializer
        data["user"] = UserSerializer(self.user, context={'request': request}).data

        return data