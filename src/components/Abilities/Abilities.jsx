import React, { Component } from 'react';
import {
    Row, Col
} from "react-bootstrap";

class Abilities extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            abilities: props.abilities,
        };
    }

    render() {
        return (
            <Row style={{ height: "200px" }}>
                {
                    this.state.abilities && this.state.abilities.map((ability) => {
                        return (
                            <Col key={ability.data.ID} className="d-flex flex-column justify-content-center">
                                <img
                                    className="h-100 align-self-center"
                                    style={{ maxWidth: "90px", maxHeight: "90px" }}
                                    src={`http://cdn.dota2.com/apps/dota2/images/abilities/${ability.name}_hp1.png`} 
                                    alt={ability.data.ID} />
                                <div className="align-self-center pt-2">
                                    LEVELS
                                </div>
                            </Col>
                        );
                    })
                }
            </Row>
        );
    }
}

export default Abilities;