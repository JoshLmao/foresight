import React from "react";

/// Returns a HTML element of a DotA item from it's info 
export function itemNameToElement (itemInfo, scale) {
    // Width and height of each item in item_stylesheet
    var width, height;
    width = "88px";
    height = "64px";
    if (itemInfo && itemInfo.item) {
        // Return item icon
        return (
            <div 
                style={{ 
                    width: `calc(${width} * ${scale})`, 
                    height: `calc(${height} * ${scale})`}}>
                <span 
                    className={ 'sprite sprite-' + itemInfo.item + '_png '} 
                    alt={itemInfo.item} 
                    style={{ 
                        transform: `scale(${scale}, ${scale})`, 
                        transformOrigin: "top left" 
                    }} />
            </div>
        );
    } else {
        // Return empty inventory slot since item is null/empty
        return (
            <div 
                style={{ 
                    width: `calc(${width} * ${scale})`, 
                    height: `calc(${height} * ${scale})` }}>
                <span 
                    style={{ 
                        backgroundColor: "#212121", 
                        width: width, 
                        height: height, 
                        transform: `scale(${scale}, ${scale})`, 
                        display: "block", 
                        transformOrigin: "top left" 
                    }} />
            </div>
        );
    }
}

/// Parses a display name from a hero info Model string
export function parseNameFromModel (modelString) {
    var dashSplit = modelString.split('.')[0].split('/');
    return dashSplit[dashSplit.length - 1];
};

/// Gets all hero abilities from a hero info
export function getAllHeroAbilities (heroInfo) {
    return [
        heroInfo.Ability1, heroInfo.Ability2, heroInfo.Ability3, heroInfo.Ability4, heroInfo.Ability5, heroInfo.Ability6, heroInfo.Ability7,
    ];
}