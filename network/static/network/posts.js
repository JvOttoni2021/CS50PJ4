
document.addEventListener('DOMContentLoaded', async function() {

    await load_posts(page="all", 0, "all-posts-page");
    document.querySelector("#new-post-button").addEventListener('click', () => new_post());
    document.querySelector("#all-posts-nav").addEventListener('click', () => open_all_posts());
    document.querySelector("#following-posts-nav").addEventListener('click', () => open_following_posts());
    const new_post_button = document.querySelector("#new-post-modal-button");
    if (!new_post_button === undefined) {
        document.querySelector("#new-post-modal-button").addEventListener('click', () => clear_new_post());
    }
});

async function handle_edit_click(button, post_id) {
    let cardBody = button.closest(".card-body");
    let postBody = cardBody.querySelector(".post-body");

    if (button.textContent === "Edit") {
        let originalText = postBody.textContent.trim();

        postBody.innerHTML = `<textarea class="form-control post-textarea">${originalText}</textarea>`;

        button.textContent = "Save";
    } else {
        let updatedText = cardBody.querySelector(".post-textarea").value.trim();

        const response = await put_post(post_id, updatedText);

        if (response.error !== undefined) {
            alert(response.error);
            return;
        }

        postBody.innerHTML = updatedText;

        button.textContent = "Edit";
    }
}


async function handle_like_click(button, post_id) {
    let cardBody = button.closest(".card-body");
    let likeCount = cardBody.querySelector(".likes-count");
    let like_icon = cardBody.querySelector(".like-icon");

    if (likeCount.dataset.liked === "true") {
        let new_count = parseInt(likeCount.innerHTML) - 1;
        console.log(new_count);
        console.log(likeCount.innerHTML);
        likeCount.innerHTML = new_count;
        
        like_icon.innerHTML = UNLIKED_POST;
        likeCount.dataset.liked = "false";
    } else {
        let new_count = parseInt(likeCount.innerHTML) + 1;
        console.log(new_count);
        console.log(likeCount.innerHTML);
        likeCount.textContent = new_count;
        
        like_icon.innerHTML = LIKED_POST;
        likeCount.dataset.liked = "true";
    }
    await post_like(post_id);
}

function open_all_posts() {
    hide_pages();
    document.querySelector("#all-posts-page").style.display = "block";
}

function open_following_posts() {
    hide_pages();
    document.querySelector("#following-posts-page").innerHTML = "";
    document.querySelector("#following-posts-page").style.display = "block";
    load_posts(page="following", 0, "following-posts-page")
}

function hide_pages() {
    document.querySelectorAll(".page").forEach(element => {
        element.style.display = "none";
    });
}

function previous_next(action, div_id) {
    let current_page = parseInt(document.querySelector(`#current-${div_id}-page`).innerHTML);
    let new_page_number = 0;
    if (action === "previous") {
        if (current_page > 1) {
            new_page_number = current_page - 1;
        }
    }
    else {
        
        if (current_page < document.querySelectorAll(`.page-${div_id}-pagination`).length) {
            new_page_number = current_page + 1;
        }
    }

    if (new_page_number === 0) return;

    shows_pagination(new_page_number, div_id);
    document.querySelector(`#current-${div_id}-page`).innerHTML = new_page_number;
}

function shows_pagination(index, div_id){
    document.querySelectorAll(`.page-${div_id}-pagination`).forEach(element => {
        element.style.display = "none";
    });
    document.querySelector(`#posts-${div_id}-${index}`).style.display = "block";
}

async function load_posts(page, start, div_id) {
    const posts = await get_posts(page=page, start=start);

    const posts_len = posts.length;
    const posts_per_page = 5;

    const page_count = Math.ceil(posts_len/posts_per_page);
    let body;
    if (page_count <= 1) {

        body = '';
    
        posts.forEach(element => {
            body = body + get_body(element);
        });
    }
    else {
        const paginator_nav = get_paginator(page_count, div_id);
        body = paginator_nav + `<div class="page-${div_id}-pagination" id="posts-${div_id}-1">`;
        let current_page = 1;
        for (let index = 0; index < posts_len; index++) {
            body = body + get_body(posts[index]);

            if ((index + 1) % posts_per_page === 0) {
                current_page = current_page + 1;
                body = body + '</div>';
                if (posts_len !== index + 1) {
                    body = body + `<div class="page-${div_id}-pagination" id="posts-${div_id}-${current_page}">`;
                }
            }
        }

        if (!body.endsWith('</div>')) {
            body = body + '</div>'
        }
    }

    document.querySelector("#" + div_id).innerHTML = document.querySelector("#" + div_id).innerHTML + body;
    if (page_count > 1) {
        shows_pagination(1, div_id);
    }
}

async function show_profile(user_id) {
    hide_pages();
    document.querySelector("#profile-page").style.display = "block";

    const loaded_profile = document.querySelector("#loaded-profile");
    if (loaded_profile != undefined && loaded_profile.innerHTML === user_id) return;

    const user = await get_user(user_id);
    let inner_html_profile = get_body_user(user);
    user.posts.forEach(post => {
        inner_html_profile = inner_html_profile + get_body(post);
    });

    document.querySelector("#profile-page").innerHTML = inner_html_profile;
}

async function new_post() {
    const content = document.querySelector("#new-post-content").value;

    response = await post_new_post(content);

    if (response.error !== undefined) {
        document.querySelector("#new-post-validation").className = "w-100 p-2 mb-1 text-bg-danger rounded-3";
        document.querySelector("#new-post-validation").innerHTML = response.error;
        document.querySelector("#new-post-validation").style.color = "var(--bs-danger)";
        return;
    }
    clear_new_post();
    document.querySelector("#new-post-validation").className = "w-100 p-2 mb-1 text-bg-success rounded-3";
    document.querySelector("#new-post-validation").innerHTML = response.message;
}

function clear_new_post() {
    document.querySelector("#new-post-content").value = "";
    document.querySelector("#new-post-validation").innerHTML = "";
    document.querySelector("#new-post-validation").className = "";
}

async function handle_follow(button, user_id) {
    await post_follow(user_id);
    let followers_object = document.querySelector("#followers-amount");
    let amount_followers = parseInt(followers_object.innerHTML);

    let new_inner_html = "Follow";
    if (button.innerHTML === new_inner_html) {
        amount_followers = amount_followers + 1;
        new_inner_html = "Unfollow";
    }
    else {
        amount_followers = amount_followers - 1;
    }
    followers_object.innerHTML = amount_followers;
    button.innerHTML = new_inner_html;
}