const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');
const form = document.querySelector('#new-post form');
const fetchBtn = document.querySelector('#available-posts button');
const postList = document.querySelector('ul');

const url = 'https://jsonplaceholder.typicode.com/post';

function sendHttpRequest(method, url, type, data) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.responseType = type;
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response)
            } else {
                reject(new Error('Something went wrong...'))
            }
        }

        xhr.onerror = function () {
            reject(new Error('Failed to send request'));
        }
        xhr.send(JSON.stringify(data));
    });
}

async function fetchPosts() {
    try {
        const responseData = await sendHttpRequest('GET', url, 'json');
        for (const post of responseData) {
            const postEl = document.importNode(postTemplate.content, true);
            postEl.querySelector('h2').textContent = post.title.toUpperCase();
            postEl.querySelector('p').textContent = post.body.toUpperCase();
            postEl.querySelector('li').id = post.id;
            listElement.append(postEl)
        }
        return 'Finished'
    } catch (error) {
        alert(error.message)
    }
}


async function createPost(title, content) {
    const userId = (Math.random() * 100).toFixed(0)
    const post = {
        title: title,
        body: content,
        userId: userId
    }
    await sendHttpRequest('POST', url, 'json', post)
}

function fetchBtnHandler() {
    fetchPosts().then(r => console.log(r));
}

fetchBtn.addEventListener('click', fetchBtnHandler)
form.addEventListener('submit', event => {
    event.preventDefault()
    const enteredTitle = event.currentTarget.querySelector('#title').value;
    const enteredContent = event.currentTarget.querySelector('#content').value;
    createPost(enteredTitle, enteredContent)
})

postList.addEventListener('click', event => {
    if (event.target.tagName === 'BUTTON') {
        const postId = event.target.closest('li').id;
        sendHttpRequest('DELETE', url + `/${postId}`, 'json')
    }
})









