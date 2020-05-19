import React, { Component } from 'react';
import {
    Row, Col
} from "react-bootstrap";

function parse(value) {
    return parseInt(value);
}

function StatArray(props) {
    return (
        <div style={{ backgroundColor: "#171717", color: "white", fontSize: "0.85rem" }} className="p-2 h-100">
            <h6 className="ml-auto">{props.title}</h6>
            {
                props.stats &&
                    props.stats.map((value) => {
                        return (<Row key={value.name}>
                            <Col md={7}>
                                {value.name}
                            </Col>
                            <Col md={5}>
                                {value.value}
                            </Col>
                        </Row>
                        );
                    })
            }
        </div>
    );
}

class Statistics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hero: props.hero
        };
    }

    render() {
        return (
            <Row>
                <Col md={6}>
                    <StatArray title="ATTACK" stats={[
                        { name: "attack speed", value: 111 },
                        { name: "damage", value: `${parse(this.state.hero.AttackDamageMin)} - ${parse(this.state.hero.AttackDamageMax)}` },
                        { name: "attack range", value: parse(this.state.hero.AttackRange) },
                        { name: "move speed", value: parse(this.state.hero.MovementSpeed) },
                        { name: "spell amp", value: 0 },
                        { name: "mana regen", value: 1.35 },
                    ]} />
                </Col>
                <Col md={6}>
                    <StatArray title="DEFENCE" stats={[
                        { name: "armor", value: 2.8 },
                        { name: "physical resist", value: 25 },
                        { name: "magic resist", value: 25 },
                        { name: "status resist", value: 0 },
                        { name: "evasion", value: 0 },
                        { name: "health regen", value: 2.10 },
                    ]}/>
                </Col>
            </Row>
        );
    }
}

export default Statistics;