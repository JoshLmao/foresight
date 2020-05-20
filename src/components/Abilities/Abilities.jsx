import React, { Component } from 'react';
import {
    Row, 
    Col,
    Button
} from "react-bootstrap";

import { DOTAAbilities } from "../../data/dota2/json/npc_abilities.json";

import "./Abilities.css";

function getAbilityLevel (lvls, abilityIndex, abilityInfo, onLevelChanged) {
    var lvl = lvls.find(abilVal => abilVal.ability == abilityIndex);
    if (lvl && abilityInfo)
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
                    data-lvlIndex={abilityIndex}
                    data-btnIndex={i}>
                    <div className={ i < lvl.level ? "levelled" : "unlevelled"}></div>
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

function getAbilityDmg(lvls, abilityIndex, abilityInfo) {
    var lvl = lvls.find(abilVal => abilVal.ability == abilityIndex);
    if (lvl)
    {
        var dmgVals = abilityInfo.AbilityDamage;
        if(dmgVals) {
            return dmgVals.split(' ')[lvl.level - 1];
        }
        else if (abilityInfo.AbilitySpecial) 
        {
            for (var i = 0; i < abilityInfo.AbilitySpecial.length; i++) {
                var abil = abilityInfo.AbilitySpecial[i];
                // Zeus Zrc Lightning
                if (abil.arc_damage) {
                    return abil.arc_damage.split(' ')[lvl.level - 1];
                }

                // Normal Damage
                if (abil.damage) {
                    return abil.damage.split(' ')[lvl.level - 1];
                }
            }
        }
    }
    
    return "?";
}

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
            abilityLevels: [
                { ability: 0, level: 1 },
                { ability: 1, level: 2 },
                { ability: 2, level: 3 },
                { ability: 3, level: 1 },
                { ability: 4, level: 2 },
            ]
        };
        
        this.onLevelChanged = this.onLevelChanged.bind(this);
    }

    onLevelChanged(e) {
        //e.persist();
        //console.log(e);

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
            <Row style={{ height: "200px" }}>
                {
                    this.state.abilities && this.state.abilities.map((value, index) => {
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
                                <div className="align-self-center pt-2 d-flex">
                                    {
                                        this.state.abilityLevels ? getAbilityLevel(this.state.abilityLevels, index, ability, this.onLevelChanged) : <div>!</div>    
                                    }
                                </div>
                                <div>
                                    <h6>
                                        {
                                            this.state.abilityLevels ? getAbilityDmg(this.state.abilityLevels, index, ability) : "?"
                                        }
                                    </h6>
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