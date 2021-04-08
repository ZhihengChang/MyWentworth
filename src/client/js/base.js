document.addEventListener("DOMContentLoaded", function () {
    setInputValidity();
});

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
