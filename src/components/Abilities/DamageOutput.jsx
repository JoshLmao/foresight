import React, { Component } from 'react';

import {
    calculateSpellDamage
} from "../../utility/calculate";
import { 
    tryGetLocalizedString, 
    getTooltipAbilityString,
} from "../../utility/data-helpers/language";

/// Retrieves ability damage and returns display value
function parseDamage(abilityName, abilInfo, abilLvl, items, neutral, talents) {
    let abilityDamage = calculateSpellDamage(abilityName, abilInfo, abilLvl, items, neutral, talents);
    if (abilityDamage && abilityDamage.damage) {
        // force to be to two decimal places
        let damage = abilityDamage.damage.toFixed(2);
        if (abilityDamage.isPercent) {
            damage += "%";
        }
        return damage;
    } else {
        return null;
    }
}

function getAbilityNameFromStrings(strings, key) {
    if (strings && key) {
        return tryGetLocalizedString(strings, key);
    } else {
        return "?";
    }
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

            abilityStrings: props.abilityStrings,
            dotaStrings: props.dotaStrings,
        };
    }

    componentDidUpdate(prevProps) {
        if(prevProps.abilityInfo !== this.props.abilityInfo) {
            this.setState({ abilityInfo: this.props.abilityInfo });
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

    render() {
        let abilityDamage = parseDamage(this.state.ability, this.state.abilityInfo, this.state.levelInfo?.level, this.state.items, this.state.neutral, this.state.selectedTalents);
        return (
            <div className="w-100 h-100">
                <h5>{getTooltipAbilityString(this.state.abilityStrings, this.state.ability)}</h5>
                {
                    abilityDamage && 
                    <h6>
                        { (getAbilityNameFromStrings(this.state.abilityStrings, "dota_ability_variable_damage") + ":")}
                        {' '}
                        { abilityDamage }
                    </h6>
                }
            </div>
        );
    }
}

export default DamageOutput;