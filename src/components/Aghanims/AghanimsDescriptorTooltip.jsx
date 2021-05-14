import React, { Component } from 'react';
import { 
    Row, 
    Col 
} from 'react-bootstrap';
import { getTooltipAbilityString } from '../../utility/data-helpers/language';
import { getAbilityIconURL } from '../Abilities/abilities-helper';
import { 
    getScepterIconPath,
    getShardIconPath
} from './aghs-helper';

/// Single descriptor for the aghanim's scepter/shard tooltip
function AghanimDescriptor(props) {
    let iconWidth = "40px", iconHeight = "30px";
    let isScepter = props.descriptorType === "scepter";
    return (
        <div>
            {/* Title Bar */}
            <div 
                className="d-flex my-2"
                style={{
                    backgroundColor: "#212e34"
                }}>
                <img 
                    src={isScepter ? getScepterIconPath(props.descriptorOn) : getShardIconPath(props.descriptorOn) }
                    className="mx-2"
                    style={{
                        height:  isScepter ? iconHeight : "",
                        width: !isScepter ? iconWidth : "",
                    }}
                    />
                <h6>
                    {props.titleName}
                </h6>
                <h6 style={{
                    fontSize: "0.5rem",
                    textTransform: "uppercase"
                }}>
                    { props.type}
                </h6>
            </div>
            {/* Scepter Body */}
            <Row>
                {/* Icon */}
                <Col md={4}>
                    <img 
                        className="m-3"
                        src={getAbilityIconURL(props.ability)}
                        style={{
                            height: iconWidth,
                            width: iconWidth, 
                        }}
                        />
                </Col>
                <Col md={8}>
                    <h6>{props.title}</h6>
                    <p>
                        {props.description}
                    </p>
                </Col>
            </Row>
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

            abilityStrings: props.abilityStrings,
        };
    }

    componentDidUpdate(prevProps) {
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
    }

    render() {
        return (
            <div
                style={{background: "black"}}>
                {/* Aghanims Scepter */}
                <div>
                    <AghanimDescriptor
                        descriptorType="scepter"
                        descriptorOn={this.state.scepterOn}
                        titleName="Aghanim's Scepter"
                        ability={this.state.scepterAbility}
                        title={ this.state.scepterAbility ? getTooltipAbilityString(this.state.abilityStrings, this.state.scepterAbility.abilityName) : "?" }
                        description={ this.state.scepterAbility ? getTooltipAbilityString(this.state.abilityStrings, this.state.scepterAbility.abilityName + "_Description") : "?" }
                        type={ this.state.scepterAbility ? this.state.scepterAbility.type : "?" }
                        />
                </div>

                {/* Separator */}
                <div style={{ 
                    backgroundColor: "#111312",
                    height: "1rem",
                }}>
                </div>

                {/* Aghanims Shard */}
                <div>
                    <AghanimDescriptor
                        descriptorType="shard"
                        descriptorOn={this.state.shardOn}
                        titleName="Aghanim's Shard"
                        ability={ this.state.shardAbility }
                        title={ this.state.shardAbility ? getTooltipAbilityString(this.state.abilityStrings, this.state.shardAbility.abilityName) : "?" }
                        description={ this.state.shardAbility ? getTooltipAbilityString(this.state.abilityStrings, this.state.shardAbility.abilityName + "_Description") : "?" }
                        type={ this.state.shardAbility ? this.state.shardAbility.type : "?" }
                        />
                </div>
            </div>
        );
    }
}

export default AghanimsDescriptorTooltip;