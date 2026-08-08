from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import (
    User,
    TeacherProfile,
    StudentProfile,
    Category,
    Course,
    Chapter,
    Lesson,
    LessonAttachment,
    Enrollment,
    LessonProgress,
    CourseReview,
    Certificate,
    PaymentOrder,
    Quiz,
    Question,
    Option,
    QuizAttempt,
    Answer,
)


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "role",
        "is_staff",
        "is_active",
    )

    list_filter = (
        "role",
        "is_staff",
        "is_superuser",
        "is_active",
    )

    fieldsets = UserAdmin.fieldsets + (
        (
            "Additional Information",
            {
                "fields": (
                    "role",
                    "bio",
                    "profile_picture",
                    "phone_number",
                )
            },
        ),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            "Additional Information",
            {
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "role",
                    "bio",
                    "profile_picture",
                    "phone_number",
                )
            },
        ),
    )

@admin.register(PaymentOrder)
class PaymentOrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student",
        "course",
        "amount",
        "status",
        "transaction_uuid",
        "ref_id",
        "created_at",
    )

    list_filter = ("status", "created_at")

    search_fields = (
        "transaction_uuid",
        "ref_id",
        "student__user__username",
        "course__title",
    )

    readonly_fields = (
        "transaction_uuid",
        "created_at",
    )

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "lesson",
        "time_limit_minutes",
        "passing_score",
        "is_active",
        "order",
    )

    list_filter = (
        "is_active",
    )

    search_fields = (
        "title",
        "description",
        "lesson__title",
    )

    ordering = (
        "lesson",
        "order",
    )


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "quiz",
        "question_text",
        "question_type",
        "points",
        "order",
    )

    list_filter = (
        "question_type",
        "quiz",
    )

    search_fields = (
        "question_text",
        "quiz__title",
    )

    ordering = (
        "quiz",
        "order",
    )


@admin.register(Option)
class OptionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "question",
        "option_text",
        "is_correct",
        "order",
    )

    list_filter = (
        "is_correct",
        "question__question_type",
    )

    search_fields = (
        "option_text",
        "question__question_text",
    )

    ordering = (
        "question",
        "order",
    )


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student",
        "quiz",
        "status",
        "score",
        "max_score",
        "passed",
        "started_at",
        "completed_at",
    )

    list_filter = (
        "status",
        "passed",
        "quiz",
    )

    search_fields = (
        "student__user__username",
        "student__user__email",
        "quiz__title",
    )

    readonly_fields = (
        "started_at",
        "completed_at",
    )

    ordering = (
        "-started_at",
    )


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "attempt",
        "question",
        "selected_option",
        "is_correct",
        "points_earned",
    )

    list_filter = (
        "is_correct",
        "question__question_type",
    )

    search_fields = (
        "attempt__student__user__username",
        "question__question_text",
        "short_answer_text",
    )

    ordering = (
        "attempt",
        "question",
    )

admin.site.register(TeacherProfile)
admin.site.register(StudentProfile)

admin.site.register(Category)
admin.site.register(Course)
admin.site.register(Chapter)
admin.site.register(Lesson)
admin.site.register(LessonAttachment)

admin.site.register(Enrollment)
admin.site.register(LessonProgress)

admin.site.register(CourseReview)
admin.site.register(Certificate)