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
    UNSELECTED_TALENT,
    NEW_HERO_LEVEL,
    ENEMY_SELECTED_TALENT
} from "../../constants/actionTypes";

import Abilities from "../Abilities";
import ItemsBar from "../ItemsBar";
import Attributes from "../Attributes";
import Statistics from "../Statistics";
import ChangeHeroBtn from "../ChangeHeroBtn";
import TalentTree from "../TalentTree";
import HealthManaBar from "../HealthManaBar";
import LevelSelector from "../LevelSelector";
import EnemyHero from '../EnemyHero';

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
        this.onTalentUnselected = this.onTalentUnselected.bind(this);
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
        console.log(`${SELECTED_TALENT}: ${talent}`);
        this.props.dispatch({ type: SELECTED_TALENT, value: talent });
    }

    onTalentUnselected (talent) {
        console.log(`${UNSELECTED_TALENT}: ${talent}`);
        this.props.dispatch({ type: UNSELECTED_TALENT, value: talent });
    }

    onEnemyTalentSelected (enemy, talent) {
        console.log(`${ENEMY_SELECTED_TALENT}: ${enemy}, ${talent}`);
        this.props.dispatch({ type: ENEMY_SELECTED_TALENT, value: talent });
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
                                hero={this.props.selectedHero} 
                                heroLevel={this.props.heroLevel}
                                talents={this.props.selectedTalents}
                                items={this.props.items}
                                neutral={this.props.neutralItem} 
                                abilities={this.props.heroAbilities} />
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
                                hero={this.props.selectedHero} 
                                heroLevel={this.props.heroLevel}
                                talents={this.props.selectedTalents}
                                items={this.props.items}
                                neutral={this.props.neutralItem} 
                                abilities={this.props.heroAbilities} />
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
                                onTalentSelected={this.onTalentSelected} 
                                onTalentUnselected={this.onTalentUnselected} 
                                abilityStrings={this.props.abilityStrings} />
                        </Col>
                    </Row>

                    {/* Abilities */}
                    <Abilities 
                        abilities={this.props.heroAbilities}
                        items={this.props.items}
                        neutral={this.props.neutralItem} 
                        selectedTalents={this.props.selectedTalents} 
                        abilityStrings={this.props.abilityStrings}
                        dotaStrings={this.props.dotaStrings} 
                        displayDamage={true} />

                    {/* Padding Separator */}
                    <div className="py-5" />
                    
                    {/* Enemy Hero */}
                    <EnemyHero 
                        hero={this.props.selectedEnemyHero}
                        heroName={this.props.selectedEnemyHeroName} 
                        heroAbilities={this.props.enemyHeroAbilities} 
                        heroItems={this.props.enemyHeroItems}
                        heroTalents={this.props.enemyHeroTalents} 
                        selectedTalents={this.props.selectedEnemyTalents}
                        neutral={this.props.enemyNeutralItem}
                        abilityStrings={this.props.abilityStrings} 
                        dotaStrings={this.props.dotaStrings} />
                </Container>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    selectedHero: state.hero.selectedHero,
    selectedHeroName: state.hero.selectedHeroName,
    
    heroAbilities: state.hero.heroAbilities,
    heroTalents: state.hero.heroTalents,
    heroLevel: state.hero.heroLevel,

    items: state.hero.items,
    backpack: state.hero.backpack,
    neutralItem: state.hero.neutralItem,
    selectedTalents: state.hero.selectedTalents,

    abilityStrings: state.language.stringsAbilities,
    dotaStrings: state.language.stringsDota,

    selectedEnemyHero: state.enemy.selectedEnemyHero,
    selectedEnemyHeroName: state.enemy.selectedEnemyHeroName,
    enemyHeroTalents: state.enemy.enemyHeroTalents,
    enemyHeroAbilities: state.enemy.enemyHeroAbilities,
    selectedEnemyTalents: state.enemy.selectedEnemyTalents,
    enemyHeroItems: state.enemy.enemyHeroItems,
});

export default connect(mapStateToProps)(Calculator);