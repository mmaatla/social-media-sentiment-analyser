const axios = require("axios");

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

const twitterAxios = axios.create({
  baseURL: "https://api.twitter.com/2",
  headers: { Authorization: `Bearer ${TWITTER_BEARER_TOKEN}` },
});

async function searchTweets(query, maxTweets = 100) {
  let allTweets = [];
  let nextToken = null;

  do {
    try {
      const response = await twitterAxios.get("/tweets/search/recent", {
        params: {
          query: query,
          max_results: Math.min(100, maxTweets - allTweets.length),
          next_token: nextToken,
          "tweet.fields": "author_id,created_at,public_metrics,lang",
          expansions: "author_id",
          "user.fields": "name,username,location,verified",
        },
      });

      allTweets = allTweets.concat(response.data.data);
      nextToken = response.data.meta.next_token;
    } catch (error) {
      console.error("Error fetching tweets:", error);
      break;
    }
  } while (allTweets.length < maxTweets && nextToken);

  return allTweets;
}

module.exports = { searchTweets };
