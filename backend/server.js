const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { searchTweets } = require("./twitterAPI");
const { analyzeSentiment } = require("./sentimentAnalysis");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Welcome to the Social Media Sentiment Analyzer API");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is connected!" });
});

app.get("/api/twitter/search", async (req, res) => {
  try {
    const query = req.query.q;
    const tweets = await searchTweets(query);
    res.json(tweets);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching tweets" });
  }
});

// Route for fetching and analyzing tweets
app.get("/api/twitter/analyze", async (req, res) => {
  try {
    const query = req.query.q;
    const maxTweets = parseInt(req.query.max) || 100;
    const tweets = await searchTweets(query, maxTweets);

    const analyzedTweets = tweets.map((tweet) => ({
      ...tweet,
      sentiment: analyzeSentiment(tweet.text),
    }));

    const overallSentiment =
      analyzedTweets.reduce((acc, tweet) => acc + tweet.sentiment.score, 0) /
      analyzedTweets.length;

    res.json({
      tweets: analyzedTweets,
      overallSentiment,
      query,
      count: analyzedTweets.length,
    });
  } catch (error) {
    console.error("Error analyzing tweets:", error);
    res.status(500).json({ error: "An error occurred while analyzing tweets" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
