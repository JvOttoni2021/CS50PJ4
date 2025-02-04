
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API ROUTES
    path("posts", views.post, name="post"),
    path("posts/all", views.post_all, name="post_all"),
    path("users/<int:id>", views.user, name="user")
]
