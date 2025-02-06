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

async function get_posts(page = "all") {
    return fetch(`/posts/${page}`, {
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

async function post_like(post_id) {
    return fetch(`/like/${post_id}`, {
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

async function put_post(post_id, new_content) {
    return fetch(`/posts/${post_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            content: new_content
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