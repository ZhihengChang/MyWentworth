'use strict'

// USER ==============================================================================================

async function signup(newUserInfo){
    try{
        let result = await post('/api/users/signup', newUserInfo);
        
        if(result.status == 'success'){
            showAlert('success', 'Signed up successfully');
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

/**
 * Login the user using given username and password
 * @param {String} username 
 * @param {String} password 
 */
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

/**
 * logout the current user
 */
async function logout(){
    try{
        let result = await get('/api/users/logout');
        if(result.status == 'success'){
            location.reload();
        }
    }catch(err){
        showAlert(err);
    }
}

/**
 * Show the given alert message in given type format
 * sucess: green
 * error: red 
 * @param {String} type 
 * @param {String} msg 
 */
function showAlert(type, msg){
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
}

/**
 * Hide alert message
 */
function hideAlert(){
    const alert = document.querySelector('.alert');
    if(alert){
        alert.parentElement.removeChild(alert);
    }
}

// COMMUNICATION ===================================================================================

/**
 * Send POST request to the given endpoint using fetch. 
 * header is optional
 * @param {String} endpoint 
 * @param {Object} body 
 * @param {Object} header 
 * @returns 
 */
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

/**
 * Send GET request to the given endpoint using fetch
 * @param {String} endpoint 
 * @returns 
 */
async function get(endpoint){
    const res = await fetch(endpoint);
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