import React, { Component } from 'react';
import {
    Container,
    Row,
    Col
} from 'react-bootstrap';

import Abilities from "../Abilities";
import Items from "../Items";

/* DotA 2 Import Data */
import { DOTAAbilities } from "../../data/dota2/json/npc_abilities.json";
import { DOTAHeroes } from "../../data/dota2/json/npc_heroes.json";

import "../../css/dota_hero_icons.css";
import "../../css/dota_attributes.css";
import "../../css/dota_items.css";

function Attribute(props) {
    return (
        <div className="d-flex my-2">
            <span className={'attribute ' + props.type + " mr-2"} alt="attribute" />
            <div>{props.value}</div>
            <div className="px-1">+</div>
            <div>{props.per}</div>
            <div className="px-1">per level</div>
        </div>
    );
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

function TalentTree(props) {
    return (
        <div>
            <h6>Talents</h6>
            <img src="/images/dota2/talent.jpg" alt="talent tree" />
        </div>
    );
}

class Calculator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedHero: DOTAHeroes.npc_dota_hero_zuus,
        };
    }

    render() {
        return (
            <div className="mt-3">
                <Container fluid="md">
                    {/* Top row, Inital Hero Information */}
                    <Row>
                        {/* Main Hero Info */}
                        <Col className="d-flex my-auto" md={3}>
                            <img 
                                className="mx-3"
                                height={50}
                                src="/images/dota2/heroes/zeus-banner.png" 
                                alt="hero banner" />
                            <h5 className="my-auto">
                                Zeus
                            </h5>
                        </Col>
                        {/* Small Stats */}
                        <Col md={3}>
                            <h5>STATS</h5>
                            <h6>ATTRIBUTES</h6>
                            <Attribute 
                                type="strength" 
                                value={this.state.selectedHero.AttributeBaseStrength} 
                                per={this.state.selectedHero.AttributeStrengthGain} />

                            <Attribute 
                                type="agility"
                                value={this.state.selectedHero.AttributeBaseAgility}
                                per={this.state.selectedHero.AttributeAgilityGain} />

                            <Attribute 
                                type="intelligence" 
                                value={this.state.selectedHero.AttributeBaseIntelligence}
                                per={this.state.selectedHero.AttributeIntelligenceGain} />
                        </Col>
                        {/* Final Attack/Defence Stats */}
                        <Col md={5}>
                            <Row>
                                <Col md={6}>
                                    <StatArray title="ATTACK" stats={[
                                        { name: "attack speed", value: 111 },
                                        { name: "damage", value: `${this.state.selectedHero.AttackDamageMin} - ${this.state.selectedHero.AttackDamageMax}` },
                                        { name: "attack range", value: this.state.selectedHero.AttackRange },
                                        { name: "move speed", value: this.state.selectedHero.MovementSpeed },
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
                        </Col>
                    </Row>

                    {/* Items/Talent */}
                    <Row className="my-5">
                        <Col md={9}>
                            <Items items={[
                                { slot: 0, item: "abyssal_blade" },
                                { slot: 1, item: "black_king_bar" },
                                { slot: 2, item: "manta" },
                                { slot: 3, item: "tranquil_boots" },
                                { slot: 4, item: "none" },
                                { slot: 5, item: "spirit_vessel" },
                            ]} backpack={[
                                { slot: 0, item: "none" },
                                { slot: 2, item: "none" },
                                { slot: 3, item: "orb_of_venom" },
                            ]} neutral={{ slot: 0, item: "orb_of_destruction" }} />
                        </Col>
                        <Col md={3}>
                            <TalentTree />
                        </Col>
                    </Row>

                    {/* Abilities */}
                    <Abilities abilities={[
                        { name: "zuus_arc_lightning", data: DOTAAbilities.zuus_arc_lightning },
                        { name: "zuus_lightning_bolt", data: DOTAAbilities.zuus_lightning_bolt },
                        { name: "zuus_cloud", data: DOTAAbilities.zuus_cloud },
                        { name: "zuus_thundergods_wrath", data: DOTAAbilities.zuus_thundergods_wrath },
                    ]} />
                </Container>
            </div>
        );
    }
}

export default Calculator;