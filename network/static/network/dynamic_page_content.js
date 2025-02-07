const UNLIKED_POST = '\
<svg xmlns"http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-suit-heart" viewBox="0 0 16 16"> \
    <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.6 7.6 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"/> \
</svg>'

const LIKED_POST = '\
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-suit-heart-fill" viewBox="0 0 16 16"> \
  <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1"/> \
</svg>'

const BODY_POST =  ' \
<div class="card border-primary mb-3 d-block mx-auto"> \
    <div class="card-header card-header-link btn w-100 text-start" onclick="show_profile(\'#USER_ID#\')"><strong>#USERNAME#</strong></div> \
    <div class="card-body text-secondary"> \
        <button class="btn btn-primary btn-sm edit-btn" onclick="handle_edit_click(this, #POST_ID#)" #SHOW_BUTTON#>Edit</button> \
        <div class="my-2 text-black post-body">#POSTBODY#</div> \
        <small>#TIMESTAMP#</small> \
        <div class="mb-2 like-div" onclick="handle_like_click(this, #POST_ID#)"> \
            <span class="like-icon">#LIKE_ICON#</span> \
            <span class="likes-count" data-liked="#LIKE_DATA#">#LIKES#</span> \
        </div> \
        <p class="d-inline-flex gap-1"> \
        <button class="btn btn-primary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target=".multi-collapse#POST_ID#" aria-expanded="false" aria-controls="multiCollapseExample#POST_ID#">Comments</button> \
        </p> \
        <div class="col"> \
            <div class="comments">\
                #COMMENTS#\
            </div> \
            <div class="collapse multi-collapse#POST_ID#" id="multiCollapseExample#POST_ID#"> \
                <div class="d-flex"> \
                    <input type="text" class="new-comment-input form-control" placeholder="Type something..."><button class="btn btn-primary btn-sm btn-submit-comment" onclick="add_comment(this, #POST_ID#);">Submit</button> \
                </div> \
            </div> \
        </div> \
    </div> \
</div>'

function get_body(post) {
    let show_button = "";
    if (!post.user.own_user) {
        show_button = "hidden";
    }
    let icon = UNLIKED_POST;

    if (post.liked) {
        icon = LIKED_POST;
    }

    let comments = "";

    post.comments.forEach(element => {
        comments = comments + get_formatted_comment(element.username, element.content, post.id);
    });
    
    let replace_values = {
        "#POST_ID#": post.id,
        "#USER_ID#": post.user.id,
        "#USERNAME#": post.user.user,
        "#POSTBODY#": post.content,
        "#TIMESTAMP#": format_date_time(post.timestamp),
        "#SHOW_BUTTON#": show_button,
        "#LIKES#": post.likes,
        "#LIKE_DATA#": post.liked,
        "#LIKE_ICON#": icon,
        "#COMMENTS#": comments
    }

    let formatted_return = BODY_POST;

    for (let [key, value] of Object.entries(replace_values)) {
        formatted_return = formatted_return.replaceAll(key, value);
    }

    return formatted_return;
}

const PROFILE_BODY = ' \
<div class="d-none" id="loaded-profile">#USER_ID#</div> \
<div class="card border-primary my-2 d-block mx-auto"> \
    <h5 class="card-header">User\'s Profile</h5> \
    <div class="card-body text-secondary" id="profile-card-"> \
        <h5 class="card-title">#USERNAME#</h5>\
        <p class="card-text">Followers <strong id="followers-amount">#FOLLOWERS#</strong> - Follows <strong>#FOLLOWS#</strong></p> \
        <p><button onclick="handle_follow(this, #USER_ID#);" id="follow-button" class="btn btn-primary btn-sm" #SHOW_BUTTON#>#BUTTON_TEXT#</button></p> \
        <p class="card-text">Joined #DATE_JOINED#</p> \
    </div> \
</div> \
<div class="w-100 text-center fs-3">Latest posts</div> \
'

function get_body_user(user) {
    let show_button = "";
    if (user.own_user) {
        show_button = "hidden";
    }

    let button_text = "Follow";
    if (user.following) {
        button_text = "Unfollow";
    }

    let replace_values = {
        "#USER_ID#": user.id,
        "#USERNAME#": user.username,
        "#FOLLOWERS#": user.followers,
        "#FOLLOWS#": user.follows,
        "#DATE_JOINED#": format_date_time(user.date_joined),
        "#SHOW_BUTTON#": show_button,
        "#BUTTON_TEXT#": button_text,
    }

    let formatted_return = PROFILE_BODY;

    for (let [key, value] of Object.entries(replace_values)) {
        formatted_return = formatted_return.replaceAll(key, value);
    }

    return formatted_return;
}

const BODY_PAGINATOR = ' \
 <nav aria-label="Page navigation example" class="d-block w-50 mx-auto"> \
  <div id="current-#DIV_ID#-page" class="d-none">1</div> \
  <ul class="pagination"> \
    <li class="page-item"><a class="page-link" href="#" onclick="previous_next(\'previous\', \'#DIV_ID#\')">Previous</a></li> \
    #LI_PAGES# \
    <li class="page-item"><a class="page-link" href="#" onclick="previous_next(\'next\', \'#DIV_ID#\')">Next</a></li> \
  </ul> \
</nav>\
'


function get_paginator(pages_count, div_id) {
    let body_return = BODY_PAGINATOR;
    let pages_lis = '';
    for(let i = 1; i <= pages_count; i++) {
        pages_lis = pages_lis + `<li class="page-item"><a class="page-link" onclick="shows_pagination(${i}, \'${div_id}\');" href="#">${i}</a></li>`;
    }
    body_return = body_return.replace('#LI_PAGES#', pages_lis);
    body_return = body_return.replaceAll('#DIV_ID#', div_id);

    return body_return;
}

function format_date_time(datetimeString) {
    const date = new Date(datetimeString);

    const options = { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true,
        timeZone: 'UTC'
    };

    return date.toLocaleDateString('en-US', options);
}


const COMMENT_BODY = ' \
<div class="col mb-1"> \
    <div class="collapse multi-collapse#POST_ID# #SHOW#" id="multiCollapseExample#POST_ID#"> \
    <div class="card card-body" style="width: 100% !important; padding: 10px 15px !important;"> \
        <strong>#USERNAME#</strong>\
        #CONTENT#. \
    </div> \
    </div> \
</div>'

function get_formatted_comment(username, content, post_id, show = "") {

    let replace_values = {
        "#USERNAME#": username,
        "#CONTENT#": content,
        "#POST_ID#": post_id,
        "#SHOW#": show
    }

    let formatted_return = COMMENT_BODY;

    for (let [key, value] of Object.entries(replace_values)) {
        formatted_return = formatted_return.replaceAll(key, value);
    }

    return formatted_return;
}