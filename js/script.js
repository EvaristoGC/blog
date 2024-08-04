const url = "https://jsonplaceholder.typicode.com/posts"

const loadingElement = document.getElementById('loading')
const postsContainer = document.getElementById('posts-container')

const postPage = document.querySelector('#post')
const postContainer = document.querySelector('#post-container')
const comentsContainer = document.querySelector('#coments-container')

const comentForm = document.querySelector('#coment-form')
const emailInput = document.querySelector('#email')
const bodyInput = document.querySelector('#body')

//Get id from URL
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get('id');

//Get all posts
async function getAllPosts(){
    const response = await fetch(url)

    const data = await response.json()
    
    loadingElement.classList.add("hide")

    data.map((post) => {
        const title = document.createElement('h2')
        const body = document.createElement('p')
        const link = document.createElement('a')

        title.innerText = post.title
        body.innerText = post.body
        link.innerText = "Ler"
        link.setAttribute('href', `/post.html?id=${post.id}`)

        postsContainer.appendChild(title)
        postsContainer.appendChild(body)
        postsContainer.appendChild(link)

    })
}

// Get individual post
async function getPost(id){
    const [responsePost, responseComents] = await Promise.all([
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`)
    ])

    const dataPost = await responsePost.json()
    const dataComents = await responseComents.json()

    loadingElement.classList.add('hide'),
    postPage.classList.remove('hide')

    const title = document.createElement('h1')
    const body = document.createElement('p')

    title.innerText = dataPost.title
    body.innerText = dataPost.body

    postContainer.appendChild(title)
    postContainer.appendChild(body)

    dataComents.map((coment) => {
        createComent(coment)
    })
}

function createComent(coment){
    const email = document.createElement('h3')
    const comentBody = document.createElement('p')

    email.innerText = coment.email
    comentBody.innerText = coment.body

    comentsContainer.appendChild(email)
    comentsContainer.appendChild(comentBody)
}

//post a comment
async function postComment(comment){
    const response = await fetch(`${url}/${postId}/comments`, {
        method: 'POST',
        body: comment,
        headers:{
            'content-type': 'application/json'
        }
    })
    const data = await response.json()
    emailInput.value = ''
    bodyInput.value = ''
    createComent(data)
}

if(!postId){
    getAllPosts()
} else{
    getPost(postId)

    //Add event to comment form
    comentForm.addEventListener('submit', (e) =>{
        e.preventDefault()

        let comment = {
            email: emailInput.value,
            body: bodyInput.value
        }
        comment = JSON.stringify(comment)
        postComment(comment)
    })
}