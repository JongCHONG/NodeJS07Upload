const express = require("express")
const app = express()
const port = 5000
const session = require("express-session")
const passport = require("./config/passport")
const cors = require("cors")

const authRoutes = require("./routes/auth")
const adminRoutes = require("./routes/admin")

// import du package multer
const multer  = require('multer')

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))

app.use(express.json())

app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use("/auth", authRoutes)
app.use("/admin", adminRoutes)

// on rend accessible le dossier public
app.use(express.static('public'))

// création d'une "mini" config multer
// cette ligne va créer le dossier /public/uploads s'il n'existe pas
const upload = multer({ dest: 'public/uploads/' })

// POST sur la route `/file` qui utilise le middleware multer
// Le middleware va créer le fichier automatiquement et rendre
// les informations disponible dans `req.file`
app.post('/file', upload.single('file'), function (req, res, next) {
  console.log(req.file)
	// on renomme le fichier créé
  fs.renameSync(req.file.path, req.file.originalname)
  res.send("ok")
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})