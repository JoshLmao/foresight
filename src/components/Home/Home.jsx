import React, { Component } from 'react';
import {
    Container,
    Button
} from "react-bootstrap";
import { Redirect } from 'react-router-dom';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: "",
        };

        this.onGoToCalc = this.onGoToCalc.bind(this);
    }

    onGoToCalc() {
        this.setState({ redirect: "/app" });
    }

    render() {
        return (
            <div>
                <Container>
                    <div style={{ height: "300px" }}>
                        <h1 
                            className="text-center my-5 pt-3">
                                foresight
                        </h1>
                        <div className="text-center">
                            <h6 className="py-2">work in progress</h6>
                            <Button
                                className="mx-auto"
                                onClick={this.onGoToCalc}>
                                to app
                            </Button>
                        </div>
                        
                    </div>
                </Container>
                {
                    this.state.redirect && <Redirect to={this.state.redirect} />
                }
            </div>
        );
    }
}

export default Home;