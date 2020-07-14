function qs(element) {
    return document.querySelector(element)
}

function ce(element) {
    return document.createElement(element)
}

const quoteList = qs("ul#quote-list")

const newForm = qs("form#new-quote-form")

function showQuotes(quotes) {
    quotes.forEach(quote => {
        addQuote(quote)
    })
}

function addQuote(quote) {
    let li = ce("li")
    li.className = "quote-card"

    let blockquote = ce("blockquote")
    blockquote.className = "blockquote"

    let p = ce("p")
    p.className = "mb-0"
    p.innerText = quote.quote

    let footer = ce("footer")
    footer.className = "blockquote-footer"
    footer.innerText = quote.author

    let br = ce("br")

    let likeButton = ce("button")
    likeButton.className = "btn-success"
    likeButton.innerHTML = "Likes: "
    likeButton.addEventListener("click", () => {
        // likeQuote
        fetch("http://localhost:3000/likes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                quoteId: quote.id,
                createdAt: Date.now()
            })
            })
        .then( () => {
            let likes = parseInt(span.innerText)
            span.innerText = ++likes
        })
    })

    let span = ce("span")
    span.innerText = quote.likes.length
    likeButton.append(span)

    let deleteButton = ce("button")
    deleteButton.className = "btn-danger"
    deleteButton.innerText = "Delete"
    deleteButton.addEventListener("click", () => {
        deleteQuote(quote, li)
        // li.remove()
    })

    blockquote.append(p, footer, br, likeButton, deleteButton)
    li.appendChild(blockquote)

    quoteList.appendChild(li)
}

newForm.addEventListener("submit", () => {
    event.preventDefault()
    let submitQuote = event.target[0].value
    let submitAuthor = event.target[1].value
    postQuote(submitQuote, submitAuthor)
})


fetch("http://localhost:3000/quotes?_embed=likes")
.then( res => res.json())
.then( quotes => showQuotes(quotes))

function postQuote(submitQuote, submitAuthor) {
    return fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            quote: submitQuote,
            author: submitAuthor
        })
    })
    .then( res => res.json())
    .then( newQuote => addQuote(newQuote) )
}

function deleteQuote(quote, li) {
    return fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: "DELETE"
    })
    .then( () => li.remove() )
}

// function likeQuote() {
//     return fetch("http://localhost:3000/likes", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json"
//         },
//         body: JSON.stringify({
//             quoteId: quote.id,
//             createdAt: Date.now()
//         })
//     })
//     .then( () => {
//         let likes = parseInt(span.innerText)
//         span.innerText = ++likes
//     })
// }