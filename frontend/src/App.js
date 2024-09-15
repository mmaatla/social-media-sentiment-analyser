import React from "react";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import TwitterSearch from "./components/TwitterSearch";

function App() {
  return (
    <div className="App">
      <Header />
      <Container className="mt-4 text-center">
        <TwitterSearch />
      </Container>
    </div>
  );
}

export default App;
