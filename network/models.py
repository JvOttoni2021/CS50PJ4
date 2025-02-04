from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass
    def serialize(self):
        return {
            "id": self.pk,
            "date_joined": self.date_joined,
            "username": self.username,
            "follows": len(self.follows.all()),
            "followers": len(self.followers.all()),
            "posts": [post.serialize() for post in sorted(self.posts.all(), key=lambda x: x.date_creation, reverse=True)]
        }


    def serialize_post(self):
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
            "user": self.user.serialize_post(),
            "content": self.content,
            "timestamp": self.date_creation,
            "likes": len(self.likes.all()),
            "comments": [comment.serialize() for comment in self.comments.all()]
        }


class Like(Entity):
    post = models.ForeignKey(Post, on_delete=models.PROTECT, related_name='likes', null=False)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='likes', null=False)


class Follow(Entity):
    user_followed = models.ForeignKey(User, on_delete=models.PROTECT, related_name='followers', null=False)
    user_follower = models.ForeignKey(User, on_delete=models.PROTECT, related_name='follows', null=False)


class Comment(Entity):
    post = models.ForeignKey(Post, on_delete=models.PROTECT, related_name='comments', null=False)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='comments', null=False)
    content = models.CharField(max_length=255, null=False)

    def serialize(self):
        return {
            "id": self.pk,
            "user": self.user.pk,
            "content": self.content
        }