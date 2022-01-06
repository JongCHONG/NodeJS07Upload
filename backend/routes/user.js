const express = require("express")
const app = express()
// import du package multer
const multer  = require('multer')

const users = require("../users.json")
const fs = require("fs")

const moment = require('moment') // require

app.get('/:id', (req, res) => {
  const { id } = req.params
  console.log(id);
  const user = users.find(element => element.id === Number(id))

  res.json(user)
})

const upload = multer({ dest: 'public' })

//'photo' => clé dans postman
app.post('/:id/file', upload.single('photo'), (req, res) => {
  const { id } = req.params
  const userIndex = users.findIndex(element => element.id == id)

  const time = moment().format("DD-MM-YYYY-hh-mm-ss")
  const photoUrl = `${users[userIndex].username}-${time}.jpg`
  fs.renameSync(req.file.path, `public/${photoUrl}`)
  
  fs.readFile('./users.json', (err, data) => {
    const users = JSON.parse(data)
    users[userIndex].profile_picture = `http://localhost:5000/${photoUrl}`

    fs.writeFile('./users.json', JSON.stringify(users), (err) => {
      res.json({ success: "File uploaded" })
    })
  })
})

module.exports = app