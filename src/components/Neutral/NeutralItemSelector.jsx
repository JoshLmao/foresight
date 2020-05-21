import React, { Component } from 'react';
import {
    Button
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";


import { itemNameToElement } from "../../utils";
import { DOTAAbilities as DOTAItems } from "../../data/dota2/json/items.json";

import "./NeutralItemSelector.css";

class NeutralItemSelector extends Component {
    constructor(props) {
        super(props);

        /// Filter out unused or unnecessary keys in items.json
        var selectableNeutrals = Object.keys(DOTAItems).filter((value) => {
            var key = value.toLowerCase();
            var ability = DOTAItems[value];
            if (key !== "version" && !key.includes("recipe") && !ability.IsObsolete) {
                if (ability.ItemIsNeutralDrop === "1") {
                    return true;
                }
            }
            return false;
        });
        selectableNeutrals.sort();

        // Map to an object
        selectableNeutrals = selectableNeutrals.map((key) => {
            var itemInfo = DOTAItems[key];
            if (itemInfo.ItemIsNeutralDrop === "1") {
                // Remove 'item_' prefix, split by _, remove "item" and join again
                var name = key.split('_');
                name.shift();
                name = name.join('_');

                return {
                    item: name,
                    itemInfo: itemInfo,
                };
            }
        });
        
        this.state = {
            allNeutrals: selectableNeutrals,
            iconScale: 0.5,
            onNewNeutralSelected: props.onNeutralSelected,
        };

        this.onNeutralSelected = this.onNeutralSelected.bind(this);
    }

    onNeutralSelected(e) {
        var neutral = e.target.parentElement.parentElement.dataset.neutral;
        this.state.onNewNeutralSelected({ item: neutral });
    }

    render() {
        return (
            <div className="neutral-item-card" style={{ color: "black" }}>
                <div className="neutral-item-card header d-flex">
                    <h5 className="my-auto">NEUTRAL ITEMS</h5>
                    <Button className="ml-auto" variant="outline-danger" onClick={this.onNeutralSelected} data-neutral={null}>
                        <FontAwesomeIcon icon={faMinus} data-neutral={null} />
                    </Button>
                </div>
                <div className="neutral-item-card content">
                    <div className="d-flex flex-wrap">
                        {
                            this.state.allNeutrals && this.state.allNeutrals.map((itemInfo) => {
                                return ( 
                                    <div 
                                        className="m-1" 
                                        key={itemInfo.item} 
                                        onClick={this.onNeutralSelected} 
                                        title={itemInfo.item}
                                        data-neutral={itemInfo.item}>
                                        { itemNameToElement(itemInfo, this.state.iconScale) }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default NeutralItemSelector;