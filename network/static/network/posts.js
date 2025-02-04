
document.addEventListener('DOMContentLoaded', function() {
    let start = 0;

    document.querySelector("#new-post-button").addEventListener('click', () => new_post())
    document.querySelector("#all-posts-nav").addEventListener('click', () => open_all_posts())
    document.querySelector("#new-post-modal-button").addEventListener('click', () => clear_new_post())
    load_posts(start);
});

function open_all_posts() {
    hide_pages();
    document.querySelector("#all-posts-page").style.display = "block";
}

function hide_pages() {
    document.querySelectorAll(".page").forEach(element => {
        element.style.display = "none";
    });
}

async function load_posts(start) {
    const posts = await get_posts(start);

    let body = "";

    posts.forEach(element => {
        body = body + get_body(element);
    });

    document.querySelector("#posts").innerHTML = document.querySelector("#posts").innerHTML + body;
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
    console.log(user);
    document.querySelector("#profile-page").innerHTML = inner_html_profile;
}

async function new_post() {
    const content = document.querySelector("#new-post-content").value;
    console.log(content);

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