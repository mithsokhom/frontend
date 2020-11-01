import React from "react";
import "./App.css";
import { Container } from "reactstrap";
import Routes from "./routes";
import { ContextWrapper } from "./user-context";

function App() {
  return (
    <ContextWrapper>
      <Container fluid={true}>
        <Routes />
      </Container>
    </ContextWrapper>
  );
}

export default App;
