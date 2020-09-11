
// * Helper and utility functions to provide for retrieving data from "npc_items.json"
// * 
import { DOTAAbilities as DOTAItems } from "../data/dota2/json/items.json";
import { EAttributes } from "../enums/attributes";
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { tryParseAbilitySpecialValue } from "./dataHelperAbilities";
import { 
    getLocalizedString, 
    getEngAnilityLocalizedString 
} from "./data-helpers/language";

export function getItemInfoFromName (itemName) {
    if (itemName)
        return DOTAItems[itemName];
    else
        return null;
}

/// Gets the value of an item's AbilitySpecial array
export function getItemSpecialAbilityValue (itemInfo, specialAbilityValueKey) {
    if (itemInfo && itemInfo.AbilitySpecial) {
        for(let i = 0; i < itemInfo.AbilitySpecial.length; i++) {
            let keys = Object.keys(itemInfo.AbilitySpecial[i]);
            let matchingKey = keys.find(element => {
                return element === specialAbilityValueKey;
            });

            if (matchingKey) {
                let specialAbilityInfo = itemInfo.AbilitySpecial[i];
                return tryParseAbilitySpecialValue(specialAbilityInfo, specialAbilityInfo[matchingKey], 1);
            }
        }
    }
    return null;
}

/// Try Gets a item info and sepcial value from it's item's Ability Special array
export function tryGetItemSpecialValue (item, specialAbilityValueKey) {
    let itemInfo = getItemInfoFromName(item.item);
    if (itemInfo) {
        var specialValue = getItemSpecialAbilityValue(itemInfo, specialAbilityValueKey);
        if (specialValue) {
            return specialValue;
        }
    }
    return null;
}

/// Try Gets a neutral item info and special value from it's items' AbilitySpecial array
export function tryGetNeutralSpecialValue (neutral, specialValueKey) {
    let foundNeutralInfo = getItemInfoFromName(neutral.item);
    if (foundNeutralInfo) {
        var specialValue = getItemSpecialAbilityValue(foundNeutralInfo, specialValueKey);
        if (specialValue) {
            return specialValue;
        }
    }
    return null;
}

/// Gets all normal items in dota
export function getAllItems () {
    let selectableItems = Object.keys(DOTAItems).filter((value) => {
        let key = value.toLowerCase();
        let ability = DOTAItems[value];
        if (key !== "version" && !key.includes("recipe") && !ability.ItemIsNeutralDrop && !ability.IsObsolete) {
            return true;
        }
        return false;
    });

    // Convert keys to item data
    selectableItems = selectableItems.map((key) => {
        return {
            item:  DOTAItems[key],
            name: key,
        };
    })
    selectableItems.sort();

    return selectableItems;
}

/// Returns all neutral items
export function getAllNeutrals() {
     /// Filter out unused or unnecessary keys in items.json
     let selectableNeutrals = Object.keys(DOTAItems).filter((value, index, array) => {
        let key = value.toLowerCase();
        let ability = DOTAItems[value];
        
        // Make sure it's a neutral
        if (ability.ItemIsNeutralDrop === "1") {
            // Filter irrelevant results, ignore any neutral recipes and return full item
            if (key !== "version" && !ability.IsObsolete && !key.includes("recipe")) {
                return true;
            }    
        }
        
        return false;
    });
    selectableNeutrals.sort();

    // Map to an object
    selectableNeutrals = selectableNeutrals.map((key) => {
        let itemKey = key;
        if (itemKey.includes("recipe")) {
            // remove recipe and retrieve item version
            itemKey = itemKey.replace("_recipe", "");
        }

        let itemInfo = DOTAItems[itemKey];
        if (itemInfo.ItemIsNeutralDrop === "1") {
            return {
                item: itemKey,
                itemInfo: itemInfo,
            };
        }
    });

    return selectableNeutrals;
}

/// Gets the correct key inside items.json for the hero's primary attribute
export function primaryAttributeToItemBonusKey(primaryAttr) {
    switch(primaryAttr) {
        case EAttributes.ATTR_STRENGTH:
            return [ "bonus_strength" ];
        case EAttributes.ATTR_AGILITY:
            return [ "bonus_agility" ];
        case EAttributes.ATTR_INTELLIGENCE:
            return [ "bonus_intellect", "bonus_intelligence" ];
        default:
            return null;
    }
}

/// Checks if the items array contains an aghanims scepter
export function itemsContainsScepter (allItems) {
    for (let item of allItems) {
        if (item.item && item.item.includes("ultimate_scepter")) {
            return true;
        }
    }
    return false;
}

