import React, { Component } from 'react';
import {
    Row, 
    Col,
    Button
} from "react-bootstrap";

import { DOTAAbilities } from "../../data/dota2/json/npc_abilities.json";

import {
    itemsContainsScepter
} from "../../utility/dataHelperItems";

import DamageOutput from "./DamageOutput";
import Cooldown from "./Cooldown";
import ManaCost from "./ManaCost";
import AbilityDetails from "./AbilityDetails";
import "./Abilities.css";
import { getAbilityIconURL } from './abilities-helper';
import { isAbilityBehaviour } from '../../utility/dataHelperAbilities';
import { EAbilityBehaviour } from '../../enums/abilities';

/// Returns array of html elements to represent the levels of the ability
function getAbilityLevelHtml (levelInfo, abilityIndex, abilityInfo, onLevelChanged) {
    if (levelInfo && abilityInfo)
    {
        /// Determine max level of ability
        let maxLvl = abilityInfo.AbilityType === "DOTA_ABILITY_TYPE_ULTIMATE" ? 3 : 4;
        if (abilityInfo.MaxLevel)
            maxLvl = parseInt(abilityInfo.MaxLevel);
        
        let html = [];
        for(let i = 0; i < maxLvl; i++) {
            html.push(
                <Button 
                    key={i} 
                    variant="outline-secondary"
                    className="p-1"
                    onClick={(e) => onLevelChanged(e)}
                    data-lvlindex={abilityIndex}
                    data-btnindex={i}>
                    <div className={ i < levelInfo.level ? "levelled" : "unlevelled"}></div>
                </Button>
            );
        }
        return html;
    }
    else
    {
        return <div>?</div>
    }
}

function getLevelInfo (abilities) {
    if (abilities) {
        return abilities.map((abil, index) => {
            return { ability: index, level: 1 };
        });
    }
    return null;
}

/// Max amount of abilities to show in one row
const ABILITY_ROW_MAX = 6;

