async function post_new_post(content) {
    return fetch('/posts', {
        method: 'POST',
        body: JSON.stringify({
            content: content
        })
    })
    .then(response => response.json())
    .then(result => {
        return result;
    })
    .catch(error => {
        console.error('Error:', error);
        throw error;
    });
}

async function get_posts(page = "all", start = 0) {
    return fetch(`/posts/${page}?start=${start}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(result => {
        return result;
    })
    .catch(error => {
        console.error('Error:', error);
        throw error;
    });
}

async function get_user(user_id) {
    return fetch(`/users/${user_id}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(result => {
        return result;
    })
    .catch(error => {
        console.error('Error:', error);
        throw error;
    });
}

async function post_follow(user_id) {
    return fetch(`/follow/${user_id}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(result => {
        return result;
    })
    .catch(error => {
        console.error('Error:', error);
        throw error;
    });
}