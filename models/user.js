const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  registerDate: {
    type: Date,
    default: Date.now,
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Series",
    },
  ],
})

// Hash the user's password before saving it to the database

// Hashear la contraseña del usuaruio antes de guardarla en la base de datos
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next()
    }

    const hashedPassword = await bcrypt.hash(this.password, 10)
    this.password = hashedPassword

    return next()
  } catch (err) {
    return next(err)
  }
})

// Compare the provided password with the hashed password in the database

// Comparar la contraseña provista con la contraseña hasheada en la base de datos
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
  } catch (err) {
    return err
  }
}

// Convert the user object to a JSON object with only the fields we want to expose

// Convertir el objeto del usuario a un objeto JSON con solo los campos que queremos exponer
userSchema.methods.toAuthJSON = function () {
  return {
    id: this._id,
    email: this.email,
    registerDate: this.registerDate,
  }
}

const User = mongoose.model("User", userSchema)

module.exports = User
