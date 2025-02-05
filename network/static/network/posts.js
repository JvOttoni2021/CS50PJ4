
document.addEventListener('DOMContentLoaded', async function() {
    let start = 0;

    await load_posts(page="all", 0, "all-posts-page");
    document.querySelector("#new-post-button").addEventListener('click', () => new_post());
    document.querySelector("#all-posts-nav").addEventListener('click', () => open_all_posts());
    document.querySelector("#following-posts-nav").addEventListener('click', () => open_following_posts());
    const new_post_button = document.querySelector("#new-post-modal-button");
    if (!new_post_button === undefined) {
        document.querySelector("#new-post-modal-button").addEventListener('click', () => clear_new_post())
    }
});

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

async function load_posts(page, start, div_id) {
    const posts = await get_posts(page=page, start=start);

    let body = "";
    posts.forEach(element => {
        body = body + get_body(element);
    });

    document.querySelector("#" + div_id).innerHTML = document.querySelector("#" + div_id).innerHTML + body;
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