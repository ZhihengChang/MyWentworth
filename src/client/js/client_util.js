'use strict'

export {
    post
};

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