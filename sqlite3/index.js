const sqlite3 = require("sqlite3")

const db  = new sqlite3.Database("./db.db3")

db.serialize(() => {
	db.run(`
	CREATE TABLE IF NOT EXISTS Users (
	  username TEXT NOT NULL,
	  password TEXT NOT NULL,
	  UNIQUE(username, password)
	)`)
})

let query = "INSERT INTO Users VALUES"
for (let i = 1; i < 11; i++) {
	query += `("username ${i}", "username ${i}")${i !== 10 ? ",\n" : ";"}`
}

db.run(query)

const express = require("express")
const app = new express()

app.use(express.json())

app.post("/login", (req, res) => {
	const {username, password} = req.body
	console.log({username, password})
	if(username && password) {
		db.all("SELECT * FROM Users WHERE username = ? AND password = ?", username, password, (err, rows) => {
		    if (err) {
		        res.status(500).send(err.message)
		    } else if (rows.length) {
		        res.status(200).send({ ok: true })
		    } else {
		        res.status(401).send({ ok: false })
		    }
	    })
	} else {
		res.status(401).send({ok: false})
	}
})

app.listen(8080, console.log("Server listening on port 8080"))