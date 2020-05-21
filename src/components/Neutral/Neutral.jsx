import React, { Component } from 'react';
import Popup from "reactjs-popup";

import NeutralItemSelector from "./NeutralItemSelector";

import { itemNameToElement } from "../../utils";

class Neutral extends Component {
    constructor(props) {
        super(props);

        this.state = {
            neutralItem: props.neutralItem,
            iconScale: 0.7,
            onNewNeutralSelected: props.onNewNeutralSelected,
        };
    }

    componentDidUpdate (prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                neutralItem: this.props.neutralItem,
            });
        }
    }

    render() {
        return (
            <div>
                <Popup
                    trigger={isOpen => {
                        return itemNameToElement(this.state.neutralItem, this.state.iconScale)
                    }}
                    position="right center"
                    contentStyle={{ width: "325px", overflowY: "auto" }}>
                    <NeutralItemSelector onNeutralSelected={this.state.onNewNeutralSelected} />
                </Popup>
            </div>
        );
    }
}

export default Neutral;