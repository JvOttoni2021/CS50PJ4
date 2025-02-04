const BODY_POST =  '<div class="card border-primary mb-3 d-block w-50 mx-auto"> \
                        <div class="card-header btn w-100 text-start" onclick="show_profile(\'#USER_ID#\')">#USERNAME#</div>    \
                        <div class="card-body text-secondary"> \
                            <button class="btn btn-primary btn-sm">Edit</button>    \
                            <div class="my-2 text-black">#POSTBODY#</div>    \
                            <small>#TIMESTAMP#</small>    \
                            <div class="mb-2"><svg xmlns"http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-suit-heart" viewBox="0 0 16 16"> \
  <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.6 7.6 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"/> \
</svg> #LIKES#</div>    \
                            <button class="btn btn-primary btn-sm">Comment</button>    \
                        </div> \
                    </div>'

function get_body(post) {
    
    let replace_values = {
        "#USER_ID#": post.user.id,
        "#USERNAME#": post.user.user,
        "#POSTBODY#": post.content,
        "#TIMESTAMP#": post.timestamp,
        "#LIKES#": post.likes
    }

    let formatted_return = BODY_POST;

    for (let [key, value] of Object.entries(replace_values)) {
        formatted_return = formatted_return.replaceAll(key, value);
    }

    return formatted_return;
}

const PROFILE_BODY = ' \
<div class="d-none" id="loaded-profile">#USER_ID#</div> \
<div class="card border-primary my-2 d-block w-50 mx-auto"> \
    <h5 class="card-header">User\'s Profile</h5> \
    <div class="card-body text-secondary" id="profile-card-"> \
        <h5 class="card-title">#USERNAME#</h5>\
        <p class="card-text">Followers <strong>#FOLLOWERS#</strong> - Follows <strong>#FOLLOWS#</strong></p> \
        <p class="card-text">Joined #DATE_JOINED#</p> \
    </div> \
</div> \
<div class="w-100 text-center fs-3">Latest posts</div> \
'

function get_body_user(user) {
    
    let replace_values = {
        "#USER_ID#": user.pk,
        "#USERNAME#": user.username,
        "#FOLLOWERS#": user.followers,
        "#FOLLOWS#": user.follows,
        "#DATE_JOINED#": user.date_joined
    }

    let formatted_return = PROFILE_BODY;

    for (let [key, value] of Object.entries(replace_values)) {
        formatted_return = formatted_return.replaceAll(key, value);
    }

    return formatted_return;
}