import { 
    getItemInfoFromName,
    getItemSpecialAbilityValue,
} from "./dataHelperItems";

import {
    getAbilityInfoFromName,
    getAbilitySpecialAbilityValue,
} from "./dataHelperAbilities";

import { DOTAHeroes } from "../data/dota2/json/npc_heroes.json";
import { DOTAAbilities } from "../data/dota2/json/npc_abilities.json";

/* Hero gains +0.1 regen per each point of strength
* https://dota2.gamepedia.com/Health_regeneration */
export function calculateHealthRegen(baseStrength, heroLvl = 1, additionalHealthRegen) {
    var hpRegen = (parseInt(baseStrength) * 0.1) * heroLvl;
    if (additionalHealthRegen) {
        hpRegen += parseFloat(additionalHealthRegen);
    }
    return hpRegen.toFixed(2);
}

/* Each point of intelligence increases the hero's mana regeneration by 0.05.
 * https://dota2.gamepedia.com/Mana_regeneration */
export function calculateManaRegen(baseIntelligence, heroLvl = 1, additionalHealthRegen) {
    var manaRegen = (parseInt(baseIntelligence) * 0.05) * heroLvl;
    if (additionalHealthRegen) {
        manaRegen += parseFloat(additionalHealthRegen);
    }
    return manaRegen.toFixed(2);
}

// Calculates the main armor of the hero
export function calculateMainArmor(baseArmor, baseAgility, agiPerLevel, level) {
    // Determine bonus agility from perLevel. Then work out main armor
    var agiPer = (parseFloat(agiPerLevel) * level - 1);
    var mainArmor = parseInt(baseArmor) + ((parseInt(baseAgility) + agiPer) * 0.16);
    // Round to one decimal place
    return mainArmor.toFixed(1);
}

/// Returns the amount of spell amplification as a percentage
export function calculateSpellAmp (talents, items, neutral) {
    var totalSpellAmp = 0;
    
    // Determine if any talents provide spell amp
    if (talents && talents.length > 0) {
        var ampTalent = talents.find(element => element.name.includes("spell_amplify"));
        if (ampTalent) {
            var talentInfo = DOTAAbilities[ampTalent.name];
            if (talentInfo) {
                var spellAmpInfo = talentInfo.AbilitySpecial.find(element => element.value);
                if (spellAmpInfo) {
                    var spellAmpAmt = parseInt(spellAmpInfo.value);
                    totalSpellAmp += spellAmpAmt;

                    //console.log(`Talent ${ampTalent.name} provides ${spellAmpAmt}% spell amp`);
                }
            }
        }
    }

    // Determine if current neutral item provides any spell amplification
    if (neutral) {
        var foundNeutral = getItemInfoFromName(neutral.item);
        if (foundNeutral) {
            var spellAmpAmount = getItemSpecialAbilityValue(foundNeutral, "spell_amp");
            if (spellAmpAmount) {
                totalSpellAmp += spellAmpAmount;
                //console.log(`Neutral ${neutral.item} provides ${spellAmpAmount}% spell amp`);
            }
        }
    }

    /// Determine if any items provide spell amp
    if (items && items.length > 0) {
        for(var i = 0; i < items.length; i++) {
            if (items[i].item) {
                var itemInfo = getItemInfoFromName(items[i].item);
                if (itemInfo) {
                    var spellAmpAmount = getItemSpecialAbilityValue(itemInfo, "spell_amp");
                    if (spellAmpAmount) {
                        totalSpellAmp += spellAmpAmount;
                        //console.log(`Item ${items[i].item} provides ${spellAmpAmt}% spell amp`);
                    }
                }
            }
        }
    }


    return totalSpellAmp;
}

export function calculateStatusResist(items, neutral) {
    var totalStatusResist = 0.0;

    if (items && items.length > 0) {
        for(var i = 0; i < items.length; i++) {
            if (items[i].item) {
                var itemInfo = getItemInfoFromName(items[i].item);
                if (itemInfo) {
                    var statusResistAmount = getItemSpecialAbilityValue(itemInfo, "status_resistance");
                    if (statusResistAmount) {
                        totalStatusResist += statusResistAmount;
                    }
                }
            }
        }
    }

    if (neutral) {
        var neutralInfo = getItemInfoFromName(neutral);
        if (neutralInfo) {
            var statusResistAmount = getItemSpecialAbilityValue(neutralInfo, "status_resistance");
            if (statusResistAmount) {
                totalStatusResist += statusResistAmount;
            }
        }
    }

    return totalStatusResist;
}

