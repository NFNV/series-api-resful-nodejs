const mongoose = require("mongoose")

// Schema for series 

// Esquema para las series
const SeriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  episodes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Episode",
    },
  ],
})

module.exports = mongoose.model("Series", SeriesSchema)
