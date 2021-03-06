// DOM ElEMENTS
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logoutBtn = document.querySelector('.Signout');
const likeBtns = document.querySelectorAll('.post-like-count');

// WEB MODAL
// Open btn
const newPostBtn = document.querySelector('.Moment');
// Modal
const createPostModal = document.querySelector('#postModal')
// Close btn
const modalCloseBtn = document.querySelector('.modal-close') ;

// DATA
const data = document.querySelector('#data');

// DELEGATION
if(signupForm){
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newUserInfo = {
            wit_id:          document.getElementById('wit').value,
            username:        document.getElementById('usn').value,
            email:           document.getElementById('eml').value,
            password:        document.getElementById('pwd').value,
            passwordConfirm: document.getElementById('cfm').value,
        }
        signup(newUserInfo);
    })
}

if(loginForm){
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('usn').value;
        const password = document.getElementById('pwd').value;
        login(username, password);
    });
}

if(logoutBtn){
    logoutBtn.addEventListener('click', logout);
}

if(newPostBtn){
    if(createPostModal){
        newPostBtn.addEventListener('click', () => {
            openModal(createPostModal);
        });
        createPostModal.querySelector('.modal-close').addEventListener('click',
            () => {
                closeModal(createPostModal);
            }
        )
        createPostModal.querySelector('.form--create-post').addEventListener('submit',
            (event) => {
                event.preventDefault();
                const author = JSON.parse(data.value).username;
                const content = createPostModal.querySelector('#post-content').value;
                newPost({ 
                    author, 
                    content,
                    post_ts: new Date(),
                });
                closeModal(createPostModal);
            }
        )
    }
    
}

if(likeBtns){
    for(const likeBtn of likeBtns){
        likeBtn.addEventListener('click', (event) => {
            event.preventDefault();
            if(data.value) {
                const user_id = JSON.parse(data.value)._id;
                const footer = event.target.parentNode.parentNode;
    
                if(footer.className == 'post-card-footer'){
                    const post_id = footer.childNodes[0].value;
                    const count = footer.childNodes[1].childNodes[2];
                    likePost(post_id, user_id, count);
                }
            }else {
                showAlert('error', 'You are not logged in, please try again after login');
            }
        });
    }
}

//GLOBAL
document.addEventListener("DOMContentLoaded", function () {
    setInputValidity();
});

window.addEventListener('click', (event) => {
    if(event.target == createPostModal) closeModal(createPostModal);
})



