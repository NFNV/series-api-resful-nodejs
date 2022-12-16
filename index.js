// Importing express

// Importando express
const express = require("express")

// Importing mongoose

// Importando mongoose
const mongoose = require("mongoose")

// Importing dotenv

// Importando dotenv
const dotenv = require("dotenv")

// Importing router

// Importando router
const router = require("./routes")

// Now we have access to the express app

// Ahora tenemos acceso a la app de express
const app = express()

// Middleware, this will allow us to read the petition's body

// Middleware, esto nos permite leer la petición del body
app.use(express.json())

// Loading env config. Petitions will arrive here, then the petitions are delegated to routes/index.js

// Cargando la config. de env. Las peticiones llegarán acá, luego serán delegadas a routes/index.js
dotenv.config()

// Middleware for '/api', then redirects to Router

// Middleware para '/api', luego redirige a Router
app.use("/api", router)

// Connecting to MongoDB

// Conectando a MongoDB
mongoose.connect(
  process.env.MONGO_DB,
  { useNewUrlParser: true },
  (error, result) => {
    if (error) return console.log(`Error connecting to DB ${error}`)
    console.log('Conection to the DB')

    // Listening petitions, server up on port 3000

    // Escuchando peticiones, servidor levantado en el puerto 3000
    app.listen(process.env.PORT, () => {
      console.log(`Server up on port ${process.env.PORT}`)
    })
  }
)
