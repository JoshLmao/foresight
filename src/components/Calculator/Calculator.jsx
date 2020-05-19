import React, { Component } from 'react';
import {
    Container,
    Row,
    Col
} from 'react-bootstrap';

import Abilities from "../Abilities";
import Items from "../Items";
import Attributes from "../Attributes";
import Statistics from "../Statistics";

/* DotA 2 Import Data */
import { DOTAHeroes } from "../../data/dota2/json/npc_heroes.json";

import "../../css/dota_hero_icons.css";
import "../../css/dota_attributes.css";
import "../../css/dota_items.css";
import "../../css/dota_hero_icons_big.css";
import "./Calculator.css";

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

        this.parseName = this.parseName.bind(this);
    }

    componentDidMount() {
        this.setState({
            selectedHeroName: this.state.selectedHero ? this.parseName(this.state.selectedHero.Model) : "?",
        })
    }

    parseName(modelString) {
        var dashSplit = modelString.split('.')[0].split('/');
        return dashSplit[dashSplit.length - 1];
    }

    render() {
        return (
            <div className="mt-3">
                <Container fluid="md">
                    {/* Top row, Inital Hero Information */}
                    <Row>
                        {/* Main Hero Info */}
                        <Col className="d-flex my-auto" md={3}>
                            <span 
                                className={`hero-icon-big hero-icon-big-npc_dota_hero_${this.state.selectedHeroName}_png mx-3`}
                                height={50}
                                alt="hero banner" />
                            <h5 className="my-auto">
                                {this.state.selectedHeroName}
                            </h5>
                        </Col>
                        {/* Small Stats */}
                        <Col md={3}>
                            <Attributes 
                                baseStrength={this.state.selectedHero.AttributeBaseStrength}
                                strengthGain={this.state.selectedHero.AttributeStrengthGain}
                                baseAgility={this.state.selectedHero.AttributeBaseAgility}
                                agilityGain={this.state.selectedHero.AttributeAgilityGain}
                                baseIntelligence={this.state.selectedHero.AttributeBaseIntelligence}
                                intelligenceGain={this.state.selectedHero.AttributeIntelligenceGain}
                                primaryAttribute={this.state.selectedHero.AttributePrimary} />
                        </Col>
                        {/* Final Attack/Defence Stats */}
                        <Col md={5}>
                            <Statistics hero={this.state.selectedHero} />
                        </Col>
                    </Row>

                    {/* Items/Talent */}
                    <Row className="items-row my-5">
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
                        // { name: "zuus_arc_lightning", data: DOTAAbilities.zuus_arc_lightning },
                        // { name: "zuus_lightning_bolt", data: DOTAAbilities.zuus_lightning_bolt },
                        // { name: "zuus_cloud", data: DOTAAbilities.zuus_cloud },
                        // { name: "zuus_thundergods_wrath", data: DOTAAbilities.zuus_thundergods_wrath },
                        this.state.selectedHero.Ability1, this.state.selectedHero.Ability2, this.state.selectedHero.Ability3, this.state.selectedHero.Ability4,
                        this.state.selectedHero.Ability5, this.state.selectedHero.Ability6, this.state.selectedHero.Ability7
                    ]} />
                </Container>
            </div>
        );
    }
}

export default Calculator;