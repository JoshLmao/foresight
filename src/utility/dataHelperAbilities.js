// * Helper and utility functions to provide for retrieving data from "npc_abilities.json"
// * 

import { DOTAAbilities } from "../data/dota2/json/npc_abilities.json";
import { 
    EAbilityBehaviour, 
    EDamageType, 
    ESpellImmunityType 
} from "../enums/abilities";

import {
    lang as DOTAEngAbilityStrings
} from "../data/dota2/languages/abilities_english.json";
import { containsLocalizedString } from "./data-helpers/language";

export function getAbilityInfoFromName(abilityName) {
    if (abilityName) {
        return DOTAAbilities[abilityName];
    } else {
        return null;
    }
}

export function tryGetAbilitySpecialAbilityValue (ability, specialValueKey, abilityLevel = 1) {
    let abilityInfo = getAbilityInfoFromName(ability);
    if (abilityInfo) {
        let specialValue = getAbilitySpecialAbilityValue(abilityInfo, specialValueKey, abilityLevel);
        if (specialValue) {
            return specialValue;
        }
    }
    return null;
}

export function getAbilitySpecialAbilityValue(abilityInfo, specialAbilityKey, abilityLevel = 1) {
    if (abilityInfo && abilityInfo.AbilitySpecial) {
        for(let i = 0; i < abilityInfo.AbilitySpecial.length; i++) {
            let keys = Object.keys(abilityInfo.AbilitySpecial[i]);
            let matchingKey = keys.find(element => {
                return element === specialAbilityKey;
            });

            if (matchingKey) {
                let specialAbilityInfo = abilityInfo.AbilitySpecial[i];

                // If value contains a space, it can be levelled up needs to be split up
                let dataValue = specialAbilityInfo[matchingKey];
                if (typeof dataValue === "string" && dataValue.includes(' ')) {
                    let split = specialAbilityInfo[matchingKey].split(' ');
                    dataValue = split[abilityLevel - 1];
                }

                /// If wanting it for it's value, correctly convert and return
                if (matchingKey.includes("value") && specialAbilityInfo.var_type) {
                    if (specialAbilityInfo.var_type === "FIELD_INTEGER") {
                        return parseInt(dataValue);
                    } 
                    else if(specialAbilityInfo.var_type === "FIELD_FLOAT") {
                        return parseFloat(dataValue);
                    }
                } 
                /// else return whatever the value is
                else {
                    return dataValue;
                }
                
            }
        }
    }
}

/// Gets 
export function getAbilitySpecialCastRangeValue (abilityInfo, includePhrase, abilityLevel = 1) {
    if (abilityInfo && abilityInfo.AbilitySpecial) {
        for(let i = 0; i < abilityInfo.AbilitySpecial.length; i++) {
            let keys = Object.keys(abilityInfo.AbilitySpecial[i]);
            let matchingKey = keys.find(element => {
                return element.includes(includePhrase) && !element.includes("scepter");
            });

            if (matchingKey) {
                let specialAbilityInfo = abilityInfo.AbilitySpecial[i];

                /// ignore if scepter 
                if (specialAbilityInfo.RequiresScepter) {
                    return null;
                }

                // If value contains a space, it can be levelled up needs to be split up
                let dataValue = specialAbilityInfo[matchingKey];
                
                /// Return dataValue in format
                return tryParseAbilitySpecialValue(specialAbilityInfo, dataValue, abilityLevel)
            }
        }
    }
}

/// Searches an AbilityInfo's AbilitySpecial array for a property that includes the the "includePhrase"
/// in it's key. For example includePhrase = "charges" would return value of voice spirit's "max_charges"
export function getIncludesAbilitySpecialAbilityValue(abilityInfo, includePhrase, abilityLevel) {
    if (abilityInfo && abilityInfo.AbilitySpecial) {
        for(let i = 0; i < abilityInfo.AbilitySpecial.length; i++) {
            let keys = Object.keys(abilityInfo.AbilitySpecial[i]);
            let matchingKey = keys.find(element => {
                return element.includes(includePhrase);
            });

            if (matchingKey) {
                let specialAbilityInfo = abilityInfo.AbilitySpecial[i];
                let dataValue = specialAbilityInfo[matchingKey];

                /// Return dataValue in format
                return tryParseAbilitySpecialValue(specialAbilityInfo, dataValue, abilityLevel);
            }
        }
    }
    return null;
}

