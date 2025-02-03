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