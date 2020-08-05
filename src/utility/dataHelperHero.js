// * Helper and utility functions to provide for retrieving data from "npc_heroes.json"
// * 

import { EAttributes } from "../enums/attributes";

import { DOTAHeroes } from "../data/dota2/json/npc_heroes.json";

/// Get the base and per level stats of a heroes primary attribute
export function getPrimaryAttributeStats(heroInfo) {
    if (heroInfo && heroInfo.AttributePrimary) {
        return getSpecificAttributeStats(heroInfo.AttributePrimary, heroInfo);
    } else{
        return null;
    }
}

/// Get the base and per level stats of a specific attribute
export function getSpecificAttributeStats(specificAttribute, heroInfo) {
    var basePrimary = 0;
    var primaryPerLevel = 0;

    switch(specificAttribute) {
        case EAttributes.ATTR_STRENGTH:
            {
                basePrimary = parseInt(heroInfo.AttributeBaseStrength);
                primaryPerLevel = parseFloat(heroInfo.AttributeStrengthGain);
                break;
            }
        case EAttributes.ATTR_AGILITY:
            {
                basePrimary = parseInt(heroInfo.AttributeBaseAgility);
                primaryPerLevel = parseFloat(heroInfo.AttributeAgilityGain);
                break;
            }
        case EAttributes.ATTR_INTELLIGENCE:
            {
                basePrimary = parseInt(heroInfo.AttributeBaseIntelligence);
                primaryPerLevel = parseFloat(heroInfo.AttributeIntelligenceGain);
                break;
            }
        default:
            console.error(`Unable to get attribute stats because of unknown specific attribute '${specificAttribute}'`);
    }
    
    return {
        base: basePrimary,
        perLevel: primaryPerLevel,
    };
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
            if (ability && typeof ability === "string") {
                if (ability !== "generic_hidden" && ability.includes("special_bonus")) {
                    talents.push(ability);
                }
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

/// Gets all hero abilities from a hero info
export function getAllHeroAbilities (heroInfo) {
    var keys = Object.keys(heroInfo);
    var abilities = [];
    for(var i = 0; i < keys.length; i++) {
        if (keys[i].includes("Ability") && !keys[i].includes("AbilityDraft")) {
            var ability = heroInfo[keys[i]];
            if (ability && typeof ability === "string") {
                if (ability !== "generic_hidden" && !ability.includes("special_bonus")) {
                    abilities.push(ability);
                }
            }
        }
    }
    return abilities;
}

/// Returns the base hero information that all heroes are based on
export function getDotaBaseHero () {
    return DOTAHeroes?.npc_dota_hero_base;
}

/// Gets the hero's primary attribute as the EAttribute enum
export function getPrimaryAttribute (hero) {
    switch(hero.AttributePrimary) {
        case EAttributes.ATTR_STRENGTH:
            return EAttributes.ATTR_STRENGTH;
        case EAttributes.ATTR_AGILITY:
            return EAttributes.ATTR_AGILITY;
        case EAttributes.ATTR_INTELLIGENCE:
            return EAttributes.ATTR_INTELLIGENCE;
        default:
            return null;
    }
}