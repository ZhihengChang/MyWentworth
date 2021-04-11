// DOM ElEMENTS
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logoutBtn = document.querySelector('.Signout');

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
    logoutBtn.addEventListener('click', logout)
}

//GLOBAL
document.addEventListener("DOMContentLoaded", function () {
    setInputValidity();
});



