from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import User, Post, Follow


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


@csrf_exempt
@login_required
def follow(request, user_id):
    if request.user.pk == user_id:
        return JsonResponse({"error": "Cannot follow your own user."}, status=400)

    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed."}, status=405)

    try:
        followed_user = User.objects.get(pk=int(user_id))
    except:
        return JsonResponse({"error": "User not found."}, status=404)
    
    try:
        already_follow = Follow.objects.filter(user_followed=followed_user, user_follower=request.user).first()
        if already_follow is not None:
            already_follow.delete()
            return JsonResponse({"message": "User unfollowed."}, status=200)
    except:
        pass

    follow_entity = Follow(user_followed=followed_user, user_follower=request.user)
    follow_entity.save()
    return JsonResponse({"message": "User followed."}, status=201)


def post_all(request, filter):

    if request.method != 'GET':
        return JsonResponse({"error": "Method not allowed."}, status=405)

    if filter == 'all':
        posts = Post.objects.all()
    elif filter == 'following':
        print("teste")
        following = [following.user_followed for following in Follow.objects.all().filter(user_follower=request.user)]
        posts = Post.objects.filter(user__in=following)
    posts = sorted(posts, key=lambda x: x.date_creation, reverse=True)

    return JsonResponse([post.serialize(request.user.pk) for post in posts], safe=False)


@csrf_exempt
@login_required
def user(request, id):
    if request.method != "GET":
        return JsonResponse({"error": "Method not allowed."}, status=405)
    
    try:
        id = int(id)
    except:
        return JsonResponse({"error": "Bad Request."}, status=400)

    try:
        user = User.objects.get(pk=id)
    except:
        return JsonResponse({"error": "Not found."}, status=404)
    data = user.serialize(request.user.id)
    data['own_user'] = user == request.user
    data['following'] = len(user.followers.all().filter(user_follower=request.user)) > 0
    return JsonResponse(data)
