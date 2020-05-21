import React, { Component } from 'react';

import { EAttributes } from "../../enums/attributes.js";

import "./Attributes.css";

function parse(value) {
    return parseFloat(value).toFixed(2);
}

function Attribute(props) {
    return (
        <div className="d-flex my-2">
            <div className={props.isPrimaryAttribute ? " primary-attribute" : ""}>
                <span className={'attribute ' + props.type} alt="attribute" />
            </div>
            <div className="ml-2">{props.value}</div>
            <div className="px-1">+</div>
            <div>{props.per}</div>
            <div className="px-1">per level</div>
        </div>
    );
}

class Attributes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            primaryAttribute: props.primaryAttribute,

            baseStrength: props.baseStrength,
            strengthGain: props.strengthGain,
            baseAgility: props.baseAgility,
            agilityGain: props.agilityGain,
            baseIntelligence: props.baseIntelligence,
            intelligenceGain: props.intelligenceGain,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.baseStrength != this.props.baseStrength || prevProps.baseAgility != this.props.baseAgility || prevProps.baseIntelligence != this.props.baseIntelligence) {
            this.setState({
                primaryAttribute: this.props.primaryAttribute,

                baseStrength: this.props.baseStrength,
                strengthGain: this.props.strengthGain,
                baseAgility: this.props.baseAgility,
                agilityGain: this.props.agilityGain,
                baseIntelligence: this.props.baseIntelligence,
                intelligenceGain: this.props.intelligenceGain,
            });
        }
    }

    render() {
        return (
            <div>
                <h5>STATS</h5>
                <h6>ATTRIBUTES</h6>
                <Attribute 
                    type={"strength"} 
                    value={parse(this.state.baseStrength)} 
                    per={parse(this.state.strengthGain)} 
                    isPrimaryAttribute={this.state.primaryAttribute === EAttributes.ATTR_STRENGTH}/>

                <Attribute 
                    type="agility"
                    value={parse(this.state.baseAgility)}
                    per={parse(this.state.agilityGain)} 
                    isPrimaryAttribute={this.state.primaryAttribute === EAttributes.ATTR_AGILITY} />

                <Attribute 
                    type="intelligence" 
                    value={parse(this.state.baseIntelligence)}
                    per={parse(this.state.intelligenceGain)} 
                    isPrimaryAttribute={this.state.primaryAttribute === EAttributes.ATTR_INTELLIGENCE} />
            </div>
        );
    }
}

export default Attributes;