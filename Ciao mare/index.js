const express = require("express")
const app = new express()
const fetch = require("node-fetch")

const getPosts = async () => {
  try {
    let res = await fetch("https://jsonplaceholder.typicode.com/posts")
    res = await res.json()
    return res
  } catch (err) {
    console.log(err)
  }
}

const getComments = async (id) => {
  try {
    let res = await fetch(`https://jsonplaceholder.typicode.com/post/${id}/comments`)
    res = await res.json()
    return res
  } catch (err) {
    console.log(err)
  }
}

app.get("/", async (req, res) => {
  const queryString = req.query
  console.log(queryString)

  let data = await getPosts()
  data = data.reduce((acc, e) => {
    acc += `
      <h1>${e.title}</h1>
      <h3>${e.userId}</h3>
      <p>${e.body}</p>
      <br>
      <br>
      `
    return acc
  }, "")

  res.send(data)
})

app.get("/posts/:id", async (req, res) => {
  const data = await getComments(req.params.id)
  res.send(data)
})

app.listen(8080,() => console.log('server listening on port 8080'))