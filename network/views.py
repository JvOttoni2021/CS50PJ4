from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import User, Post


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@csrf_exempt
@login_required
def post(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed."}, status=405)

    data = json.loads(request.body)

    content = data.get("content", "")
    user = request.user

    if content == "":
        return JsonResponse({"error": "Invalid post content."}, status=422)
    
    if len(content) > 255:
        return JsonResponse({"error": "Post len must be less than 255 characters."}, status=422)
    
    new_post = Post(user=user, content=content)
    new_post.save()
    return JsonResponse({"message": "Post created."}, status=201)


@login_required
def post_all(request):
    if request.method != 'GET':
        return JsonResponse({"error": "Method not allowed."}, status=405)

    posts = Post.objects.all()
    return JsonResponse([post.serialize() for post in posts], safe=False)
