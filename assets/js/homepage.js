var userFormEl = document.querySelector("#user-form")
var nameInputEl = document.querySelector("#username")
var repoContainerEl = document.querySelector("#repos-container")
var repoSearchTerm = document.querySelector("#repo-search-term")

// after clicking "get user", this function is executed 
var formSubmitHandler = function (event) {
    event.preventDefault()

    // get value from input element (the trim will leave off any trailing space in the input element)
    var username = nameInputEl.value.trim()

    // check if there is a value in the username variable (is true)
    if (username) {
        getUserRepos(username)
        nameInputEl.value = ""
    } else {
        alert("Please enter a GitHub username")
    }
}

// once user searches for repo by username, this function finds the username github
var getUserRepos = function (user) { // why do we put user here in the argument? user is not defined anywhere? 
    // format the github api url
    var apiUrl = "http://api.github.com/users/" + user + "/repos";

    // make a request to the url
    fetch(apiUrl).then(function (response) {
        // when the http request status code is something in the 200s, the ok property will be true
        if (response.ok) {
            response.json().then(function (data) {
                displayRepos(data, user)
            })
        } else { // if false...
            alert("Error: GitHub User Not Found")
        }
    })
        .catch(function (error) {
            // Notice this '.catch()' getting chained onto the end of the '.then()' method
            alert("Unable to connect to GitHub")
        })
}

// display searched repo on the page
var displayRepos = function (repos, searchTerm) {
    console.log(repos)
    console.log(searchTerm)

    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found."
        return;
    }

    // clear old content
    repoContainerEl.textContent = ""
    repoSearchTerm.textContent = searchTerm

    // loops over repos 
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name
        // console.log(repoName)

        // create a link for each repo
        var repoEl = document.createElement("a")
        repoEl.classList = "list-item flex-row justify-space-between align-center"
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName)

        // create a span element to hold repository name
        var titleEl = document.createElement("span")
        titleEl.textContent = repoName

        // append to container
        repoEl.appendChild(titleEl)

        // create a status element
        var statusEl = document.createElement("span")
        statusEl.classList = "flex-row align-center"

        //check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)"
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>"
        }

        // append to container
        repoEl.appendChild(statusEl)

        // append container to the dom
        repoContainerEl.appendChild(repoEl)
    }
}

userFormEl.addEventListener("submit", formSubmitHandler)
