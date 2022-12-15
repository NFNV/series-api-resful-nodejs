const express = require("express")
const router = express.Router()

const User = require("../models/user")
const Series = require("../models/series")
const Episode = require("../models/episodes")

// Login endpoint
router.post("/users/login", async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password

    // Validate the email and password, and return a JSON response with
    // the user's information if the login is successful
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" })
    }

    return res.json({ user: user.toAuthJSON() })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// Register endpoint
router.post("/users/register", async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password

    // Create a new user in the database and return a JSON response with
    // the user's information
    const user = new User({
      email: email,
      password: password,
    })

    await user.save()

    return res.json({ user: user.toAuthJSON() })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// Add favorite endpoint
router.post("/users/:user_id/favorite", async (req, res) => {
  try {
    const userId = req.params.user_id
    const seriesId = req.body.series_id

    // Add the specified series to the user's favorites list and return
    // a JSON response indicating success
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    user.favorites.push(seriesId)
    await user.save()

    return res.json({ message: "Series added to favorites" })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// Get all series endpoint
router.get("/series", async (req, res) => {
  try {
    // Return a list of all series with their ID, title, description, and cover image URL
    const series = await Series.find({})
    return res.json({ series: series.map((series) => series.toJSON()) })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// Get series by ID endpoint
router.get("/series/:series_id", async (req, res) => {
  try {
    const seriesId = req.params.series_id

    // Return the series with the specified ID, including its ID, title, description,
    // cover image URL, and a list of episodes
    const series = await Series.findById(seriesId)
    if (!series) {
      return res.status(404).json({ error: "Series not found" })
    }

    return res.json({ series: series.toJSON() })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// Delete series by ID endpoint
router.delete("/series/:id", async (req, res) => {
  const { id } = req.params

  try {
    // Find and delete series
    const series = await Series.findByIdAndDelete(id)

    // Check if series exists
    if (!series) {
      return res.status(404).json({ message: "Series not found" })
    }

    res.json({ message: "Series deleted" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update series by ID endpoint
router.put("/series/:id", async (req, res) => {
  const { id } = req.params
  const { title, description, imageUrl, category } = req.body

  try {
    // Find and update series
    const series = await Series.findByIdAndUpdate(
      id,
      { title, description, imageUrl, category },
      { new: true }
    )

    // Check if series exists
    if (!series) {
      return res.status(404).json({ message: "Series not found" })
    }

    res.json(series)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Add series endpoint
router.post("/series", async (req, res) => {
  const { title, description, imageUrl, category } = req.body

  try {
    // Create new series
    const newSeries = new Series({
      title,
      description,
      imageUrl,
      category,
    })

    // Save series to database
    const savedSeries = await newSeries.save()
    res.json(savedSeries)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET endpoint to obtain the list of episodes for a series
router.get("/series/:seriesId/episodes", (req, res) => {
  const seriesId = req.params.seriesId
  Episode.find({ seriesId: seriesId }, (err, episodes) => {
    if (err) return res.status(500).json({ error: err })
    return res.json(episodes)
  })
})

// POST endpoint to create an episode for a series
router.post("/series/:seriesId/episodes", (req, res) => {
  const seriesId = req.params.seriesId
  const episode = new Episode({ seriesId: seriesId, ...req.body })
  episode.save((err, episode) => {
    if (err) return res.status(500).json({ error: err })
    return res.status(201).json(episode)
  })
})

// DELETE endpoint to delete an episode
router.delete("/series/:seriesId/episodes/:episodeId", (req, res) => {
  const seriesId = req.params.seriesId
  const episodeId = req.params.episodeId
  Episode.findOneAndDelete({ seriesId: seriesId, _id: episodeId }, (err) => {
    if (err) return res.status(500).json({ error: err })
    return res.status(200).json({ success: true })
  })
})

// PUT endpoint to update an episode
router.put("/series/:seriesId/episodes/:episodeId", (req, res) => {
  const seriesId = req.params.seriesId
  const episodeId = req.params.episodeId
  Episode.findOneAndUpdate(
    { seriesId: seriesId, _id: episodeId },
    req.body,
    { new: true },
    (err, episode) => {
      if (err) return res.status(500).json({ error: err })
      return res.json(episode)
    }
  )
})

module.exports = router