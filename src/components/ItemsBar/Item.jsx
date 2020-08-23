import React, { Component } from 'react';
import Popup from 'reactjs-popup';

import ItemSelector from "./ItemSelector";

import "../../css/dota_hero_icons_big.css";
import ItemInfoTooltip from './ItemInfoTooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';

/// Single item that contains a popup to change the item
class Item extends Component {
    constructor(props) {
        super(props);

        this.state = {
            item: props.item,
            slot: props.slot,
            isBackpack: props.isBackpack,

            onItemChanged: props.onItemChanged,

            abilityStrings: props.abilityStrings,
        };

        //console.log(`slot: ${this.state.slot} - item: ${this.state.item}`);
        this.getItemIcon = this.getItemIcon.bind(this);
        this.onSelectedItem = this.onSelectedItem.bind(this);
    }

    getItemIcon(item, width, height, scale) {
        // Width and height of each item in item_stylesheet
        if (item) {
            return <span className={ 'sprite sprite-' + item + '_png '} alt={item} style={{ transform: `scale(${scale}, ${scale})`, transformOrigin: "top left" }} />
        } else {
            return <span style={{ backgroundColor: "#212121", width: width, height: height, transform: `scale(${scale}, ${scale})`, display: "block", transformOrigin: "top left" }} />
        }
    }

    onSelectedItem (item) {
        this.setState({
            open: false,
        });
        
        this.state.onItemChanged({ 
            slot: this.state.slot, 
            item: item,
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
    }   

    render() {
        let scale = 0.7;
        let width = "88px";
        let height = "64px";
        return (
            <div>
                {
                    this.state.item &&
                        <Popup
                            trigger={isOpen => (
                                <div
                                    className="ml-2 mt-1" 
                                    style={{ position:"absolute", zIndex: 1 }}>
                                    <FontAwesomeIcon icon={faInfo} />
                                </div>
                            )}
                            open={this.state.hoverOpen}
                            position="right center"
                            on="hover"
                            contentStyle={{ width: "350px", overflowY: "auto", padding: 0, border: 0 }}>
                                <ItemInfoTooltip
                                    itemName={this.state.item}
                                    abilityStrings={this.state.abilityStrings}
                                    />
                        </Popup>
                }
                <Popup
                    trigger={isOpen => (
                        <div className="m-1" style={{ width: `calc(${width} * ${scale})`, height: `calc(${height} * ${scale})` }}  onClick={() => this.setState({ open: isOpen })}>
                            {  this.getItemIcon(this.state.item, width, height, 0.7) }
                        </div>
                    )}
                    open={this.state.open}
                    position="right center"
                    contentStyle={{ width: "350px", height: "400px", overflowY: "auto" }}>
                        <ItemSelector onSelectedItem={this.onSelectedItem} />
                </Popup>
            </div>
            
        );
    }
}

export default Item;