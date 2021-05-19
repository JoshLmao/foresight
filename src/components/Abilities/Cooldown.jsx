import React, { Component } from 'react';
import {
    calculateAbilityCooldown
} from "../../utility/calculate";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCircle }from "@fortawesome/free-solid-svg-icons";

class Cooldown extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            abilityLevels: props.abilityLevels,
            abilityCooldown: props.cooldown,

            ability: props.ability,
            abilityInfo: props.abilityInfo,
            items: props.items,
            neutral: props.neutral,
            selectedTalents: props.selectedTalents,

            cooldown: null,
            charges: null,
        };

        this.updateCooldown = this.updateCooldown.bind(this);
    }

    componentDidMount() {
        this.updateCooldown();
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
            }, () => this.updateCooldown() );
        }
    }

    updateCooldown() {
        let currentCooldownInfo = calculateAbilityCooldown(this.state.ability, this.state.abilityInfo, this.state.abilityLevel, this.state.items, this.state.neutral, this.state.selectedTalents);
        
        this.setState({
            cooldown: currentCooldownInfo?.cooldown,
            charges: currentCooldownInfo?.charges,
        });
    }
    
    render() {
        return (
            <div>
                {
                    this.state.cooldown &&
                        <div className="d-flex" title="cooldown">
                            <FontAwesomeIcon className="my-auto mr-1" icon={faClock} />
                            <div>
                                { this.state.cooldown }
                            </div>
                        </div>
                }
                {
                    this.state.charges &&
                        <div className="d-flex" title="charges">
                            <FontAwesomeIcon className="my-auto mr-1" icon={faCircle} />
                            <div>
                                { this.state.charges }
                            </div>
                        </div>
                }
            </div>
        );
    }
}

export default Cooldown;