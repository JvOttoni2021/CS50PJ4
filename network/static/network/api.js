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

async function get_posts(start = 0) {
    return fetch(`/posts/all?start=${start}`, {
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