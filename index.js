import express from 'express'
import multer from 'multer'
import path from 'path'
import mysql from 'mysql2/promise'

mysql.createConnection({
    host: 'pauliuspetrunin.lt',
    user: 'bit',
    password: 'kulokas',
    database: 'test'
})

const port = process.env.port || 3000

//Konfigūracija nuotraukų priėmimui
const storage = multer.diskStorage({
    //Kuriame kataloge bus saugomos nuotraukos
    destination: function (req, file, cb) {
      cb(null, './nuotraukos')
    },
    //Konfigūruojama nuotraukos pavadinimas
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.')

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + ext[ext.length - 1]
      cb(null, uniqueSuffix)
    }
})

const upload = multer({ 
    storage: storage,
    //Konfigūruojama kokia nuotrauka bus priimta
    fileFilter: function (req, file, next) {
        if( file.mimetype === 'image/jpeg' || 
            file.mimetype === 'image/png' || 
            file.mimetype === 'image/gif') 
        {
            next(null, true)
        } else {
            next(null, false)
        }
    }
})

const app = express()

//Konfigūracija POST metodu perduodamų duomenų priėmimui
app.use(express.urlencoded({ extended: true }))

//Kinfogūracinė eilutė nuotraukoms perduoti į naršyklę
app.use('/nuotraukos', express.static('nuotraukos'))

//Middleware - nuotraukų priėmimo funkcija
app.post('/', upload.single('nuotrauka'), (req, res) => {
    if(req.file)
    res.send(req.file.filename)
    else 
    res.send('yra')
})

app.get('/', (req, res) => {
    res.sendFile(path.resolve('./templates/index.html'))
})

app.listen(port)
