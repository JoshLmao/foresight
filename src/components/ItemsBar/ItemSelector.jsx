import React, { Component } from 'react';
import {
    Tabs,
    Tab,
    Button,
    Form,
    ListGroup
} from "react-bootstrap";
import { getLocalizedString } from '../../utility/data-helpers/language';
import { DOTAAbilities } from "../../data/dota2/json/items.json";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';

import {
    getItemIcon
} from "../../utility/spriteHelper";

import "./ItemSelector.css";
import "../../css/dota_items.css";


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

function ItemIcon(props) {
    return (
            <div 
                key={props.keyName} 
                title={props.itemName} 
                onClick={props.onClick}
                data-item={props.itemName}
                className="m-1" 
                style={{ width: `calc(88px * ${props.scale})`, height: `calc(64px * ${props.scale})` }}>
                { 
                    getItemIcon(props.itemName, "88px", "64px", props.scale) 
                }
            </div>
    );
}

function TabHeading(props) {
    return (
        <h6 className="px-3 mb-0">{props.text}</h6>
    );
}

class ItemSelector extends Component {
    constructor(props) {
        super(props);

        let selectableItems = Object.keys(DOTAAbilities).filter((value) => {
            let key = value.toLowerCase();
            let ability = DOTAAbilities[value];
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

        let basicItems = getItemsByQuality(selectableItems, ["consumable", "component", "secret_shop"]);
        let upgradesItems = getItemsByQuality(selectableItems, ["common", "rare", "epic", "artifact"]);

        this.state = {
            allItems: selectableItems,
            queryItems: null,

            onSelectedItem: props.onSelectedItem,
            dotaStrings: props.dotaStrings,
            abilityStrings: props.abilityStrings,

            basicItems: basicItems,
            upgradesItems: upgradesItems,
        };

        this.onSearchChanged = this.onSearchChanged.bind(this);
        this.onSearchItemSelected = this.onSearchItemSelected.bind(this);
        this.onShopItemSelected = this.onShopItemSelected.bind(this);
        this.onRemoveItemSelected = this.onRemoveItemSelected.bind(this);
    }

    componentDidUpdate(prevProps) {
        if(prevProps !== this.props) {
            this.setState({
                dotaStrings: this.props.dotaStrings,
                abilityStrings: this.props.abilityStrings,
                onSelectedItem: this.props.onSelectedItem,
            });
        }
    }

    onSearchChanged(e) {
        let query = e.target.value;
        let filteredItems = null;
        if (query) {
            filteredItems = this.state.allItems.filter((item) => {
                let localizedName = getLocalizedString(this.state.abilityStrings, `DOTA_Tooltip_Ability_${item.name}`)?.toLowerCase();
                return localizedName && localizedName.indexOf(query.toLowerCase()) !== -1; 
            });
        }

        this.setState({
            queryItems: filteredItems,
        });
    }

    onSearchItemSelected(e) {
        let val = e.target.dataset?.item;
        this.state.onSelectedItem(val);
    }

    onShopItemSelected (e) {
        let item = e.target.dataset?.item;
        this.state.onSelectedItem(item);
    }

    onRemoveItemSelected(e) {
        let item = null;
        this.state.onSelectedItem(item);
    }

    render() {
        let scale = 0.5;
        let searchIconScale = 0.45;
        return (
            <div className="item-card">
                <div className="item-card header d-flex p-2">
                    <div>
                        <Form.Control type="text" placeholder="Search..." onChange={this.onSearchChanged}/>
                    </div>
                    <div className="ml-auto">
                        <Button variant="outline-danger" onClick={this.onRemoveItemSelected}>
                            <FontAwesomeIcon icon={faMinus} />
                        </Button>
                    </div>
                </div>
                <div className="item-card content">
                    <div className="">
                        {
                            this.state.queryItems && 
                            <div>
                                <h5>
                                    { getLocalizedString(this.state.dotaStrings, "DOTA_Shop_Search_Results_Title") }
                                </h5>
                                <ListGroup>
                                    {
                                        // Query search term
                                        this.state.queryItems.map((item) => {
                                            let localizedName = getLocalizedString(this.state.abilityStrings, `DOTA_Tooltip_Ability_${item.name}`);
                                            return (
                                                <ListGroup.Item 
                                                    key={item.name} 
                                                    data-item={item.name} 
                                                    className="py-1 px-3"
                                                    onClick={this.onSearchItemSelected} 
                                                    action>
                                                    <div className="d-flex" data-item={item.name}>
                                                        <ItemIcon 
                                                            itemName={item.name}
                                                            onClick={this.onSearchItemSelected} 
                                                            scale={searchIconScale}/>

                                                        <h6 className="mx-1 my-auto" data-item={item.name}>
                                                            { localizedName }
                                                        </h6>
                                                    </div>
                                                </ListGroup.Item>
                                            )
                                        })
                                    }   
                                </ListGroup>
                                {
                                    this.state.queryItems && this.state.queryItems.length <= 0 &&
                                        <h6>
                                            { getLocalizedString(this.state.dotaStrings, "DOTA_Shop_Search_No_Results") }
                                        </h6>
                                }
                            </div>
                        }
                    </div>
                    {/* Regular view */}
                    {
                        !this.state.queryItems && 
                            <div>
                                <Tabs defaultActiveKey="basic" transition={false} id="shop-tabs">
                                    <Tab eventKey="basic" title={<TabHeading text={getLocalizedString(this.state.dotaStrings, "DOTA_Shop_Category_Basics")} />}>
                                        <div className="d-flex flex-wrap">
                                            {
                                                this.state.basicItems && this.state.basicItems.map((item) => {
                                                    return (
                                                        <ItemIcon 
                                                            key={item.item.ID}
                                                            itemName={item.name}
                                                            onClick={this.onShopItemSelected} 
                                                            scale={scale} />
                                                    )
                                                })
                                            }
                                        </div>
                                    </Tab>
                                    <Tab eventKey="upgrades" title={<TabHeading text={getLocalizedString(this.state.dotaStrings, "DOTA_Shop_Category_Upgrades")} />}>
                                        <div className="d-flex flex-wrap">
                                            {
                                                this.state.upgradesItems && this.state.upgradesItems.map((item) => {
                                                    return (
                                                        <ItemIcon 
                                                            key={item.item.ID}
                                                            itemName={item.name}
                                                            onClick={this.onShopItemSelected} 
                                                            scale={scale} />
                                                    );
                                                })
                                            }
                                        </div>
                                    </Tab>
                                </Tabs>
                            </div>
                    }
                </div>
            </div>
        );
    }
}

export default ItemSelector;