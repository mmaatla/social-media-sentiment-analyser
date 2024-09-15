import React from "react";
import { Navbar, Container } from "react-bootstrap";

function Header() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container className="justify-content-center">
        <Navbar.Brand className="text-center">
          Twitter Sentiment Analyzer
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Header;
