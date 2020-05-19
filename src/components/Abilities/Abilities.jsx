import React, { Component } from 'react';
import {
    Row, Col
} from "react-bootstrap";

import { DOTAAbilities } from "../../data/dota2/json/npc_abilities.json";

class Abilities extends Component {
    constructor(props) {
        super(props);
        
        // Remove any undefined, hidden abilities
        var abils = props.abilities;
        if (props.abilities) {
            abils = props.abilities.filter(function (val) {
                return val && val !== "generic_hidden";
            });
        }

        this.state = {
            abilities: abils,
        };
    }

    render() {
        return (
            <Row style={{ height: "200px" }}>
                {
                    this.state.abilities && this.state.abilities.map((value) => {
                        var ability = DOTAAbilities[value];
                        if (!ability && value) {
                            return <div key={value}>?</div>
                        }
                        return (
                            <Col key={ability.ID} className="d-flex flex-column justify-content-center">
                                <img
                                    className="h-100 align-self-center"
                                    style={{ maxWidth: "90px", maxHeight: "90px" }}
                                    src={`http://cdn.dota2.com/apps/dota2/images/abilities/${value}_hp1.png`} 
                                    alt={ability.ID} />
                                {
                                    ability.IsGrantedByScepter && 
                                        <div className="align-self-center">aghs</div>
                                }
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