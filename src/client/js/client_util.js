'use strict'

// USER ==============================================================================================
async function login(username, password){
    try {
        let result = await post('/api/users/login', {
            username,
            password
        });

        if(result.status=='success'){
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(()=>{
                location.assign('/');
            }, 1000);
            
        }else{
            showAlert('error', result.message);
        }

    }catch(err){
        showAlert(err);
    }
    
}

function showAlert(type, msg){
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
}

function hideAlert(){
    const alert = document.querySelector('.alert');
    if(alert){
        alert.parentElement.removeChild(alert);
    }
}

// COMMUNICATION ===================================================================================
async function post(endpoint, body, header){
    
    let _header = {};
    if(header){
        _header = {
            ...header
        }
    }

    if(!_header['Content-Type']) {
        _header['Content-Type'] = 'application/json;charset=utf-8'; 
    }

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: _header,
        body: JSON.stringify(body)
    });

    return await res.json();
}

// OTHER =============================================================================================
/**
 * Set custom invalid message
 */
 function setInputValidity() {
    const elements = document.getElementsByTagName("input");
    for (let i = 0; i < elements.length; i++) {
        
        elements[i].oninvalid = function (e) {
            e.target.setCustomValidity("");
            if (!e.target.validity.valid) {
                const fieldName = e.target.name;
                e.target.setCustomValidity(`${fieldName} can not be empty!`);
            }
        };

        elements[i].oninput = function (e) {
            e.target.setCustomValidity("");
        };
    }
}