/// Gets the standard output damage of an ability from its level
export function getAbilityOutputDamage(abilityInfo, abilityLevel) {
    let abilityDmg = {
        min: null,
        max: null,
        damage: null,
        isPercent: null,
    };

    if (abilityInfo && abilityLevel) {
        if (abilityInfo.AbilityDamage) {
            let dmgValue = abilityInfo.AbilityDamage.split(' ')[abilityLevel - 1];
            abilityDmg = {
                ...abilityDmg,
                damage: parseFloat(dmgValue),
            };
        }
        else if (abilityInfo.AbilitySpecial) 
        {
            for (let i = 0; i < abilityInfo.AbilitySpecial.length; i++) {
                let specialAbilityElement = abilityInfo.AbilitySpecial[i];
                
                let abilSpecKeys = Object.keys(specialAbilityElement);
                for(let key of abilSpecKeys) {
                    // AbilitySpecial contains damage under a property
                    let lowerKey = key.toLowerCase();
                    
                    // Includes dmg & not scepter
                    if (lowerKey.includes("damage") && !lowerKey.includes("scepter")) 
                    {
                        let value = parseAbilityValueByLevel(specialAbilityElement[key], abilityLevel);
                        let dmgValue = parseFloat(value);

                        if (lowerKey.includes("min")) {
                            //min_damage
                            abilityDmg.min =  dmgValue;
                        }
                        if (lowerKey.includes("max")) {
                            abilityDmg.max = dmgValue;
                        } 
                        if (lowerKey.includes("pct")) {
                            abilityDmg.isPercent = true;
                        }

                        if (!abilityDmg.min && !abilityDmg.max) {
                            abilityDmg.damage = dmgValue;
                        }
                    }

                    // Stop iterate if have min&max or dmg
                    if (abilityDmg.min && abilityDmg.max || abilityDmg.damage) {
                        break;
                    }
                }
            }
        }
    }

    return abilityDmg;
}

/// Gets all behaviour options of an ability such as if it goes through BKB, damage type, etc
export function getAbilityBehaviours(abilityInfo) {
    if (!abilityInfo) {
        return null;
    }

    let behaviours = [];

    if (abilityInfo.AbilityBehavior) {
        let targeting = [];
        let splitBehaviours = abilityInfo.AbilityBehavior.split(' | ');
        for(let b of splitBehaviours) {
            switch(b) {
                case EAbilityBehaviour.UNIT_TARGET:
                    targeting.push("DOTA_ToolTip_Ability_Target");
                    break;
                case EAbilityBehaviour.POINT:
                    targeting.push("DOTA_ToolTip_Ability_Point");
                    break;
                case EAbilityBehaviour.PASSIVE:
                    targeting.push("DOTA_ToolTip_Ability_Passive");
                    break;
                case EAbilityBehaviour.NO_TARGET:
                    targeting.push("DOTA_ToolTip_Ability_NoTarget");
                    break;
            }
        }
    
        behaviours.push({
            key: "DOTA_ToolTip_Ability",
            value: targeting,
        });
    }

    if (abilityInfo.AbilityUnitDamageType) {
        let dmgTypeVal = "";
        let splitDmgTypes = abilityInfo.AbilityUnitDamageType.split(" | ");
        for(let type of splitDmgTypes) {
            switch(type) {
                case EDamageType.MAGICAL:
                    dmgTypeVal = "DOTA_Plus_Death_Screen_MagicalDamage";
                    break;
                case EDamageType.PURE:
                    dmgTypeVal = "DOTA_Plus_Death_Screen_PureDamage";
                    break;
                case EDamageType.PHYSICAL:
                    dmgTypeVal = "DOTA_Plus_Death_Screen_PhysicalDamage";
                    break;
                default:
                    dmgTypeVal = "Not Implemented";
                    break;
            }
        }

        behaviours.push({
            key: "DOTA_ToolTip_Damage",
            value: dmgTypeVal,
        });
    }

    if (abilityInfo.SpellImmunityType) {
        let pierceValue = "";
        switch(abilityInfo.SpellImmunityType) {
            case ESpellImmunityType.YES:
                pierceValue = "DOTA_ToolTip_PiercesSpellImmunity_Yes";
                break;
            case ESpellImmunityType.NO:
                pierceValue = "DOTA_ToolTip_PiercesSpellImmunity_No";
                break;
            default:
                pierceValue = "Unknown";
                break;
        }

        behaviours.push({
            key: "DOTA_ToolTip_PiercesSpellImmunity",
            value: pierceValue,
        });
    }

    return behaviours;
}

