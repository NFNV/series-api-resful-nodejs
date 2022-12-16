const mongoose = require("mongoose")

// Schema for episodes 

// Esquema para los episodios
const EpisodeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model("Episode", EpisodeSchema)
