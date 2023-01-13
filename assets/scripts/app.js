const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');
const form = document.querySelector('#new-post form');
const fetchBtn = document.querySelector('#available-posts button');
const postList = document.querySelector('ul');

const url = 'https://jsonplaceholder.typicode.com/posts';

function sendHttpRequest(method, url, type, data) {
    // return new Promise((resolve, reject) => {
    //     const xhr = new XMLHttpRequest();
    //     xhr.open(method, url);
    //     xhr.responseType = type;
    //     xhr.onload = function () {
    //         if (xhr.status >= 200 && xhr.status < 300) {
    //             resolve(xhr.response)
    //         } else {
    //             reject(new Error('Something went wrong...'))
    //         }
    //     }
    //
    //     xhr.onerror = function () {
    //         reject(new Error('Failed to send request'));
    //     }
    //     xhr.send(JSON.stringify(data));
    // });
    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status >= 200 && response.status < 300) {
            return response.json()
        } else {
            return response.json().then(errData => {
                console.log(errData);
                throw new Error('Something went wrong - server-side.');
            });
        }
    })
        .catch(error => {
            console.log(error);
            throw new Error('Something went wrong!')
        })

}

async function fetchPosts() {
    try {
        const response = await axios.get(url);
        console.log(response)
        for (const post of response.data) {
            const postEl = document.importNode(postTemplate.content, true);
            postEl.querySelector('h2').textContent = post.title.toUpperCase();
            postEl.querySelector('p').textContent = post.body.toUpperCase();
            postEl.querySelector('li').id = post.id;
            listElement.append(postEl)
        }
    } catch (error) {
        alert(error.message)
        console.log(error.response)
    }

}


async function createPost(title, content) {
    const userId = (Math.random() * 100).toFixed(0)
    const post = {
        title: title,
        body: content,
        userId: userId
    }
    const response = await axios.post(url, post);
    console.log(response)
}

// function fetchBtnHandler() {
//     fetchPosts()
//     // .then(r => console.log(r));
// }

fetchBtn.addEventListener('click', fetchPosts)

form.addEventListener('submit', event => {
    event.preventDefault()
    const enteredTitle = event.currentTarget.querySelector('#title').value;
    const enteredContent = event.currentTarget.querySelector('#content').value;
    createPost(enteredTitle, enteredContent)
})

postList.addEventListener('click', event => {
    if (event.target.tagName === 'BUTTON') {
        const postId = event.target.closest('li').id;
        axios.delete(url + `/${postId}`, 'json')
    }
})









