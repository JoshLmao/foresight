import React, { Component } from 'react';
import { 
    Nav,
    Navbar,
    Container,
    Button,
}from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

class Navigation extends Component {
    render() {
        return (
            <Navbar>
                <Container>
                    <Navbar.Brand to="/" as={Link}>foresight</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link to="/" as={Link}>home</Nav.Link>
                            <Nav.Link to="/app" as={Link}>calculator</Nav.Link>
                        </Nav>
                        <a href="https://github.com/JoshLmao/foresight">
                            <Button outline variant="outline-secondary">
                                <FontAwesomeIcon icon={faGithub} />
                            </Button>
                        </a>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}

export default Navigation;