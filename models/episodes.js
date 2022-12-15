const mongoose = require("mongoose")

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