class Abilities extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            heroName: props.heroName,
            items: props.items,
            neutral: props.neutral,
            selectedTalents: props.selectedTalents,
            displayDamage: props.displayDamage,
            shard: props.shard,

            abilityStrings: props.abilityStrings,
            dotaStrings: props.dotaStrings,

            abilities: props.abilities,
            abilityLevels: props.abilityLevels,

            onAbilityLevelChanged: props.onAbilityLevelChanged,
        };

        this.onLevelChanged = this.onLevelChanged.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.heroName !== this.props.heroName) {
            this.setState({ heroName: this.props.heroName });
        }

        if (prevProps.abilities !== this.props.abilities) {
            this.setState({ abilities: this.props.abilities });
        }
        if (prevProps.abilityLevels !== this.props.abilityLevels) {
            this.setState({ abilityLevels: this.props.abilityLevels });
        }

        if (prevProps.items !== this.props.items) {
            this.setState({ items: this.props.items });
        }
        if (prevProps.neutral !== this.props.neutral) {
            this.setState({ neutral: this.props.neutral });
        }
        if (prevProps.selectedTalents !== this.props.selectedTalents) {
            this.setState({ selectedTalents: this.props.selectedTalents });
        }
        if (prevProps.shard !== this.props.shard) {
            this.setState({ shard: this.props.shard });
        }

        if (prevProps.abilityStrings !== this.props.abilityStrings) {
            this.setState({ abilityStrings: this.props.abilityStrings });
        }
        if (prevProps.dotaStrings !== this.props.dotaStrings) {
            this.setState({ dotaStrings: this.props.dotaStrings });
        }
    }

    onLevelChanged(e) {
        // If click on inner element
        if (e.target.tagName.toLowerCase() !== "button") {
            e.target = e.target.parentElement;
        }

        let abilityIndex = parseInt(e.target.dataset.lvlindex);
        let abilities = this.state.abilityLevels;
        let targetLevel = parseInt(e.target.dataset.btnindex) + 1;
        // Clicked same level, set to 0
        if (abilities[abilityIndex].level === targetLevel) {
            targetLevel = 0;
        }

        this.state.onAbilityLevelChanged({
            ability: abilityIndex,
            level: targetLevel
        });
    }

    render() {
        return (
            <Row 
                md={this.state.abilities?.length > ABILITY_ROW_MAX ? ABILITY_ROW_MAX : 0}>
                {
                    this.state.abilities && this.state.abilityLevels && this.state.abilities.map((abilName, index) => {
                        // Get ability info from name
                        let ability = DOTAAbilities[abilName];
                        if (!ability) {
                            console.log(`Unable to find info on ability '${abilName}'`);
                            return (<div key={abilName}>?</div>);
                        }

                        // Get current level information of the ability
                        let levelInfo = this.state.abilityLevels.find(abilVal => abilVal.ability === index);
                        if (!levelInfo) {
                            console.error(`Unable to find levelInfo for ${abilName}`);
                            return;
                        }

                        // Hide Ability if AbiltyBehaviour contains HIDDEN and isn't scepter/shard given
                        if ( isAbilityBehaviour(ability.AbilityBehavior, [ EAbilityBehaviour.HIDDEN ]) && (!ability.IsGrantedByScepter && !ability.IsGrantedByShard)) {
                            return;
                        }

                        // Dont add any scepter abilities unless hero has scepter
                        if (ability.IsGrantedByScepter && !itemsContainsScepter(this.state.items)) {
                            return;
                        }
                        // Ignore Shard ability if shard isn't enabled
                        if (ability.IsGrantedByShard && !this.state.shard) {
                            return;
                        }

                        return (
                            <Col key={ability.ID} className="d-flex flex-column justify-content-top">
                                <img
                                    className="h-100 align-self-center"
                                    style={{ maxWidth: "90px", maxHeight: "90px" }}
                                    src={ getAbilityIconURL(abilName) } 
                                    alt={ `${ability.ID}-${abilName}` } />
                                <Row className="px-4">
                                    <Col md={6}>
                                        {/* Cooldown */}
                                        <Cooldown 
                                            ability={abilName} 
                                            abilityInfo={ability}
                                            abilityLevel={levelInfo.level} 
                                            cooldown={ability.AbilityCooldown}
                                            items={this.state.items}
                                            neutral={this.state.neutral}
                                            selectedTalents={this.state.selectedTalents} />
                                    </Col>
                                    <Col md={6}>
                                        {/* Mana Cost */}
                                        <ManaCost 
                                            ability={ability}
                                            abilityLevel={levelInfo.level} 
                                            items={this.state.items}
                                            neutral={this.state.neutral}
                                            selectedTalents={this.state.selectedTalents} />
                                    </Col>
                                </Row>
                                <div className="align-self-center pt-2 d-flex">
                                    {
                                        this.state.abilityLevels && !ability.IsGrantedByScepter && 
                                            getAbilityLevelHtml(levelInfo, index, ability, this.onLevelChanged)
                                    }
                                </div>
                                <div className="py-1">
                                    {
                                        this.state.displayDamage && 
                                            <DamageOutput 
                                                ability={abilName}
                                                abilityInfo={ability} 
                                                levelInfo={levelInfo}
                                                items={this.state.items}
                                                neutral={this.state.neutral} 
                                                selectedTalents={this.state.selectedTalents} 
                                                abilityStrings={this.state.abilityStrings} 
                                                dotaStrings={this.state.dotaStrings} />
                                    }
                                </div>
                                <div className="py-1">
                                    <AbilityDetails 
                                        ability={abilName}
                                        abilityInfo={ability} 
                                        levelInfo={levelInfo}
                                        items={this.state.items}
                                        neutral={this.state.neutral} 
                                        selectedTalents={this.state.selectedTalents}
                                        abilityStrings={this.state.abilityStrings} 
                                        dotaStrings={this.state.dotaStrings} />
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