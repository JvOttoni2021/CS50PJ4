document.addEventListener('DOMContentLoaded', function() {
    document.querySelector("#new-post-button").addEventListener('click', () => new_post())
    document.querySelector("#new-post-modal-button").addEventListener('click', () => clear_new_post())
});

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