/// Replaces a localized string with it's data values found inside AbilitySpecial 
/// or on ItemInfo object
export function replaceStringWithDataValues (string, itemInfo) {
    if (!string) {
        return null;
    }

    let replaceRegex = /(%.*?%)/;
    
    while (string.match(replaceRegex)?.length > 0) {
        let phrase = string.match(replaceRegex)[0];
        if (phrase) {
            let infoKey = phrase.split("%").join("");
            let specialAbilityValue = "?";
            // no characters inbetween, needs to be a normal percentage sign
            if (infoKey === "") {
                /// use ~ for now, replace later
                specialAbilityValue = "~";
            }
            // if is an AbilitySpecial key as all contain a '_' 
            else if (infoKey.includes("_")) {
                specialAbilityValue = getItemSpecialAbilityValue(itemInfo, infoKey);
            }
            // is a key on the main ItemInfo object 
            else {
                specialAbilityValue = tryGetItemInfoValue(itemInfo, infoKey);
            }
            
            string = string.replace(phrase, specialAbilityValue);
        }
    }

    /// replace ! with actual percentage sign
    string = string.replace(/[~]/g, "%");
    
    return string;
}

/// Try Get's a ItemInfo value on the original object from a key
export function tryGetItemInfoValue (itemInfo, itemInfoKey) {
    if (itemInfo) {
        let keys = Object.keys(itemInfo);
        let matchingKey = keys.find(element => {
            return element.toLowerCase() === itemInfoKey.toLowerCase();
        });

        if (matchingKey) {
            let infoValue = itemInfo[matchingKey];
            if (infoValue.includes(".")) {
                return parseFloat(infoValue);
            } else {
                return parseInt(infoValue);
            }
        }
    }
    return null;
}

/// Converts a item description localized string into the correct displayable HTML
export function convertItemDescToHtml(itemDescString, itemName, itemInfo) {
    let dataString = replaceStringWithDataValues(itemDescString, itemInfo);
    if (!dataString) {
        return null;
    }

    /// Get english string to be able to check for "Active:" phrase
    let engDataString = getEngAnilityLocalizedString(`DOTA_Tooltip_ability_${itemName}_Description`);
    let engSplitString = engDataString.split("\\n");

    /// Also split localized string to iterate over
    let localizedSplit = dataString.split("\\n");

    let totalHtmlSections = [];
    for(let i = 0; i < localizedSplit.length; i++) {
        let section = localizedSplit[i];
        let isActive = engSplitString[i].includes("Active:");
        if (isActive) {
            totalHtmlSections.push(
                <div className="my-3 item-active" key={i}>
                    <div
                        className="d-flex justify-content-between align-items-center" 
                        style={{ position: "absolute", right: "1rem" }}>
                        {
                            itemInfo && itemInfo.AbilityManaCost &&
                            <div className="d-flex">
                                <div className="mx-1 my-1 mana-cost-box-icon" />
                                <div>
                                    { parseInt(itemInfo.AbilityManaCost) }
                                </div>
                            </div>
                        }
                        <div className="px-1" />
                        {
                            itemInfo && itemInfo.AbilityCooldown &&
                            <div className="d-flex">
                                <FontAwesomeIcon 
                                    className="mx-1 my-1" 
                                    icon={faClock} />
                                <div>
                                    { parseFloat(itemInfo.AbilityCooldown)  }
                                </div>
                            </div>
                        }
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: section }}>
                    </div>
                </div>
            )
        } else {
            totalHtmlSections.push(
                <div
                    key={i} 
                    className={`my-3 ${itemInfo.ItemQuality === "consumable" ? "item-consumable" : "item-passive"}`} 
                    dangerouslySetInnerHTML={{ __html: section }}>
                </div>
            );
        }
    }

    return totalHtmlSections;
}

/// Gets all bonuses the item provides, returning a key value list
export function getItemStatistics (itemInfo) {
    if (!itemInfo || !itemInfo?.AbilitySpecial) {
        return null;
    }

    let statistics = [];

    for (let i = 0; i < itemInfo.AbilitySpecial.length; i++) {
        let keys = Object.keys(itemInfo.AbilitySpecial[i]);
        for(let key of keys) {
            if (key.includes("bonus") || 
                key.includes("spell") || 
                key.includes("multiplier") || 
                key.includes("regen") || 
                key.includes("resistance") ) {
                let val = tryParseAbilitySpecialValue(itemInfo.AbilitySpecial[i], itemInfo.AbilitySpecial[i][key]);
                statistics.push({
                    key: key,
                    value: val,
                });
            }
        }
    }

    return statistics;
}

/// Checks an ItemInfo Disassemble rule if it matches the given rule
export function isDissassembleRule(itemInfo, eDisassembleRule) {
    if (itemInfo && itemInfo.ItemDisassembleRule) {
        let split = itemInfo.ItemDisassembleRule.split(" | ");
        for(let rule of split) {
            if (rule === eDisassembleRule) {
                return true;
            }
        }
    }
    return false;
}

/// Checks if an item requires charges to function
export function itemRequiresCharges (itemName) {
    let itemInfo = getItemInfoFromName(itemName);
    if (itemInfo) {
        return itemInfo.ItemRequiresCharges === "1";
    }
    return false;
}

/// Checks an item alias from an ItemInfo to see if the phrase is included
export function itemAliasIncludes (itemAlias, includePhrase) {
    if (itemAlias && includePhrase) {
        let split = itemAlias.split(";");
        for (let alias of split) {
            if (alias.toLowerCase().indexOf(includePhrase.toLowerCase()) !== -1) {
                return true;
            }
        }
    }
    return false;
}