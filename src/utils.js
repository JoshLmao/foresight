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
                className="m-1"
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
    var keys = Object.keys(heroInfo);
    var abilities = [];
    for(var i = 0; i < keys.length; i++) {
        if (keys[i].includes("Ability") && !keys[i].includes("AbilityDraft")) {
            var ability = heroInfo[keys[i]];
            if (ability && !ability.includes("special_bonus") && ability !== "generic_hidden") {
                abilities.push(ability);
            }
        }
    }
    return abilities;
}

/// Gets all hero talents from a hero info
export function getHeroTalents (heroInfo) {
    // Get simple array of all talents from npc_heroes.json
    // All abilities are stored in npc_heroes.json as "Ability?", where ? is a number. 
    // Not always in numberical order like 1, 2, 3

    var keys = Object.keys(heroInfo);
    var talents = [];
    for(var i = 0; i < keys.length; i++) {
        if (keys[i].includes("Ability") && !keys[i].includes("AbilityDraft")) {
            var ability = heroInfo[keys[i]];
            if (ability && ability.includes("special_bonus")) {
                talents.push(ability);
            }
        }
    }

    // sort into nice list
    var mappedTalents = [];
    var lvlRow = 0;
    for (i = 0 ; i < talents.length; i += 2) {
        mappedTalents.push({
            lvl: 10 + (5 * lvlRow),
            rightTalent: talents[i],
            leftTalent: talents[i + 1]
        });

        lvlRow++;
    }

    // Sort by lvl 25 talents first
    mappedTalents.sort((a, b) => a.lvl < b.lvl ? 1 : -1);

    return mappedTalents;
}