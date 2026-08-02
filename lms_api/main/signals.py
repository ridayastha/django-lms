from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import User, StudentProfile, TeacherProfile


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if not created:
        return

    if instance.role == "TEACHER":
        TeacherProfile.objects.get_or_create(user=instance)
    else:
        StudentProfile.objects.get_or_create(user=instance)