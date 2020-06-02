import React, { Component } from 'react';

import {
    calculateSpellDamage
} from "../../utility/calculate";

/// Retrieves ability damage and returns display value
function parseDamage(abilInfo, abilLvl, items, neutral, talents) {
    let abilDmg = calculateSpellDamage(abilInfo, abilLvl, items, neutral, talents);
    if (abilDmg) {
        return abilDmg.damage;
    } else {
        return "Unable to find dmg";
    }
}

class DamageOutput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            abilityInfo: props.abilityInfo,
            levelInfo: props.levelInfo,

            items: props.items,
            neutral: props.neutral,
            selectedTalents: props.selectedTalents,
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
    }

    render() {
        return (
            <h6>
                { parseDamage(this.state.abilityInfo, this.state.levelInfo?.level, this.state.items, this.state.neutral, this.state.selectedTalents) }
            </h6>
        );
    }
}

export default DamageOutput;