import React, { Component } from 'react';

function parse(value) {
    return parseFloat(value).toFixed(2);
}

function Attribute(props) {
    return (
        <div className="d-flex my-2">
            <span className={'attribute ' + props.type + " mr-2"} alt="attribute" />
            <div>{props.value}</div>
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

    render() {
        return (
            <div>
                <h5>STATS</h5>
                <h6>ATTRIBUTES</h6>
                <Attribute 
                    type="strength" 
                    value={parse(this.state.baseStrength)} 
                    per={parse(this.state.strengthGain)} />

                <Attribute 
                    type="agility"
                    value={parse(this.state.baseAgility)}
                    per={parse(this.state.agilityGain)} />

                <Attribute 
                    type="intelligence" 
                    value={parse(this.state.baseIntelligence)}
                    per={parse(this.state.intelligenceGain)} />
            </div>
        );
    }
}

export default Attributes;