// DOM ElEMENTS
const loginForm = document.querySelector('.form--login');

// DELEGATION
if(loginForm){
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('usn').value;
        const password = document.getElementById('pwd').value;
        login(username, password);
    });
}

//GLOBAL
document.addEventListener("DOMContentLoaded", function () {
    setInputValidity();
});



