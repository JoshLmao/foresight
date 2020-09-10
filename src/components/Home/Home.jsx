import React, { Component } from 'react';
import {
    Container,
    Button,
    Col, Row,
} from "react-bootstrap";
import { Redirect } from 'react-router-dom';

import "./Home.css";

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: "",
        };

        this.onGoToCalc = this.onGoToCalc.bind(this);
    }

    onGoToCalc() {
        this.setState({ 
            redirect: "/app"
        });
    }

    render() {
        return (
            <div
                className="bg-master">
                {/* Primary Title Container */}
                <div className="primary-home-container py-5">
                    <div className="home-bg-image" />
                    <Container 
                        className="faded-background"
                        style={{
                            height: "auto",
                            paddingTop: "7rem",
                            paddingBottom: "7rem",
                        }}>
                        <div className="text-center">
                            {/* App title */}
                            <h1>
                                foresight
                            </h1>
                            {/* Sub text & action */}
                            <div>
                                <h6 className="py-2">
                                    Web application for calculating damage output for heroes in DotA 2 
                                </h6>
                                <Button
                                    className="mx-auto mt-2"
                                    variant="primary"
                                    onClick={this.onGoToCalc}>
                                    <h5 className="m-0 px-5 py-2">Get Started!</h5>
                                </Button>
                            </div>
                        </div>
                    </Container>
                    <div className="py-3" />
                    <Container className="faded-background">
                        <Row>
                            <Col sm>
                                <h3>Experiment</h3>
                                <p>
                                    Gaze into the future and see how much an item effects your overall build and view the raw numbers behind the game
                                </p>
                            </Col>
                            <Col sm>
                                <h3>Share</h3>
                                <p>
                                    Share your item and ability builds to get an in depth look at the statistics and numbers, all in one handy and sharable link.
                                </p>
                            </Col>
                            <Col sm>
                                <h3>Open Source</h3>
                                <p>
                                    The site is completly open source and available to view on Github. Created by JoshLmao <span>😊</span>
                                </p>
                            </Col>
                        </Row>
                    </Container>
                </div>
                {
                    this.state.redirect && <Redirect to={this.state.redirect} />
                }
            </div>
        );
    }
}

export default Home;