const express = require("express")
const app = new express()

app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
  res.send(__dirname + "/public/index.html")
})

app.listen(8080, () => {
  console.log("Server listening on port 8080")
})