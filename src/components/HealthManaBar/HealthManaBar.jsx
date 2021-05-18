import React, { Component } from 'react';

import {
    calculateHealth,
    calculateMana,
    calculateHealthRegen,
    calculateManaRegen,
} from "../../utility/calculate";
import { EAttributes } from "../../enums/attributes";

import "./style.css";

class HealthManaBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hero: props.hero,
            level: props.heroLevel,
            items: props.items,
            talents: props.talents,
            neutral: props.neutral,
            abilities: props.abilities,
            abilityLevels: props.abilityLevels,

            maxHealth: 0,
            maxMana: 0,
        }

        this.updateBar = this.updateBar.bind(this);
    }

    componentDidMount() {
        this.updateBar();
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                hero: this.props.hero,
                level: this.props.heroLevel,
                items: this.props.items,
                talents: this.props.talents,
                neutral: this.props.neutral,
                abilities: this.props.abilities,
                abilityLevels: this.props.abilityLevels,

                maxHealth: 0,
                maxMana: 0,
            }, () => this.updateBar());
        }
    }

    updateBar() {
        this.setState({
            maxHealth: calculateHealth(this.state.hero, this.state.level, this.state.items, this.state.neutral, this.state.abilities, this.state.talents),
            maxMana: calculateMana(this.state.hero, this.state.level, this.state.items, this.state.neutral, this.state.abilities, this.state.talents, this.state.abilityLevels),
        });
    }

    render() {
        let healthRegenInfo = calculateHealthRegen(this.state.hero, this.state.level, this.state.items, this.state.neutral, this.state.abilities, this.state.talents, this.state.abilityLevels);
        return (
            <div>
                <div className="bar health d-flex">
                    <h6 className="max-health-text my-auto mx-auto">{this.state.maxHealth} / {this.state.maxHealth}</h6>
                    <div className="health-bar-regen my-auto mr-1">
                        { "+" + (healthRegenInfo.total + healthRegenInfo.additional).toFixed(1) }
                    </div>
                </div>
                <div className="bar mana d-flex">
                    <h6 className="max-mana-text my-auto mx-auto">{this.state.maxMana} / {this.state.maxMana}</h6>
                    <div className="mana-bar-regen my-auto mr-1">
                        { "+" + calculateManaRegen(this.state.hero, this.state.level, this.state.items, this.state.neutral, this.state.abilities, this.state.talents) }
                    </div>
                </div>
            </div>
        );
    }
}

export default HealthManaBar;