'use strict'
// import * as util from './client_util';

async function login(username, password){
    try {
        const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        let result = await res.json();
        // console.log(result);

        if(result.status=='success'){
            alert('logged in successfully!');
            window.setTimeout(()=>{
                location.assign('/');
            }, 1500)
        }else{
            alert(result.message);
        }
    }catch(err){
        alert(err);
    }
    
}



document.querySelector('.form--login').addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('usn').value;
    const password = document.getElementById('pwd').value;
    login(username, password);
});