import React, { Component } from 'react';
import { 
    Row, 
    Col 
} from 'react-bootstrap';
import { getLocalizedString, getTooltipAbilityString } from '../../utility/data-helpers/language';
import { getAbilityIconURL } from '../Abilities/abilities-helper';
import { 
    getScepterIconPath,
    getShardIconPath
} from './aghs-helper';

import "./Aghanims.css";

/// Single descriptor for the aghanim's scepter/shard tooltip
function AghanimDescriptor(props) {
    let iconWidth = "35px", iconHeight = "30px";
    let isScepter = props.descriptorType === "scepter";
    let isUpgrade = props.type === "DOTA_AbilityTooltip_Upgrade";
    return (
        <div className="aghanim-container">
            {/* Title Bar */}
            <div 
                className="d-flex descriptor-title-bar">
                {/* Descriptor's type image */}
                <img 
                    src={isScepter ? getScepterIconPath(props.descriptorOn) : getShardIconPath(props.descriptorOn) }
                    className="mx-2 my-auto"
                    style={{
                        height:  isScepter ? iconHeight : "",
                        width: !isScepter ? iconWidth : "",
                    }}
                    />
                {/* Descriptor's title */}
                <h6 className="my-auto aghanims-title">
                    { props.titleName }
                </h6>
            </div>
            {/* Main Body */}
            <div className={`d-flex m-2 description-container ${ !isUpgrade ? "ability" : "" }`}>
                {/* Icon */}
                <div>
                    <img 
                        className="m-1 aghanim-ability-icon"
                        src={ getAbilityIconURL(props.ability) }
                        style={{
                            height: iconWidth,
                            width: iconWidth, 
                        }}
                        />
                </div>
                <div>
                    <div className="d-flex m-1 descriptor-title-box">
                        {/* Main title */}
                        <h6 className="my-0 title">
                            { props.title }
                        </h6>
                        {/* Type that is given with shard/scepter (Upgrade or Ability) */}
                        <div className={`align-self-start mx-3 upgrade-type ${ isUpgrade ? "upgrade-title" : "ability-title" }`}>
                            <h6 
                                className="mx-2 my-1"
                                style={{
                                    fontSize: "0.5rem",
                                }}>
                                { getLocalizedString(props.dotaStrings, props.type) }
                            </h6>
                        </div>
                    </div>
                    {/* Descriptive body */}
                    <div className="m-1">
                        { props.description }
                    </div>
                </div>
            </div>
        </div>
    );
}

class AghanimsDescriptorTooltip extends Component {
    constructor(props) {
        super(props);

        this.state = {
            shardOn: props.shardOn,
            scepterOn: props.scepterOn,

            scepterAbility: props.scepterAbility,
            shardAbility: props.shardAbility,

            dotaStrings: props.dotaStrings,
            abilityStrings: props.abilityStrings,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.shardOn != prevProps.shardOn) {
            this.setState({
                shardOn: this.props.shardOn,
            });
        }
        if (this.props.scepterOn != prevProps.scepterOn) {
            this.setState({
                scepterOn: this.props.scepterOn,
            });
        }
        if (this.props.scepterAbility != prevProps.scepterAbility) {
            this.setState({
                scepterAbility: this.props.scepterAbility,
            });
        }
        if (this.props.shardAbility != prevProps.shardAbility) {
            this.setState({
                shardAbility: this.props.shardAbility,
            });
        }
        if (this.props.abilityStrings != prevProps.abilityStrings) {
            this.setState({
                abilityStrings: this.props.abilityStrings,
            });
        }
        if (this.props.dotaStrings != prevProps.dotaStrings) {
            this.setState({
                dotaStrings: this.props.dotaStrings,
            });
        }
    }

    render() {
        return (
            <div
                style={{
                    background: "black",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "transparent",
                    maxWidth: "600px",
                    maxHeight: "800px",
                }}>
                {/* Aghanims Scepter */}
                <AghanimDescriptor
                    descriptorType="scepter"
                    descriptorOn={ this.state.scepterOn }
                    titleName={ getLocalizedString(this.state.dotaStrings, "DOTA_AbilityTooltip_Aghs_Scepter") }
                    ability={this.state.scepterAbility?.abilityName}
                    title={ this.state.scepterAbility ? getTooltipAbilityString(this.state.abilityStrings, this.state.scepterAbility.abilityName) : "?" }
                    description={ this.state.scepterAbility ? getTooltipAbilityString(this.state.abilityStrings, this.state.scepterAbility.abilityName + "_Description") : "?" }
                    type={ this.state.scepterAbility ? this.state.scepterAbility.type : "?" }

                    dotaStrings={this.state.dotaStrings}
                    />
                

                {/* Separator */}
                <div className="tooltip-aghs-separator">
                </div>

                {/* Aghanims Shard */}
                <AghanimDescriptor
                    descriptorType="shard"
                    descriptorOn={ this.state.shardOn }
                    titleName={ getLocalizedString(this.state.dotaStrings, "DOTA_AbilityTooltip_Aghs_Shard") }
                    ability={ this.state.shardAbility?.abilityName }
                    title={ this.state.shardAbility ? getTooltipAbilityString(this.state.abilityStrings, this.state.shardAbility.abilityName) : "?" }
                    description={ this.state.shardAbility ? getTooltipAbilityString(this.state.abilityStrings, this.state.shardAbility.abilityName + "_Description") : "?" }
                    type={ this.state.shardAbility ? this.state.shardAbility.type : "?" }

                    dotaStrings={this.state.dotaStrings}
                    />
            </div>
        );
    }
}

export default AghanimsDescriptorTooltip;