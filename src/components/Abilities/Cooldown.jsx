import React, { Component } from 'react';
import {
    calculateAbilityCooldown
} from "../../utility/calculate";

class Cooldown extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            abilityLevel: props.abilityLevel,
            abilityCooldown: props.cooldown,

            ability: props.ability,
            items: props.items,
            neutral: props.neutral,
            selectedTalents: props.selectedTalents,
        };

        this.updateCooldown = this.updateCooldown.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                abilityLevel: this.props.abilityLevel,
                abilityCooldown: this.props.cooldown,

                ability: this.props.ability,
                items: this.props.items,
                neutral: this.props.neutral,
                selectedTalents: this.props.selectedTalents,
            });
        }
    }

    updateCooldown() {
        let currentCooldown = null;
        if (this.state.abilityCooldown) {
            currentCooldown = calculateAbilityCooldown(this.state.ability, this.state.abilityLevel, this.state.items, this.state.neutral, this.state.selectedTalents);
        }

        return currentCooldown;
    }
    
    render() {
        return (
            <div>
                { this.updateCooldown() }
            </div>
        );
    }
}

export default Cooldown;