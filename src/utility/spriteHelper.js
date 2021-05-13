import React from "react";

export function filterItemName (name) {
    if (name) {
        let item = name.split('_');
        item.shift();
        item = item.join('_');
        return item;
    } else {
        return null;
    }
}

/// Gets an item icon from it's name. For exmaple "item_mango_tree"
export function getItemIcon (itemName, width, height, scale) {
    // Remove 'item_' prefix, split by _, remove "item" and join again
    let item = filterItemName(itemName);

    // Width and height of each item in item_stylesheet
    if (item) {
        return <span 
                    className={ 'dota-item dota-item-' + item + '_png '} 
                    alt={item} 
                    data-item={itemName} 
                    style={{ transform: `scale(${scale}, ${scale})`, transformOrigin: "top left" }} />
    } else {
        return <span 
                style={{ backgroundColor: "#212121", width: width, height: height, transform: `scale(${scale}, ${scale})`, display: "block", transformOrigin: "top left" }} />
    }
}