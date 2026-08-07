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