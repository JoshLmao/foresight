import React, { Component } from 'react';

import { EAttributes } from "../../enums/attributes.js";

import "./Attributes.css";
import { getLocalizedString, replaceStringValue } from '../../utility/data-helpers/language.js';
import { calculateAttribute } from '../../utility/calculate.js';

function Attribute(props) {
    return (
        <div className="d-flex my-2 align-items-center">
            <div className={props.isPrimaryAttribute ? " primary-attribute" : ""}>
                <span className={'attribute ' + props.type} alt="attribute" />
            </div>
            <div className="ml-2">{props.value}</div>
            {
                props.additional && props.additional > 0 &&
                <div   
                    className="mx-1" 
                    style={{ color: "green" }}>
                    {"+" + props.additional}
                </div>
            }
            <div
                className="ml-3"
                style={{ fontSize: "0.75rem" }}>
                {
                    replaceStringValue(props.perLevelString, props.per)
                }
            </div>
        </div>
    );
}

class Attributes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hero: props.hero,
            level: props.heroLevel,
            items: props.items,
            talents: props.talents,
            neutral: props.neutral,
            abilities: props.abilities,

            dotaStrings: props.dotaStrings,
            abilityStrings: props.abilityStrings,
        };
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

                dotaStrings: this.props.dotaStrings,
                abilityStrings: this.props.abilityStrings,
            });
        }
    }

    render() {
        let strengthStats = calculateAttribute(EAttributes.ATTR_STRENGTH, this.state.hero, this.state.level, this.state.items, this.state.neutral, this.state.abilities, this.state.talents);
        let agilityStats = calculateAttribute(EAttributes.ATTR_AGILITY, this.state.hero, this.state.level, this.state.items, this.state.neutral, this.state.abilities, this.state.talents);
        let intStats = calculateAttribute(EAttributes.ATTR_INTELLIGENCE, this.state.hero, this.state.level, this.state.items, this.state.neutral, this.state.abilities, this.state.talents);
        return (
            <div>
                <h5>{getLocalizedString(this.state.dotaStrings, "DOTA_Tooltip_topbar_stats")}</h5>
                <h6>{getLocalizedString(this.state.dotaStrings, "DOTA_Attributes")}</h6>
                <Attribute 
                    type="strength" 
                    value={ strengthStats.attribute }
                    additional= { strengthStats.additionalAttribute }
                    per={ strengthStats.perLevel } 
                    isPrimaryAttribute={this.state.hero?.AttributePrimary === EAttributes.ATTR_STRENGTH}
                    perLevelString={ getLocalizedString(this.state.dotaStrings, "DOTA_HUD_StrengthGain") } />

                <Attribute 
                    type="agility"
                    value={ agilityStats.attribute }
                    additional= { agilityStats.additionalAttribute }
                    per={ agilityStats.perLevel } 
                    isPrimaryAttribute={this.state.hero?.AttributePrimary === EAttributes.ATTR_AGILITY} 
                    perLevelString={ getLocalizedString(this.state.dotaStrings, "DOTA_HUD_AgilityGain") } />

                <Attribute 
                    type="intelligence" 
                    value={ intStats.attribute }
                    additional= { intStats.additionalAttribute }
                    per={ intStats.perLevel } 
                    isPrimaryAttribute={this.state.hero?.AttributePrimary === EAttributes.ATTR_INTELLIGENCE} 
                    perLevelString={ getLocalizedString(this.state.dotaStrings, "DOTA_HUD_IntelligenceGain") } />
            </div>
        );
    }
}

export default Attributes;