import React, { Component } from 'react';
import {
    Row, 
    Col,
    Button
} from "react-bootstrap";

import { DOTAAbilities } from "../../data/dota2/json/npc_abilities.json";

import DamageOutput from "./DamageOutput";
import Cooldown from "./Cooldown";
import ManaCost from "./ManaCost";
import "./Abilities.css";

function getAbilityLevel (levelInfo, abilityIndex, abilityInfo, onLevelChanged) {
    if (levelInfo && abilityInfo)
    {
        /// Determine max level of ability
        var maxLvl = abilityInfo.AbilityType === "DOTA_ABILITY_TYPE_ULTIMATE" ? 3 : 4;
        if (abilityInfo.MaxLevel)
            maxLvl = parseInt(abilityInfo.MaxLevel);
        
        var html = [];
        for(var i = 0; i < maxLvl; i++) {
            html.push(
                <Button 
                    key={i} 
                    variant="outline-secondary"
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
    return [ ];
}

class Abilities extends Component {
    constructor(props) {
        super(props);
        
        var abils = this.filterAbilities(props.abilities);
        var abilLevels = getLevelInfo(abils);

        this.state = {
            abilities: abils,
            abilityLevels: abilLevels,
            items: props.items,
            neutral: props.neutral,
            selectedTalents: props.selectedTalents,

            abilityStrings: props.abilityStrings,
            dotaStrings: props.dotaStrings,

            displayDamage: props.displayDamage,
        };
        
        this.onLevelChanged = this.onLevelChanged.bind(this);
        this.filterAbilities = this.filterAbilities.bind(this);
    }

    componentDidUpdate(prevProps) {
        //Update if previous props have changed
        if (prevProps.abilities !== this.props.abilities) {
            var abils = this.filterAbilities(this.props.abilities);
            this.setState({
                abilities: abils,
                abilityLevels: getLevelInfo(abils),
            });
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

        if (prevProps.abilityStrings !== this.props.abilityStrings) {
            this.setState({ abilityStrings: this.props.abilityStrings });
        }
        if (prevProps.dotaStrings !== this.props.dotaStrings) {
            this.setState({ dotaStrings: this.props.dotaStrings });
        }
    }
    
    // Remove any undefined, hidden abilities
    filterAbilities(abils) {
        if (abils) {
            return abils.filter(function (val) {
                return val && val !== "generic_hidden";
            });
        } else {
            return null;
        }
    }

    onLevelChanged(e) {
        // If click on inner element
        if (e.target.tagName.toLowerCase() !== "button") {
            e.target = e.target.parentElement;
        }

        var levelIndex = parseInt(e.target.dataset.lvlindex);
        var abilities = this.state.abilityLevels;
        var targetLevel = parseInt(e.target.dataset.btnindex) + 1;
        // Clicked same level, set to 0
        if (abilities[levelIndex].level === targetLevel) {
            abilities[levelIndex].level = 0;
        } else {
            // Set Level's new value to which btn was pressed
            abilities[levelIndex].level = targetLevel;
        }

        this.setState({
            abilityLevels: abilities,
        });
    }

    render() {
        return (
            <Row>
                {
                    this.state.abilities && this.state.abilities.map((value, index) => {
                        // Info about the ability
                        var ability = DOTAAbilities[value];
                        if (!ability) {
                            console.log(`Unable to find info on ability '${value}'`);
                        }
                        // Current level of the ability
                        var levelInfo = this.state.abilityLevels.find(abilVal => abilVal.ability === index);
                        if (!levelInfo) {
                            debugger;
                        }

                        //console.log(levelInfo);
                        if (!ability && value) {
                            return <div key={value}>?</div>
                        }

                        // Dont add any scepter abilities unless hero has scepter
                        if (ability && ability.IsGrantedByScepter && this.state.items.filter(item => item.item === "ultimate_scepter").length <= 0) {
                            return;
                        }
                        return (
                            <Col key={ability.ID} className="d-flex flex-column justify-content-top">
                                <img
                                    className="h-100 align-self-center"
                                    style={{ maxWidth: "90px", maxHeight: "90px" }}
                                    src={`http://cdn.dota2.com/apps/dota2/images/abilities/${value}_hp1.png`} 
                                    alt={ability.ID} />
                                <Row className="px-4">
                                    <Col md={6}>
                                        {/* Cooldown */}
                                        <Cooldown 
                                            ability={ability} 
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
                                        this.state.abilityLevels && !ability.IsGrantedByScepter && getAbilityLevel(levelInfo, index, ability, this.onLevelChanged)
                                    }
                                </div>
                                <div className="mx-auto mt-2">
                                        {
                                            this.state.displayDamage && 
                                                <DamageOutput 
                                                    ability={value}
                                                    abilityInfo={ability} 
                                                    levelInfo={levelInfo}
                                                    items={this.state.items}
                                                    neutral={this.state.neutral} 
                                                    selectedTalents={this.state.selectedTalents} 
                                                    abilityStrings={this.state.abilityStrings} 
                                                    dotaStrings={this.state.dotaStrings} />
                                        }
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