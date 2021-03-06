var issueContainerEl = document.querySelector("#issues-container")
var limitWarningEl = document.querySelector("#limit-warning")
var repoNameEl = document.querySelector("#repo-name")

var getRepoName = function () {
    // grab repo name from url query string
    var queryString = document.location.search
    // console.log(queryString)
    var repoName = queryString.split("=")[1] // breaks apart query string so we can just get repo name
    // console.log(RepoName)

    if (repoName) { // if repo name exists then display name on top of page
        repoNameEl.textContent = repoName
        getRepoIssues(repoName)
    } else {
        document.location.replace("./index.html") // if repo user clicked on doesn't exist or no repo was given, then route user back to home page to try another repo
    }
}

// function to fetch the repo that was clicked on from GitHub API 
var getRepoIssues = function (repo) {
    var apiURL = "https://api.github.com/repos/" + repo + "/issues?direction=asc"

    fetch(apiURL).then(function (response) {
        if (response.ok) { // check if request was successful ie 200
            response.json().then(function (data) { // why do we pass "data" in the argument? 
                // console.log(data)
                displayIssues(data)

                // check if api has paginated issues
                if (response.headers.get("Link")) {
                    // console.log("repo has more than 30 issues")
                    displayWarning(repo)
                }
            })
        } else {
            document.location.replace("./index.html")
        }
    })
}

// function to display the info from the API on the page
var displayIssues = function (issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues."
        return;
    }

    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a")
        issueEl.classList = "list-item flex-row justify-space-between align-center"
        issueEl.setAttribute("href", issues[i].html_url)
        issueEl.setAttribute("target", "_blank") // opens up new tab for link 

        // create span to hold issue title
        var titleEl = document.createElement("span")
        titleEl.textContent = issues[i].title

        // append to container
        issueEl.appendChild(titleEl)

        // create a type element
        var typeEl = document.createElement("span")
        // check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull reqest)"
        } else {
            typeEl.textContent = "(Issue)"
        }

        // append the type element to issue element
        issueEl.appendChild(typeEl)

        // append the issue element <a> to the container
        issueContainerEl.appendChild(issueEl)
    }
}

// warning added to bottom of page that tells user if the repo has more than 30 open issues/pull requests
var displayWarning = function (repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit "

    var linkEl = document.createElement("a")
    linkEl.textContent = "GitHub.com"
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues")
    linkEl.setAttribute("target", "_blank")

    // append to warning container
    limitWarningEl.appendChild(linkEl)
}

getRepoName()
// getRepoIssues()
