const faker = require("faker")
const express = require("express")
const app = new express()
const PORT = 8080

const teams = {
  a: {
    name: "a",
    password: "",
    score: 100,
    killedShips: [],
    firedBullets: 10,
    lastFiredBullet: new Date().getTime()
  }
}

const field = []
const ships = []

const W = process.argv[2] || 6
const H = process.argv[3] || 6
const S = process.argv[4] || 10

for (let y = 0; y < H; y++) {
  const row = []
  for (let x = 0; x < W; x++) {
    row.push({
      team: null,
      x,
      y,
      ship: null,
      hit: false
    })
  }
  field.push(row)
}

let id = 1
for (let i = 0; i < S; i++) {
  const maxHp = faker.random.number({ min: 1, max: 6 })
  const vertical = faker.random.boolean()

  const ship = {
    id,
    name: faker.name.firstName(),
    x: faker.random.number({ min: 0, max: vertical ? W - 1 : W - maxHp }),
    y: faker.random.number({ min: 0, max: vertical ? H - maxHp : H - 1 }),
    vertical,
    maxHp,
    curHp: 4,
    alive: true,
    killer: null
  }

  let found = false
  for (let e = 0; e < ship.maxHp; e++) {
    const x = ship.vertical ? ship.x : ship.x + e
    const y = ship.vertical ? ship.y + e : ship.y
    if (field[y][x].ship) {
      found = true
      break
    }
  }

  if (!found) {
    for (let e = 0; e < ship.maxHp; e++) {
      const x = ship.vertical ? ship.x : ship.x + e
      const y = ship.vertical ? ship.y + e : ship.y
      field[y][x].ship = ship
    }

    ships.push(ship)
    id ++
  }
}

app.get("/", ({ query: { format } }, res) => {
  const visibleField = field.map(row => row.map(cell => ({
    x: cell.x,
    y: cell.y,
    hit: cell.hit,
    team: cell.team,
    ship: cell.hit ?
      cell.ship ? { id: cell.ship.id, name: cell.ship.name, alive: cell.ship.alive, killer: cell.ship.killer } : null
      : null
  })))

  const visibleShipInfo = ships.map(ship => ({
    id: ship.id,
    name: ship.name,
    alive: ship.alive,
    killer: ship.killer
  }))

  if (format === "json") {
    res.json({
      field: visibleField,
      ships: visibleShipInfo
    })
  } else {
    // html format field
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>battaglia navale</title>
      <style>
        table, td, th {
          border: 1px solid black;
        }

        td {
          width: 40px;
          height: 40px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
      </style>
    </head>
    <body>
      <table>
        <tbody>
          ${visibleField.map(row => `<tr>${row.map(cell => `<td>${cell.ship ? cell.ship.name : ""}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </body>
    </html>
    `)
  }
})

app.get("/score", (req, res) => {
  res.json([])
})

app.get("/signup", (req, res) => {
  // team password
})

app.get("/fire", ({ query: { x, y, team, password } }, res) => {

  teams[team].firedBullets += 1
  // CONTROLLO LA PASSWORD
  if (teams[teams]?.password !== password) {
    res.send({ message: "credenziali sbagliate" })
  } else if ((new Date().getTime() - teams[team].lastFiredBullet) <= 1000) {
    // CONTROLLO ULTIMA VOLTA CHE è STATO SPARATO UN BULLET
    res.send({ message: "ritenta fra 1 secondo" })
  } else if (x > W || y > H) {
    teams[team].lastFiredBullet = new Date().getTime()
    teams[team] = teams[team] - 5
    res.send({ message: "fuori campo", score: teams[team].score })
  } else if (field[y][x].ship !== null && field[y][x].hit !== true) {
    // C'E' LA NAVE
    teams[team].lastFiredBullet = new Date().getTime()
    if (field[y][x].ship.curHp === 1) {
      // NAVE AFFONDATA
      field[y][x].ship.alive = false
      field[y][x].ship.curHp = 0
      field[y][x].ship.killer = team
      teams[team].killedShips.push(field[y][x].ship)
      teams[team].score += 2
      res.send({ message: "nave affondata", score: teams[team].score })
    } else {
      // NAVE COLPITA
      field[y][x].killer = team
      field[y][x].curHp -= 1
      teams[team].killedShips.push(field[y][x])
      teams[team].score += 1
      res.send({ message: "nave colpita", score: teams[team].score })

    }
  } else if (field[y][x].hit === true) {
    teams[team].lastFiredBullet = new Date().getTime()

    // CELLA GIA' COLPITA
    teams[team].score = teams[team].score - 2
    res.send({ message: "casella già colpita", score: teams[team].score })
  } else {
    teams[team].lastFiredBullet = new Date().getTime()

    // ACQUA
    field[y][x].hit = true
    res.send({ message: "acqua", score: teams[team].score })
  }
})

app.all("*", (req, res) => {
  res.sendStatus(404)
})

app.listen(PORT, () => console.log("App listening on port %O", PORT))