export function calculateMagicResist (items, neutral, abilities) {
    // Formula from Wiki
    // Total magic resistance = 1 − ((1 − natural resistance) × (1 − first resistance bonus) × (1 − second resistance bonus) × (1 + first resistance reduction) × (1 + second resistance reduction))
    
    // Array of magic resistance values
    var resistanceBonuses = [ ];
    
    if (DOTAHeroes && DOTAHeroes?.npc_dota_hero_base?.MagicalResistance) {
        var baseResist = parseInt(DOTAHeroes.npc_dota_hero_base.MagicalResistance);
        resistanceBonuses.push(baseResist);
    }

    if (items && items.length > 0) {
        for(var i = 0; i < items.length; i++) {
            var itemInfo = getItemInfoFromName(items[i].item);
            if (itemInfo) {
                var magicResistAmount = getItemSpecialAbilityValue(itemInfo, "bonus_magic_resistance");
                if (magicResistAmount) {
                    resistanceBonuses.push(magicResistAmount);
                }

                magicResistAmount = getItemSpecialAbilityValue(itemInfo, "magic_resistance");
                if (magicResistAmount) {
                    resistanceBonuses.push(magicResistAmount);
                }

                magicResistAmount = getItemSpecialAbilityValue(itemInfo, "bonus_magical_armor");
                if (magicResistAmount) {
                    resistanceBonuses.push(magicResistAmount);
                }
            }
        }
    }

    if (neutral) {
        var neutralInfo = getItemInfoFromName(neutral);
        if (neutralInfo) {
            var magicResistAmount = getItemSpecialAbilityValue(itemInfo, "magic_resistance");
            if (magicResistAmount) {
                resistanceBonuses.push(magicResistAmount);
            }
        }
    }

    if (abilities && abilities.length > 0) { 
        for(var i = 0; i < abilities.length; i++) {
            var abilityInfo = getAbilityInfoFromName(abilities[i]);
            if (abilityInfo) {
                // var magicResistAmount = getAbilitySpecialAbilityValue(abilityInfo, "magic_resistance");
                // if (magicResistAmount) {
                //     resistanceBonuses.push(magicResistAmount);
                // }

                magicResistAmount = getAbilitySpecialAbilityValue(abilityInfo, "bonus_magic_resistance");
                if (magicResistAmount) {
                    resistanceBonuses.push(magicResistAmount);
                }
            }
        }
    }

    // Divide original value into 0.x and minus from 1 to get the reverse
    var edited = []
    for(var i = 0; i < resistanceBonuses.length; i++) {
        edited.push(1 - (resistanceBonuses[i] / 100));
    }

    // multiply them all together 
    var total = edited[0];
    for(var i = 1; i < edited.length; i++) {
        total *= edited[i];
    }

    // then minus from 1, and multiply by 100 to get value as a percentage
    var percent = (1 - total) * 100;
    return percent.toFixed(2);
}

/// Calculates the total magic resistance of the hero
/// https://dota2.gamepedia.com/Magic_resistance
export function calculatePhysicalResist (totalArmor) {
    // Formula from https://www.dotabuff.com/blog/2018-11-30-understanding-720-armor-changes
    //( 0.052 * armor ) ÷ ( 0.9 + 0.048 * |armor|)
    var physResist = (0.052 * totalArmor) / (0.9 + 0.048 * Math.abs(totalArmor));
    var percent = physResist * 100;
    return percent.toFixed(0);
}

/// Calculates evasion
export function calculateEvasion(talents, items) {
    var totalEvasion = 0.0;

    if (talents && talents.length > 0) {
        // todo, any talents providing evasion
    }

    if (items && items.length > 0) {
        for(var i = 0; i < items.length; i++) {
            if (items[i].item) {
                var itemInfo = getItemInfoFromName(items[i].item);
                if (itemInfo) {
                    var evasionAmount = getItemSpecialAbilityValue(itemInfo, "bonus_evasion");
                    if (evasionAmount) {
                        totalEvasion += evasionAmount;
                    }
                }
            }
        }
    }

    return totalEvasion;
}
