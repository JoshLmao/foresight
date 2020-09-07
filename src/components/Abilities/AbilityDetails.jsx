import React, { Component } from 'react';
import { 
    getAbilityBehaviours,
    getAbilitySpecialExtraValues

} from "../../utility/dataHelperAbilities";
import { 
    getTooltipString,
    getLocalizedString,
    containsLocalizedString
} from "../../utility/data-helpers/language";
import {
    calculateAbilityCastRange
} from "../../utility/calculate";

function stringContainsHtml (str) {
    return typeof(str) === "string" && str.includes("</font>");
}

/// Displays a Type/Value props used inside Ability descriptions
function TypeValueUI (props) {
    /// Check if localized type value contains percent and remove
    let isPercentage = false;
    let typeStr = props.type;
    let valueStr = props.value;
    if (props.type.includes("%")) {
        typeStr = typeStr.replace("%", "");
        isPercentage = true;
    }

    return (
        <div className="d-flex" style={{ fontSize: "0.85rem"}}>
            {/* Type Key */}
            {
                stringContainsHtml(typeStr) ?
                <div dangerouslySetInnerHTML={{ __html: typeStr.replace("\\", "") }}></div>
                :
                <div>{ typeStr }</div>
            }
            <div className="mx-1" />
            {/* Value */}
            {
                stringContainsHtml(valueStr) ?    
                <div dangerouslySetInnerHTML={{ __html: valueStr.replace("\\", "") }}></div>
                :
                <div>{ valueStr }</div>
            }
            {
                // Give percent sign after value if isPercent
                isPercentage && "%"
            }
        </div>
    )
}

class AbilityDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ability: props.ability,
            abilityInfo: props.abilityInfo,
            levelInfo: props.levelInfo,

            items: props.items,
            neutral: props.neutral,
            selectedTalents: props.selectedTalents,

            abilityBehaviours: null,
            castRange: 0,

            abilityStrings: props.abilityStrings,
            dotaStrings: props.dotaStrings,
        };
    }

    componentDidUpdate(prevProps) {
        if(prevProps.abilityInfo !== this.props.abilityInfo) {
            this.setState({ 
                abilityInfo: this.props.abilityInfo,
            });
        }

        if (prevProps.levelInfo !== this.props.levelInfo) {
            this.setState({ 
                levelInfo: this.props.levelInfo 
            });
        }

        if (prevProps.items !== this.props.items) {
            this.setState({ 
                items: this.props.items 
            });
        }

        if (prevProps.neutral !== this.props.neutral) {
            this.setState({ 
                neutral: this.props.neutral 
            });
        }

        if (prevProps.selectedTalents !== this.props.selectedTalents) {
            this.setState({ 
                selectedTalents: this.props.selectedTalents 
            });
        }

        if (prevProps.abilityStrings !== this.props.abilityStrings) {
            this.setState({ 
                abilityStrings: this.props.abilityStrings 
            });
        }
        if (prevProps.dotaStrings !== this.props.dotaStrings) {
            this.setState({ 
                dotaStrings: this.props.dotaStrings 
            });
        }
    }

    render() {
        let castRangeAmt = calculateAbilityCastRange(this.state.ability, this.state.abilityInfo, this.state.levelInfo, this.state.items, this.state.neutral, this.state.selectedTalents);
        let valuesInformation = getAbilitySpecialExtraValues(this.state.ability, this.state.abilityInfo, this.state.levelInfo.level, this.state.selectedTalents);
        let abilityBehaviours = getAbilityBehaviours(this.state.abilityInfo);
        return (
            <div className="mb-2">
                {
                    abilityBehaviours && abilityBehaviours.map((value, index) => {
                        return (
                            <TypeValueUI 
                                key={index}
                                type={ getLocalizedString(this.state.dotaStrings, value.key) } 
                                value={ typeof value.value === "object" ? value.value.map((val) => {
                                        return getLocalizedString(this.state.dotaStrings, val)
                                    }).join(', ') : getLocalizedString(this.state.dotaStrings, value.value) 
                                } />
                        );
                    })
                }
                <div className="py-1" />
                {
                    castRangeAmt &&
                        <TypeValueUI 
                            type={getLocalizedString(this.state.abilityStrings, "dota_ability_variable_cast_range").toUpperCase() + ":"}
                            value={castRangeAmt} />
                }
                <div className="py-1" />
                {
                    valuesInformation && valuesInformation.map((value, index) => {
                        if (containsLocalizedString(this.state.abilityStrings, value.key)) {
                            return (
                                <TypeValueUI 
                                    key={ `${value.key}-${index}` }
                                    type={ getLocalizedString(this.state.abilityStrings, value.key) }
                                    value={ value.value } />
                            );   
                        }
                    })
                }
            </div>
        );
    }
}

export default AbilityDetails;