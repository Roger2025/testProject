// src/components/layout/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';

const AppNavbar = () => {
  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">智慧早餐平台</Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/login">登入</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
