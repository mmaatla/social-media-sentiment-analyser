import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert, Spinner, Card, Badge } from "react-bootstrap";

function TwitterSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/api/twitter/analyze?q=${query}&max=100`
      );
      setResults(response.data);
    } catch (error) {
      console.error("Error analyzing tweets:", error);
      setError("An error occurred while analyzing tweets. Please try again.");
    }
    setLoading(false);
  };

  const getSentimentColor = (score) => {
    if (score > 0) return "success";
    if (score < 0) return "danger";
    return "warning";
  };

  return (
    <div className="text-center">
      <h2 className="my-4">Twitter Sentiment Analysis</h2>
      <Form
        onSubmit={handleSearch}
        className="d-flex flex-column align-items-center"
      >
        <Form.Group className="mb-3 w-100" style={{ maxWidth: "500px" }}>
          <Form.Control
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search query"
            className="text-center"
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Analyze"}
        </Button>
      </Form>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      {results && (
        <div className="mt-4">
          <h3>Results for "{results.query}"</h3>
          <p>
            Overall Sentiment:
            <Badge
              bg={getSentimentColor(results.overallSentiment)}
              className="ms-2"
            >
              {results.overallSentiment.toFixed(2)}
            </Badge>
          </p>
          <p>Tweets Analyzed: {results.count}</p>

          {results.tweets.map((tweet) => (
            <Card
              key={tweet.id}
              className="mb-3 mx-auto"
              style={{ maxWidth: "600px" }}
            >
              <Card.Body>
                <Card.Text>{tweet.text}</Card.Text>
                <Badge bg={getSentimentColor(tweet.sentiment.score)}>
                  Sentiment: {tweet.sentiment.score}
                </Badge>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
export default TwitterSearch;
