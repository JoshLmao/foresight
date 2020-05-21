import React, { Component } from 'react';
import {
    Container,
    Row,
    Col,
} from 'react-bootstrap';
import { connect } from "react-redux";

import Abilities from "../Abilities";
import ItemsBar from "../ItemsBar";
import Attributes from "../Attributes";
import Statistics from "../Statistics";
import ChangeHeroBtn from "../ChangeHeroBtn";

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

        this.onHeroSelected = this.onHeroSelected.bind(this);
    }

    onHeroSelected(heroName) {
        var targetHero = DOTAHeroes[heroName];
        console.log("Hero Selected " + heroName);

        this.props.dispatch({ type: "SELECTEDHERO", value: targetHero });
    }

    render() {
        return (
            <div className="mt-3">
                <Container fluid="md">
                    {/* Top row, Inital Hero Information */}
                    <Row>
                        {/* Main Hero Info */}
                        <Col className="my-auto" md={3}>
                            <span 
                                className={`hero-icon-big hero-icon-big-npc_dota_hero_${this.props.selectedHeroName}_png mx-3`}
                                height={50}
                                alt="hero banner" />
                            <div className="d-flex mt-3">
                                <h5 className="my-auto px-3">
                                    {this.props.selectedHeroName}
                                </h5>
                                <ChangeHeroBtn onSelectHero={this.onHeroSelected}/>
                            </div>
                        </Col>
                        {/* Small Stats */}
                        <Col md={3}>
                            <Attributes 
                                baseStrength={this.props.selectedHero.AttributeBaseStrength}
                                strengthGain={this.props.selectedHero.AttributeStrengthGain}
                                baseAgility={this.props.selectedHero.AttributeBaseAgility}
                                agilityGain={this.props.selectedHero.AttributeAgilityGain}
                                baseIntelligence={this.props.selectedHero.AttributeBaseIntelligence}
                                intelligenceGain={this.props.selectedHero.AttributeIntelligenceGain}
                                primaryAttribute={this.props.selectedHero.AttributePrimary} />
                        </Col>
                        {/* Final Attack/Defence Stats */}
                        <Col md={5}>
                            <Statistics hero={this.props.selectedHero} />
                        </Col>
                    </Row>

                    {/* Items/Talent */}
                    <Row className="items-row my-5">
                        <Col md={9}>
                            <ItemsBar items={this.props.items} backpack={this.props.backpack} neutral={this.props.neutralItem} />
                        </Col>
                        <Col md={3}>
                            <TalentTree />
                        </Col>
                    </Row>

                    {/* Abilities */}
                    <Abilities abilities={this.props.selectedHeroAbilities} />
                </Container>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    selectedHero: state.selectedHero,
    selectedHeroName: state.selectedHeroName,
    selectedHeroAbilities: state.selectedHeroAbilities,
    items: state.items,
    backpack: state.backpack,
    neutralItem: state.neutralItem,
});

export default connect(mapStateToProps)(Calculator);