/// Parses an AbilitySpecial
export function parseAbilitySpecialValueByLevel (abilitySpecials, key, level = 1) {
    let valuesSplit = abilitySpecials[key].split(' ');
    if (valuesSplit.length > 1) {
        return valuesSplit[level - 1];
    } else {
        return abilitySpecials[key];
    }
}

/// Parses a value in an abilityInfo that could be alone or have multiple values per level
export function parseAbilityValueByLevel (value, level = 1) {
    if (level < 1) {
        return null;
    }
    
    let abilValue = 0;
    if (typeof value === "string") {
        let splitValues = value.split(" ");
        if (splitValues.length > 1) {
            abilValue = splitValues[level - 1];
        } else {
            abilValue = value;
        }

        abilValue = parseFloat(abilValue);
    } else {
        abilValue = value;
    }

    return abilValue;
}

export function isCooldownTalent (talent) {
    return isTalent(talent, "cooldown");
}

export function isDamageTalent (talent) {
    return isTalent(talent, "damage");
}

export function isCastRangeTalent (talent) {
    return isTalent(talent, "cast range");
}

export function isTalent (talent, lowerCasePhrase) {
    let abilityString = DOTAEngAbilityStrings.Tokens["DOTA_Tooltip_ability_" + talent];
    return abilityString && abilityString.toLowerCase().includes(lowerCasePhrase);
}

/// Checks the AbilityBehavior string on an AbilityInfo to
/// see if it contains all EBehaviours in array
export function isAbilityBehaviour (abilityBehaviour, ebehaviours) {
    if (abilityBehaviour) {
        let splitBehaviours = abilityBehaviour.split(' | ');
        
        let contains = splitBehaviours.some((b) => ebehaviours.includes(b));
        return contains;
    }
    return false;
}

/// Gets all AbilitySpecial extra information values with it's translation key 
export function getAbilitySpecialExtraValues (abilityName, abilityInfo, abilityLevel, selectedTalents) {
    if (!abilityInfo || (abilityInfo && !abilityInfo.AbilitySpecial)) {
        return null;
    }

    let abilitySpecials = [];

    for (let specialInfo of abilityInfo.AbilitySpecial) {
        let abilitySpecialKeys = Object.keys(specialInfo);
        for (let key of abilitySpecialKeys) {

            if (key.includes("LinkedSpecialBonus") || key.includes("var_type") || key.includes("RequiresScepter") || key.includes("damage")) {
                continue;
            }

            let translationKey = `DOTA_Tooltip_ability_${abilityName}_${key}`;
            abilitySpecials.push({
                key: translationKey,
                value: tryParseAbilitySpecialValue(specialInfo, specialInfo[key], abilityLevel),
            });
        }
    }

    return abilitySpecials;
}

export function tryParseAbilitySpecialValue (abilSpecialinfo, value, abilityLevel = 1) {
    if (typeof value === "string" && value.includes(' ')) {
        let split = value.split(' ');
        value = split[abilityLevel - 1];
    }

    if (abilSpecialinfo) {
        if (abilSpecialinfo.var_type === "FIELD_INTEGER") {
            return parseInt(value);
        } 
        else if(abilSpecialinfo.var_type === "FIELD_FLOAT") {
            return parseFloat(value);
        }
    }
    return value;
}