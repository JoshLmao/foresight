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
            hero: props.hero,
            level: props.heroLevel,
            items: props.items,
            talents: props.talents,
            neutral: props.neutral,
            abilities: props.abilities,
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
                    value={parse(this.state.hero?.AttributeBaseStrength)} 
                    per={parse(this.state.hero?.AttributeStrengthGain)} 
                    isPrimaryAttribute={this.state.hero?.AttributePrimary === EAttributes.ATTR_STRENGTH}/>

                <Attribute 
                    type="agility"
                    value={parse(this.state.hero?.AttributeBaseAgility)}
                    per={parse(this.state.hero?.AttributeAgilityGain)} 
                    isPrimaryAttribute={this.state.hero?.AttributePrimary === EAttributes.ATTR_AGILITY} />

                <Attribute 
                    type="intelligence" 
                    value={parse(this.state.hero?.AttributeBaseIntelligence)}
                    per={parse(this.state.hero?.AttributeIntelligenceGain)} 
                    isPrimaryAttribute={this.state.hero?.AttributePrimary === EAttributes.ATTR_INTELLIGENCE} />
            </div>
        );
    }
}

export default Attributes;