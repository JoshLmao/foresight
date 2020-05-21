import React, { Component } from 'react';
import {
    Row, 
    Col,
    Button
} from "react-bootstrap";

import { DOTAAbilities } from "../../data/dota2/json/npc_abilities.json";

import DamageOutput from "./DamageOutput";
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

class Abilities extends Component {
    constructor(props) {
        super(props);
        
        var abils = this.filterAbilities(props.abilities);

        this.state = {
            abilities: abils,
            abilityLevels: [
                { ability: 0, level: 1 },
                { ability: 1, level: 2 },
                { ability: 2, level: 3 },
                { ability: 3, level: 1 },
                { ability: 4, level: 2 },
            ]
        };
        
        this.onLevelChanged = this.onLevelChanged.bind(this);
        this.filterAbilities = this.filterAbilities.bind(this);
    }

    componentDidUpdate(prevProps) {
        //console.log("ABILITIES UPDATED");
        //console.log(this.props.abilities);

        //Update if previous props have changed
        if (prevProps.abilities !== this.props.abilities) {
            this.setState({
                abilities: this.filterAbilities(this.props.abilities),
            });
        }
    }
    
    // Remove any undefined, hidden abilities
    filterAbilities(abils) {
        return abils.filter(function (val) {
            return val && val !== "generic_hidden";
        });
    }

    onLevelChanged(e) {
        //console.log(e);

        // If click on inner element
        if (e.target.tagName.toLowerCase() !== "button") {
            e.target = e.target.parentElement;
        }

        var levelIndex = parseInt(e.target.dataset.lvlindex);
        var abilities = this.state.abilityLevels;
        // Set Level's new value to which btn was pressed
        abilities[levelIndex].level = parseInt(e.target.dataset.btnindex) + 1;

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
                        // Current level of the ability
                        var levelInfo = this.state.abilityLevels.find(abilVal => abilVal.ability === index);
                        //console.log(levelInfo);
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
                                <div className="align-self-center pt-2 d-flex">
                                    {
                                        this.state.abilityLevels ? getAbilityLevel(levelInfo, index, ability, this.onLevelChanged) : <div>!</div>    
                                    }
                                </div>
                                <div className="mx-auto mt-2">
                                        {
                                            <DamageOutput 
                                                abilityInfo={ability} 
                                                levelInfo={levelInfo} />
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