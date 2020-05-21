import React, { Component } from 'react';
import Popup from 'reactjs-popup';

import ItemSelector from "./ItemSelector";

import "../../css/dota_hero_icons_big.css";

/// Single item that contains a popup to change the item
class Item extends Component {
    constructor(props) {
        super(props);

        this.state = {
            item: props.item,
            slot: props.slot,
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

    onSelectedItem (e) {
        console.log("ItemSelected: " + e.target.dataset.item);
        this.setState({
            open: !this.state.open,
            item: e.target.dataset.item,
        });
    }

    render() {
        var scale = 0.7;
        var width = "88px";
        var height = "64px";
        return (
            <div>
                <Popup
                    trigger={isOpen => (
                        <div className="mx-1" style={{ width: `calc(88px * ${scale})`, height: `calc(64px * ${scale})` }}>
                            {  this.getItemIcon(this.state.item, width, height, 0.7) }
                        </div>
                    )}
                    position="right center"
                    contentStyle={{ width: "350px", height: "400px", overflowY: "auto" }}>
                        <ItemSelector onSelectedItem={this.onSelectedItem} />
                </Popup>
            </div>
            
        );
    }
}

export default Item;