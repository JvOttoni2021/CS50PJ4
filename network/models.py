from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass
    def serialize(self):
        return {
            "id": self.pk,
            "user": self.username
        }
    

class Entity(models.Model):
    id = models.AutoField(primary_key=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(null=False, default=True)

    class Meta:
        abstract = True


class Post(Entity):
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='posts', null=False)
    content = models.CharField(max_length=255, null=False)

    def serialize(self):
        return {
            "id": self.pk,
            "user": self.user.serialize(),
            "userId": self.user.pk,
            "content": self.content,
            "timestamp": self.date_creation
        }


class Like(Entity):
    post = models.ForeignKey(Post, on_delete=models.PROTECT, related_name='likes', null=False)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='likes', null=False)


class Follow(Entity):
    user_followed = models.ForeignKey(User, on_delete=models.PROTECT, related_name='followers', null=False)
    user_follower = models.ForeignKey(User, on_delete=models.PROTECT, related_name='follows', null=False)