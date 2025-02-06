
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API ROUTES
    path("posts", views.post, name="post"),
    path("posts/<int:post_id>", views.put_post, name="put_post"),
    path("follow/<int:user_id>", views.follow, name="follow"),
    path("like/<int:post_id>", views.like, name="like"),
    path("posts/<str:filter>", views.get_posts, name="post_all"),
    path("users/<int:id>", views.user, name="user")
]
