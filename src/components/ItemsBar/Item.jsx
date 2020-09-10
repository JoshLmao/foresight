import React, { Component } from 'react';
import Popup from 'reactjs-popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faInfo, 
    faChevronUp,
    faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import {
    Button,
    Form
} from "react-bootstrap";

import ItemSelector from "./ItemSelector";

import "../../css/dota_hero_icons_big.css";
import ItemInfoTooltip from './ItemInfoTooltip';

import {
    getItemIcon
} from "../../utility/spriteHelper"
import { 
    tryGetItemInfoValue, 
    getItemInfoFromName,
    itemRequiresCharges
} from '../../utility/dataHelperItems';


/// Single item that contains a popup to change the item
class Item extends Component {
    constructor(props) {
        super(props);

        this.state = {
            item: props.item,
            slot: props.slot, 
            isBackpack: props.isBackpack,

            onItemChanged: props.onItemChanged,
            onItemExtraChanged: props.onItemExtraChanged,

            dotaStrings: props.dotaStrings,
            abilityStrings: props.abilityStrings,

            itemExtra: { },

            itemSelectorDisabled: false,
        };

        //console.log(`slot: ${this.state.slot} - item: ${this.state.item}`);
        this.onSelectedItem = this.onSelectedItem.bind(this);
        this.onBloodstoneChargesChanged = this.onBloodstoneChargesChanged.bind(this);
        this.setCharges = this.setCharges.bind(this);
    }

    componentDidMount() {
        if (this.state.item === "item_bloodstone") {
            /// Set inital charges of bloodstone
            let itemInfo = getItemInfoFromName(this.state.item);
            this.setState({
                itemExtra: {
                    ...this.state.itemExtra,
                    charges: itemInfo?.ItemInitialCharges ?? 0,
                },
            }, () => {
                /// Update state to new init value
                this.setCharges(this.state.itemExtra.charges);
            });
        }
    }

    onSelectedItem (item) {
        // Close item selector popup by disabling
        this.setState({
            itemSelectorDisabled: true,
        });
        
        // Trigger onItemChanged event
        this.state.onItemChanged({ 
            slot: this.state.slot, 
            item: item,
            extra: this.state.itemExtra,
            isBackpack: this.state.isBackpack ? true : false,
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.item !== this.props.item) {
            this.setState({ item: this.props.item, });
        }

        if (prevProps.slot !== this.props.slot) {
            this.setState({ slot: this.props.slot });
        }

        if (prevProps.isBackpack !== this.props.isBackpack) {
            this.setState({ isBackpack: this.props.isBackpack });
        }

        if (prevProps.abilityStrings !== this.props.abilityStrings) {
            this.setState({ abilityStrings: this.props.abilityStrings });
        }

        if (prevProps.dotaStrings !== this.props.dotaStrings) {
            this.setState({ dotaStrings: this.props.dotaStrings });
        }
    }

    onBloodstoneChargesChanged (e) {
        let newVal = parseInt(e.target.value);
        this.setCharges(newVal);
    }

    setCharges(newChargeAmt) {
        // If null or not exist, set to 0
        if (!newChargeAmt) {
            newChargeAmt = 0;
        }

        // Value must be more than 0 and less than 999
        if (newChargeAmt < 0) {
            newChargeAmt = 0;
        } else if (newChargeAmt > 999) {
            newChargeAmt = 999;
        }
        
        this.setState({
            itemExtra: {
                ...this.state.itemExtra,
                charges: newChargeAmt,
            },
        }, () => {
            this.state.onItemChanged({
                slot: this.state.slot, 
                item: this.state.item,
                extra: this.state.itemExtra,
                isBackpack: this.state.isBackpack ? true : false,
            });
        });
    }

    render() {
        // If last render was disabled, enable again
        if (this.state.itemSelectorDisabled) {
            this.setState({ itemSelectorDisabled: false });
        }

        let scale = 0.7;
        let width = "88px";
        let height = "64px";
        return (
            // Relative to make positioning work on children
            <div style={{ position:"relative" }}>
                {
                    // Hover popup for Item information tooltip
                    this.state.item &&
                        <Popup
                            trigger={isOpen => (
                                // Info icon on item to display tooltip
                                <div
                                    className="ml-2 mt-1" 
                                    style={{ position:"absolute", zIndex: 1 }}>
                                    <FontAwesomeIcon icon={faInfo} />
                                </div>
                            )}
                            position="right center"
                            on="hover"
                            contentStyle={{ width: "350px", overflowY: "auto", padding: 0, border: 0 }}>
                                <ItemInfoTooltip
                                    itemName={this.state.item}
                                    dotaStrings={this.state.dotaStrings}
                                    abilityStrings={this.state.abilityStrings}
                                    />
                        </Popup>
                }
                {/* Item selector popup to allow for changing to new item */}
                <Popup
                    trigger={isOpen => (
                        // Item icon
                        <div className="m-1">
                            <div style={{ width: `calc(${width} * ${scale})`, height: `calc(${height} * ${scale})` }}>
                                {  getItemIcon(this.state.item, width, height, 0.7) }
                            </div>
                        </div>
                    )}
                    closeOnDocumentClick 
                    disabled={this.state.itemSelectorDisabled}
                    position="right center"
                    on="click"
                    contentStyle={{ width: "350px", height: "450px", overflowY: "auto", padding: 0, border: 0  }}>
                        <ItemSelector 
                            onSelectedItem={this.onSelectedItem}
                            dotaStrings={this.state.dotaStrings}
                            abilityStrings={this.state.abilityStrings} />
                </Popup>
                {
                    // Charge counter UI for bloodstone or charge based items
                    (this.state.item === "item_bloodstone" || itemRequiresCharges(this.state.item)) &&
                    <div style={{ 
                        position: "absolute", 
                        zIndex: 1, 
                        width: `calc(${width} * ${scale})`, 
                        height: `calc(${height} * ${scale})`,
                        top: `calc(${height} * ${scale} - 17px)`,
                        left: `calc(${width} * ${scale} - 27px)`, 
                    }}>
                        <Form.Control 
                            size="sm" 
                            value={ this.state.itemExtra?.charges ?? 0 } 
                            onChange={this.onBloodstoneChargesChanged} 
                            style={{ 
                                width: "30px",
                                height: "20px",
                                padding: 0,
                                textAlign: "center",
                                background: "rgba(0, 0, 0, 0.5)",
                                border: 0,
                                color: "white"
                            }} />
                    </div>
                }
            </div>
            
        );
    }
}

export default Item;