import React, { Component } from 'react';

import {
    calculateSpellDamage
} from "../../utility/calculate";
import { getAbilityBehaviours } from "../../utility/dataHelperAbilities";
import { 
    tryGetAbilityLocalizedString, 
    getTooltipString,
    getTooltipAbilityString
} from "../../utility/data-helpers/language";

/// Retrieves ability damage and returns display value
function parseDamage(abilInfo, abilLvl, items, neutral, talents) {
    let abilDmg = calculateSpellDamage(abilInfo, abilLvl, items, neutral, talents);
    if (abilDmg) {
        return abilDmg.damage;
    } else {
        return "Unable to find dmg";
    }
}

function getAbilityNameFromStrings(abilityStrings, abilityName) {
    if (abilityStrings && abilityName) {
        return tryGetAbilityLocalizedString(abilityStrings, abilityName);
    } else {
        return "?";
    }
}

function TypeValueUI (props) {
    return (
        <div className="d-flex" style={{ fontSize: "0.85rem"}}>
            <div className="mr-2">{props.type}</div>
            <div>{props.value}</div>
        </div>
    )
}

class DamageOutput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ability: props.ability,
            abilityInfo: props.abilityInfo,
            levelInfo: props.levelInfo,

            items: props.items,
            neutral: props.neutral,
            selectedTalents: props.selectedTalents,

            abilityBehaviours: getAbilityBehaviours(props.abilityInfo),

            abilityStrings: props.abilityStrings,
            dotaStrings: props.dotaStrings,
        };

        this.updateAbilityBehaviours = this.updateAbilityBehaviours.bind(this);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.abilityInfo !== this.props.abilityInfo) {
            this.setState({ 
                abilityInfo: this.props.abilityInfo,
                abilityBehaviours: getAbilityBehaviours(this.props.abilityInfo),
            });
        }

        if (prevProps.levelInfo !== this.props.levelInfo) {
            this.setState({ levelInfo: this.props.levelInfo });
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

    updateAbilityBehaviours() {
        let allBehaviours = getAbilityBehaviours(this.state.abilityInfo);
        this.setState({ abilityBehaviours: allBehaviours });
    }

    render() {
        return (
            <div>
                <h5>{getTooltipAbilityString(this.state.abilityStrings, this.state.ability)}</h5>
                <div className="mb-2">
                    {
                        this.state.abilityBehaviours && this.state.abilityBehaviours.map((value, index) => {
                            return (
                                <TypeValueUI 
                                    key={index}
                                    type={getTooltipString(this.state.dotaStrings, value.key)} 
                                    value={value.value} />
                            );
                        })
                    }
                </div>
                <h6>
                    Damage: {' '}
                    { parseDamage(this.state.abilityInfo, this.state.levelInfo?.level, this.state.items, this.state.neutral, this.state.selectedTalents) }
                </h6>
            </div>
        );
    }
}

export default DamageOutput;