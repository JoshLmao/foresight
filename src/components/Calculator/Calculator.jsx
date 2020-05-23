import React, { Component } from 'react';
import {
    Container,
    Row,
    Col,
} from 'react-bootstrap';
import { connect } from "react-redux";

import {
    SELECTED_HERO,
    SELECTED_ITEM,
    SELECTED_NEUTRAL,
    SELECTED_BACKPACK_ITEM,
    SELECTED_TALENT,
    NEW_HERO_LEVEL,
} from "../../constants/actionTypes";

import Abilities from "../Abilities";
import ItemsBar from "../ItemsBar";
import Attributes from "../Attributes";
import Statistics from "../Statistics";
import ChangeHeroBtn from "../ChangeHeroBtn";
import TalentTree from "../TalentTree";
import HealthManaBar from "../HealthManaBar";
import LevelSelector from "../LevelSelector";

/* DotA 2 Import Data */
import { DOTAHeroes } from "../../data/dota2/json/npc_heroes.json";

import "../../css/dota_hero_icons.css";
import "../../css/dota_attributes.css";
import "../../css/dota_items.css";
import "../../css/dota_hero_icons_big.css";
import "./Calculator.css";

class Calculator extends Component {
    constructor(props) {
        super(props);

        this.onHeroSelected = this.onHeroSelected.bind(this);
        this.onItemSelected = this.onItemSelected.bind(this);
        this.onNeutralSelected = this.onNeutralSelected.bind(this);
        this.onTalentSelected = this.onTalentSelected.bind(this);
        this.onHeroLevelChanged = this.onHeroLevelChanged.bind(this);
    }

    onHeroSelected(heroName) {
        var targetHero = DOTAHeroes[heroName];
        console.log(`${SELECTED_HERO}: ${heroName}`);

        this.props.dispatch({ type: SELECTED_HERO, value: targetHero });
    }

    onItemSelected (item) {
        if (item.isBackpack) 
        {
            console.log(`${SELECTED_BACKPACK_ITEM}: Slot: ${item.slot} Item: ${item.item}`);
            this.props.dispatch({ type: SELECTED_BACKPACK_ITEM, value: item });
        }
        else
        {
            console.log(`${SELECTED_ITEM}: Slot: ${item.slot} Item: ${item.item}`);
            this.props.dispatch({ type: SELECTED_ITEM, value: item });
        }
    }

    onNeutralSelected(neutralItem) {
        console.log(`${SELECTED_NEUTRAL}: ${neutralItem.item}`);
        this.props.dispatch({ type: SELECTED_NEUTRAL, value: neutralItem });
    }

    onTalentSelected (talent) {
        console.log(`${SELECTED_TALENT}: ${talent.name}`);
        this.props.dispatch({ type: SELECTED_TALENT, value: talent });
    }

    onHeroLevelChanged(newLevel) {
        //console.log(`${NEW_HERO_LEVEL}: ${newLevel}`);
        this.props.dispatch({ type: NEW_HERO_LEVEL, value: newLevel });
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
                            <Statistics 
                                hero={this.props.selectedHero} 
                                heroLevel={this.props.heroLevel}
                                talents={this.props.selectedTalents}
                                items={this.props.items}
                                neutral={this.props.neutralItem} 
                                abilities={this.props.heroAbilities} />
                        </Col>
                    </Row>

                    {/* Health/Mana and Hero Lvl  */}
                    <Row className="my-2 py-2">
                        <Col md={8}>
                            <HealthManaBar 
                                baseStrength ={ this.props.selectedHero.AttributeBaseStrength }
                                strengthGain={ this.props.selectedHero.AttributeStrengthGain } 
                                baseIntelligence={this.props.selectedHero.AttributeBaseIntelligence }
                                intelligenceGain={ this.props.selectedHero.AttributeIntelligenceGain }
                                heroLevel={ this.props.heroLevel } 
                                primaryAttribute={ this.props.selectedHero.AttributePrimary }
                                bonusHealthRegen={ this.props.selectedHero.StatusHealthRegen }
                                bonusManaRegen={ this.props.selectedHero.StatusManaRegen } />
                        </Col>
                        <Col md={4}>
                            <LevelSelector 
                                heroLevel={ this.props.heroLevel } 
                                onHeroLevelChanged={ this.onHeroLevelChanged }/>
                        </Col>
                    </Row>

                    {/* Items/Talent */}
                    <Row className="items-row my-4">
                        <Col md={7}>
                            <ItemsBar
                                items={this.props.items} 
                                backpack={this.props.backpack} 
                                neutral={this.props.neutralItem} 
                                onItemChanged={this.onItemSelected}
                                onNeutralChanged={this.onNeutralSelected} />
                        </Col>
                        <Col md={5}>
                            <TalentTree
                                talents={this.props.heroTalents} 
                                selectedTalents={this.props.selectedTalents}
                                onTalentSelected={this.onTalentSelected} />
                        </Col>
                    </Row>

                    {/* Abilities */}
                    <Abilities abilities={this.props.heroAbilities} />
                </Container>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    selectedHero: state.selectedHero,
    selectedHeroName: state.selectedHeroName,
    
    heroAbilities: state.heroAbilities,
    heroTalents: state.heroTalents,
    heroLevel: state.heroLevel,

    items: state.items,
    backpack: state.backpack,
    neutralItem: state.neutralItem,
    selectedTalents: state.selectedTalents,
});

export default connect(mapStateToProps)(Calculator);