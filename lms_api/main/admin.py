from django.contrib import admin
from . import models

# Register the Custom User and Profiles
admin.site.register(models.User)
admin.site.register(models.TeacherProfile)
admin.site.register(models.StudentProfile)

# Register Course related models
admin.site.register(models.Category)
admin.site.register(models.Course)
admin.site.register(models.Chapter)
admin.site.register(models.Lesson)

# Register Enrollment and Progress
admin.site.register(models.Enrollment)
admin.site.register(models.LessonProgress)

# Register Quizzes and Reviews
admin.site.register(models.Quiz)
admin.site.register(models.Question)
admin.site.register(models.Choice)
admin.site.register(models.CourseReview)