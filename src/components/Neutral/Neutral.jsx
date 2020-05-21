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
        };

        this.onNeutralSelected = this.onNeutralSelected.bind(this);
    }

    onNeutralSelected(e) {
        var neutral = e.target.parentElement.parentElement.dataset.neutral;

        this.setState({
            neutralItem: { item: neutral },
        });
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
                    <NeutralItemSelector onNeutralSelected={this.onNeutralSelected} />
                </Popup>
            </div>
        );
    }
}

export default Neutral;