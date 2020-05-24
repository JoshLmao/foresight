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
            baseStrength: props.baseStrength,
            strengthGain: props.strengthGain,
            baseIntelligence: props.baseIntelligence,
            intelligenceGain: props.intelligenceGain,
            primaryAttribute: props.primaryAttribute,
            
            bonusHealthRegen: props.bonusHealthRegen,
            bonusManaRegen: props.bonusManaRegen,

            heroLevel: props.heroLevel,
            maxHealth: 0,
            maxMana: 0,
        };

        this.updateBar = this.updateBar.bind(this);
    }

    componentDidMount() {
        this.updateBar();
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                baseStrength: this.props.baseStrength,
                strengthGain: this.props.strengthGain,
                baseIntelligence: this.props.baseIntelligence,
                intelligenceGain: this.props.intelligenceGain,
                primaryAttribute: this.props.primaryAttribute,
                
                bonusHealthRegen: this.props.bonusHealthRegen,
                bonusManaRegen: this.props.bonusManaRegen,

                heroLevel: this.props.heroLevel,
                maxHealth: 0,
                maxMana: 0,
            });
            this.updateBar(this.props);
        }
    }

    updateBar(newProps = undefined) {
        if (newProps) {
            this.setState({
                maxHealth: calculateHealth(newProps.baseStrength, newProps.strengthGain, newProps.heroLevel, newProps.primaryAttribute === EAttributes.ATTR_STRENGTH).toFixed(0),
                maxMana: calculateMana(newProps.baseIntelligence, newProps.intelligenceGain, newProps.heroLevel, newProps.primaryAttribute === EAttributes.ATTR_INTELLIGENCE).toFixed(0),
            });
        } else {
            this.setState({
                maxHealth: calculateHealth(this.state.baseStrength, this.state.strengthGain, this.state.heroLevel, this.state.primaryAttribute === EAttributes.ATTR_STRENGTH).toFixed(0),
                maxMana: calculateMana(this.state.baseIntelligence, this.state.intelligenceGain, this.state.heroLevel, this.state.primaryAttribute === EAttributes.ATTR_INTELLIGENCE).toFixed(0),
            });
        }
    }

    render() {
        return (
            <div>
                <div className="bar health d-flex">
                    <h6 className="my-auto mx-auto">{this.state.maxHealth} / {this.state.maxHealth}</h6>
                    <div className="my-auto mr-1">
                        { "+" + calculateHealthRegen(this.state.baseStrength, this.state.strengthGain, this.state.bonusHealthRegen, this.state.heroLevel,) }
                    </div>
                </div>
                <div className="bar mana d-flex">
                    <h6 className="my-auto mx-auto">{this.state.maxMana} / {this.state.maxMana}</h6>
                    <div className="my-auto mr-1">
                        { "+" + calculateManaRegen(this.state.baseIntelligence, this.state.intelligenceGain, this.state.bonusManaRegen, this.state.heroLevel) }
                    </div>
                </div>
            </div>
        );
    }
}

export default HealthManaBar;