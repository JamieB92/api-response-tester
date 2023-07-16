const API_KEY = "76vsqdrUPTgUe94mFgmMg0nF7JI"
const API_URL = "https://ci-jshint.herokuapp.com/api"
// created the bootstrap modal once call apon
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"))

// event listner for Check key button which calls getStatus
document.getElementById("status").addEventListener("click", e => getStatus(e))
// event listner for submit button which posts the form to the api
document.getElementById("submit").addEventListener("click", e => postForm(e))

//function to post the data to the API call per the documentation at https://ci-jshint.herokuapp.com/
async function postForm(e) {
    const form = new FormData(document.getElementById("checksform"))


    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                                "Authorization": API_KEY,
                        },
                        body: form,
    })
    
    const data = await response.json();

    if (response.ok) {
        displayErrors(data)
    } else {
        throw new Error(data.error)
    }
}

// function to disply the returning error data in a modal
function displayErrors(data) {

    let results = ""

    let heading = `JSHint Results for ${data.file}`;
    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}:</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
    
}



// function to sign in the api
async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`
    const response = await fetch(queryString)
    const data = await response.json()
    if (response.ok) {
        displayStatus(data)
    } else {
        throw new Error(data.error)
    }
}

// function to display the info in the check key modal
function displayStatus(data) {

    let heading = "API Key Status"
    let results = `<div>Your Key is valid until</div>`
    results += `<div class="key-status">${data.expiry}</div>`

    document.getElementById("resultsModalTitle").innerHTML = heading
    document.getElementById("results-content").innerHTML = results
    resultsModal.show()
}