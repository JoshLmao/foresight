import React, { Component } from 'react';
import {
    Tabs,
    Tab,
    Button
} from "react-bootstrap";
import { DOTAAbilities } from "../../data/dota2/json/items.json";

import "./ItemSelector.css";
import "../../css/dota_items.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';

function getItemsByQuality(itemsArray, matchArray) {
    return itemsArray.filter((itemInfo) => {
        var quality = itemInfo.item.ItemQuality;
        if (quality) { //(quality === "consumable" || quality === "component" || quality === "secret_shop")) {

            for(var i = 0; i < matchArray.length; i++) {
                if (quality === matchArray[i]) {
                    return itemInfo;
                }
            }
        }
    });
}

function getItemIcon(item, width, height, scale) {
    // Remove 'item_' prefix, split by _, remove "item" and join again
    item = item.split('_');
    item.shift();
    item = item.join('_');

    // Width and height of each item in item_stylesheet
    if (item === "none") {
        return <span style={{ backgroundColor: "#212121", width: width, height: height, transform: `scale(${scale}, ${scale})`, display: "block", transformOrigin: "top left" }} />
    } else {
        return <span className={ 'sprite sprite-' + item + '_png '} alt={item} data-item={item} style={{ transform: `scale(${scale}, ${scale})`, transformOrigin: "top left" }} />
    }
}

function ItemFromInfo(props) {
    return (
            <div 
                key={props.keyName} 
                title={props.item.name} 
                onClick={props.onClick}
                className="m-1" 
                style={{ width: `calc(88px * ${props.scale})`, height: `calc(64px * ${props.scale})` }}>
                { 
                    getItemIcon(props.item.name, "88px", "64px", props.scale) 
                }
            </div>
    );
}

class ItemSelector extends Component {
    constructor(props) {
        super(props);

        var selectableItems = Object.keys(DOTAAbilities).filter((value) => {
            var key = value.toLowerCase();
            var ability = DOTAAbilities[value];
            if (key !== "version" && !key.includes("recipe") && !ability.ItemIsNeutralDrop && !ability.IsObsolete) {
                return true;
            }
            return false;
        });
        // Convert keys to item data
        selectableItems = selectableItems.map((key) => {
            return {
                item:  DOTAAbilities[key],
                name: key,
            };
        })
        selectableItems.sort();

        var basicItems = getItemsByQuality(selectableItems, ["consumable", "component", "secret_shop"]);
        var upgradesItems = getItemsByQuality(selectableItems, ["common", "rare", "epic", "artifact"]);

        this.state = {
            allItems: selectableItems,
            onSelectedItem: props.onSelectedItem,

            basicItems: basicItems,
            upgradesItems: upgradesItems,
        };
    }

    render() {
        var scale = 0.5;
        return (
            <div className="item-card">
                <div className="item-card header d-flex">
                    <h5 className="my-auto">CHOOSE AN ITEM</h5>
                    <div className="ml-auto">
                        <Button data-item="none" variant="outline-danger" onClick={this.state.onSelectedItem}>
                            <FontAwesomeIcon icon={faMinus} data-item="none" />
                        </Button>
                    </div>
                </div>
                <div className="item-card content">
                    <Tabs defaultActiveKey="basic" transition={false} id="shop-tabs">
                        <Tab eventKey="basic" title="Basic">
                            <div className="d-flex flex-wrap">
                                {
                                    this.state.basicItems && this.state.basicItems.map((item) => {
                                        return (
                                            <ItemFromInfo 
                                                key={item.item.ID}
                                                item={item}
                                                onClick={this.state.onSelectedItem} 
                                                scale={scale} />
                                        )
                                    })
                                }
                            </div>
                        </Tab>
                        <Tab eventKey="upgrades" title="Upgrades">
                            <div className="d-flex flex-wrap">
                                {
                                    this.state.upgradesItems && this.state.upgradesItems.map((item) => {
                                        return (
                                            <ItemFromInfo 
                                                keyName={item.item.ID}
                                                item={item}
                                                onClick={this.state.onSelectedItem} 
                                                scale={scale} />
                                        );
                                    })
                                }
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default ItemSelector;