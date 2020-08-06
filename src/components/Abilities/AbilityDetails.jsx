import React, { Component } from 'react';
import { 
    getAbilityBehaviours,
    getAbilityCastRequirements
} from "../../utility/dataHelperAbilities";
import { 
    getTooltipString,
    getLocalizedString,
} from "../../utility/data-helpers/language";

function TypeValueUI (props) {
    return (
        <div className="d-flex" style={{ fontSize: "0.85rem"}}>
            <div className="mr-2">{props.type}</div>
            <div>{props.value}</div>
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
            castRequirements: null,

            abilityStrings: props.abilityStrings,
            dotaStrings: props.dotaStrings,
        };

        this.updateAbilityInfo = this.updateAbilityInfo.bind(this);
    }

    componentDidMount() {
        this.updateAbilityInfo();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.abilityInfo !== this.props.abilityInfo) {
            this.setState({ 
                abilityInfo: this.props.abilityInfo,
            }, () => {
                this.updateAbilityInfo();
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

    updateAbilityInfo() {
        this.setState({ 
            abilityBehaviours: getAbilityBehaviours(this.state.abilityInfo) ,
            castRequirements: getAbilityCastRequirements(this.state.abilityInfo, this.state.levelInfo),
        });
    }

    render() {
        return (
            <div className="mb-2">
                {
                    this.state.abilityBehaviours && this.state.abilityBehaviours.map((value, index) => {
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
                    this.state.castRequirements && this.state.castRequirements.map((value, index) => {
                        return (
                            <TypeValueUI 
                                key={index}
                                type={getLocalizedString(this.state.abilityStrings, value.key)}
                                value={value.value} />
                        )
                    })
                }
            </div>
        );
    }
}

export default AbilityDetails;