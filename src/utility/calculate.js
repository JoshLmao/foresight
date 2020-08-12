import { 
    getItemInfoFromName,
    getItemSpecialAbilityValue,
    tryGetItemSpecialValue,
    tryGetNeutralSpecialValue,
    primaryAttributeToItemBonusKey
} from "./dataHelperItems";

import {
    getAbilityInfoFromName,
    getAbilitySpecialAbilityValue,
    getAbilityOutputDamage,
    tryGetAbilitySpecialAbilityValue,
    parseAbilityValueByLevel

} from "./dataHelperAbilities";

import {
    getTalentInfoFromName,
    tryGetTalentSpecialAbilityValue,
} from "./dataHelperTalents";

import {
    getDotaBaseHero,
    getSpecificAttributeStats,
    getPrimaryAttributeStats,
    getPrimaryAttribute
} from "./dataHelperHero";

import { EAttributes } from "../enums/attributes";

import { DOTAHeroes } from "../data/dota2/json/npc_heroes.json";
import { DOTAAbilities } from "../data/dota2/json/npc_abilities.json";

/// Calculates the health of a hero
/// https://dota2.gamepedia.com/Health
export function calculateHealth(hero, heroLevel, items, neutral, abilities, talents) {
    if (!hero) {
        return "?";
    }
    
    var HEALTH_PER_STRENGTH_POINT = 20;
    let baseStrength = parseInt(hero.AttributeBaseStrength)
    let strengthGain = parseFloat(hero.AttributeStrengthGain);

    var baseHealth = 0;
    if (DOTAHeroes && DOTAHeroes.npc_dota_hero_base && DOTAHeroes.npc_dota_hero_base.StatusHealth) {
        baseHealth = parseInt(DOTAHeroes.npc_dota_hero_base.StatusHealth);
    } else {
        console.error("Can't add baseHealth to heroes health pool");
    }

    var totalStr = baseStrength + (strengthGain * (heroLevel - 1));
    let totalHealth = baseHealth + (totalStr * HEALTH_PER_STRENGTH_POINT);

    if (items && items.length > 0) {
        for(let item of items) {
            let bonusHealth = tryGetItemSpecialValue(item, "bonus_health");
            if (bonusHealth) {
                totalHealth += bonusHealth;
            }

            let bonusStr = tryGetItemSpecialValue(item, "bonus_strength");
            if (bonusStr) {
                totalHealth += bonusStr * HEALTH_PER_STRENGTH_POINT;
            }

            let bonusAllStats = tryGetItemSpecialValue(item, "bonus_all_stats");
            if (bonusAllStats) {
                totalHealth += bonusAllStats * HEALTH_PER_STRENGTH_POINT;
            }
        }
    }

    if (neutral) {
        let bonusHealth = tryGetNeutralSpecialValue(neutral, "bonus_health");
        if (bonusHealth) {
            totalHealth += bonusHealth;
        }

        let bonusStr = tryGetNeutralSpecialValue(neutral, "bonus_strength");
        if (bonusStr) {
            totalHealth += bonusStr * HEALTH_PER_STRENGTH_POINT;
        }

        let bonusAllStats = tryGetNeutralSpecialValue(neutral, "bonus_all_stats");
        if (bonusAllStats) {
            totalHealth += bonusAllStats * HEALTH_PER_STRENGTH_POINT;
        }
    }

    if (abilities && abilities.length > 0) {
        
    }

    if (talents && talents.length > 0) {
        for(let talent of talents) {
            if (talent.includes("bonus_hp")) {
                let bonusHealth = tryGetTalentSpecialAbilityValue(talent, "value");
                if (bonusHealth) {
                    totalHealth += bonusHealth;
                }
            } else if (talent.includes("bonus_strength")) {
                let bonusStr = tryGetTalentSpecialAbilityValue(talent, "value");
                if (bonusStr) {
                    totalHealth += bonusStr * HEALTH_PER_STRENGTH_POINT;
                }
            } else if (talent.includes("bonus_all_stats")) {
                let bonusAllStats = tryGetTalentSpecialAbilityValue(talent, "value");
                if (bonusAllStats) {
                    totalHealth += bonusAllStats * HEALTH_PER_STRENGTH_POINT;
                }
            }
        }
    }

    return totalHealth.toFixed(0);
}

/// Calculates the mana pool of a hero
/// https://dota2.gamepedia.com/Mana
export function calculateMana(hero, heroLevel, items, neutral, abilities, talents) {
    if (!hero) {
        return "?";
    }    

    let MANA_PER_INT_POINT = 12;
    let baseInt = parseInt(hero.AttributeBaseIntelligence);
    let intGain = parseFloat(hero.AttributeIntelligenceGain);

    var baseMana = 0;
    if (DOTAHeroes && DOTAHeroes.npc_dota_hero_base && DOTAHeroes.npc_dota_hero_base.StatusMana) {
        baseMana = parseInt(DOTAHeroes.npc_dota_hero_base.StatusMana);
    } else {
        console.error("Can't add baseMana to heroes mana pool");
    }

    var totalInt = baseInt + (intGain * (heroLevel - 1));
    let totalMana = baseMana + (totalInt * MANA_PER_INT_POINT);

    if (items && items.length > 0) {
        for(let item of items) {
            let bonusMana = tryGetItemSpecialValue(item, "bonus_mana");
            if (bonusMana) {
                totalMana += bonusMana;
            }

            let bonusInt = tryGetItemSpecialValue(item, "bonus_intellect");
            if (bonusInt) {
                totalMana += bonusInt * MANA_PER_INT_POINT;
            }

            let bonusAllStats = tryGetItemSpecialValue(item, "bonus_all_stats");
            if (bonusAllStats) {
                totalMana += bonusAllStats * MANA_PER_INT_POINT;
            }
        }
    }
    
    if (neutral) {
        let bonusMana = tryGetNeutralSpecialValue(neutral, "bonus_mana");
        if (bonusMana) {
            totalMana += bonusMana;
        }

        let bonusInt = tryGetNeutralSpecialValue(neutral, "bonus_intellect");
        if (bonusInt) {
            totalMana += bonusInt * MANA_PER_INT_POINT;
        }

        let bonusAllStats = tryGetNeutralSpecialValue(neutral, "bonus_all_stats");
        if (bonusAllStats) {
            totalMana += bonusAllStats * MANA_PER_INT_POINT;
        }
    }

    if (abilities && abilities.length > 0) {
        for(let ability of abilities) {
            let bonusMana = tryGetAbilitySpecialAbilityValue(ability, "bonus_mana");
            if (bonusMana) {
                totalMana += bonusMana;
            }

            let bonusInt = tryGetAbilitySpecialAbilityValue(ability, "bonus_intellect");
            if (bonusInt) {
                totalMana += bonusInt * MANA_PER_INT_POINT;
            }

            let bonusAllStats = tryGetAbilitySpecialAbilityValue(ability, "bonus_all_stats");
            if (bonusAllStats) {
                totalMana += bonusAllStats * MANA_PER_INT_POINT;
            }
        }
    }

    if (talents && talents.length > 0) {
        for(let talent of talents) {
            if (talent.includes("bonus_mp")) {
                let bonusMana = tryGetTalentSpecialAbilityValue(talent, "value");
                if (bonusMana) {
                    totalMana += bonusMana;
                }
            } else if (talent.includes("bonus_intelligence")) {
                let bonusInt = tryGetTalentSpecialAbilityValue(talent, "value");
                if (bonusInt) {
                    totalMana += bonusInt * MANA_PER_INT_POINT;
                }
            } else if (talent.includes("bonus_all_stats")) {
                let bonusAllStats = tryGetTalentSpecialAbilityValue(talent, "value");
                if (bonusAllStats) {
                    totalMana += bonusAllStats * MANA_PER_INT_POINT;
                }
            }
        }
    }

    return totalMana.toFixed(0);
}

/* Hero gains +0.1 regen per each point of strength
* https://dota2.gamepedia.com/Health_regeneration */
export function calculateHealthRegen(hero, heroLevel, items, neutral, abilities, talents) {
    if(!hero) {
        return "?";
    }

    let HP_REGEN_PER_STRENGTH = 0.1;
    let baseStr = parseInt(hero.AttributeBaseStrength);
    let strPerLvl = parseFloat(hero.AttributeStrengthGain);

    let totalHpRegen = (baseStr + (strPerLvl * (heroLevel - 1))) * HP_REGEN_PER_STRENGTH;
    if (hero.StatusHealthRegen) {
        totalHpRegen += parseFloat(hero.StatusHealthRegen);
    }

    if (items && items.length > 0) {
        for(let item of items) {
            let regenAmt = tryGetItemSpecialValue(item, "bonus_health_regen");
            if (regenAmt) {
                totalHpRegen += regenAmt;
            }

            let bonusStr = tryGetItemSpecialValue(item, "bonus_strength");
            if(bonusStr) {
                totalHpRegen += bonusStr * HP_REGEN_PER_STRENGTH;
            }

            let bonusAllStats = tryGetItemSpecialValue(item, "bonus_all_stats");
            if (bonusAllStats) {
                totalHpRegen += bonusAllStats * HP_REGEN_PER_STRENGTH;
            }
        }
    }

    if (neutral) {
        let bonusHealthRegen = tryGetNeutralSpecialValue(neutral, "bonus_health_regen");
        if (bonusHealthRegen) {
            totalHpRegen += bonusHealthRegen;
        }

        let bonusStr = tryGetNeutralSpecialValue(neutral, "bonus_strength");
        if (bonusStr) {
            totalHpRegen += bonusStr * HP_REGEN_PER_STRENGTH;
        }
        
        let bonusAllStats = tryGetNeutralSpecialValue(neutral, "bonus_all_stats");
        if (bonusAllStats) {
            totalHpRegen += bonusAllStats * HP_REGEN_PER_STRENGTH;
        }
    } 

    if (abilities && abilities.length > 0) {
        for (let ability of abilities) {
            let bonusRegen = tryGetAbilitySpecialAbilityValue(ability, "bonus_health_regen", 1);
            if (bonusRegen) {
                totalHpRegen += bonusRegen;
            }
        }
    }

    if (talents && talents.length > 0) {
        for (let talent of talents) {
            // Only get bonus_hp_regen talents
            if (talent.includes("bonus_hp_regen")) {
                let bonusRegen = tryGetTalentSpecialAbilityValue(talent, "value");
                if (bonusRegen) {
                    totalHpRegen += bonusRegen;
                }
            } else if(talent.includes("bonus_strength")) {
                let bonusStr = tryGetTalentSpecialAbilityValue(talent, "value");
                if (bonusStr) {
                    totalHpRegen += bonusStr * HP_REGEN_PER_STRENGTH;
                }
            } else if (talent.includes("bonus_all_stats")) {
                let bonusAllStats = tryGetTalentSpecialAbilityValue(talent, "value");
                if (bonusAllStats) {
                    totalHpRegen += bonusAllStats * HP_REGEN_PER_STRENGTH;
                }
            }
        }
    }

    return totalHpRegen.toFixed(1);
}

/* Each point of intelligence increases the hero's mana regeneration by 0.05.
 * https://dota2.gamepedia.com/Mana_regeneration */
export function calculateManaRegen(hero, heroLevel, items, neutral, abilities, talents) {
    if(!hero) {
        return "?";
    }
    let MANA_REGEN_PER_INT = 0.05;
    let baseInt = parseInt(hero.AttributeBaseIntelligence);
    let intGain = parseFloat(hero.AttributeIntelligenceGain);

    let totalManaRegen = (baseInt + (intGain * (heroLevel - 1))) * MANA_REGEN_PER_INT;
    if (hero.StatusManaRegen) {
        totalManaRegen += parseFloat(hero.StatusManaRegen);
    }

    if(items && items.length > 0) {
        for(let item of items) {
            let bonusManaRegen = tryGetItemSpecialValue(item, "bonus_mana_regen");
            if (bonusManaRegen) {
                totalManaRegen += bonusManaRegen;
            }

            let bonusInt = tryGetItemSpecialValue(item, "bonus_intelligence");
            if(bonusInt) {
                let regen = bonusInt * MANA_REGEN_PER_INT; 
                totalManaRegen += regen;
            }

            let bonusIntellect = tryGetItemSpecialValue(item, "bonus_intellect");
            if (bonusIntellect) {
                let regen = bonusIntellect * MANA_REGEN_PER_INT; 
                totalManaRegen += regen;
            }

            let bonusAllStats = tryGetItemSpecialValue(item, "bonus_all_stats");
            if (bonusAllStats) {
                totalManaRegen += bonusAllStats * MANA_REGEN_PER_INT;
            }
        }
    }

    if (neutral) {
        let bonusInt = tryGetNeutralSpecialValue(neutral, "bonus_intelligence");
        if (bonusInt) {
            let manaRegen = bonusInt * MANA_REGEN_PER_INT;
            totalManaRegen += manaRegen;
        }

        let bonusIntellect = tryGetNeutralSpecialValue(neutral, "bonus_intellect");
        if (bonusIntellect) {
            let regen = bonusIntellect * MANA_REGEN_PER_INT; 
            totalManaRegen += regen;
        }

        let bonusAllStats = tryGetNeutralSpecialValue(neutral, "bonus_all_stats");
        if (bonusAllStats) {
            totalManaRegen += bonusAllStats * MANA_REGEN_PER_INT;
        }
    }

    if(abilities && abilities.length > 0) {
        for (let ability of abilities) {
            let manaRegen = tryGetAbilitySpecialAbilityValue(ability, "mana_regen", 1);
            if (manaRegen) {
                totalManaRegen += manaRegen;
            }
        }
    }

    if (talents && talents.length > 0) {
        for(let talent of talents) {
            // Only includes bonus mana point regen talents
            if(talent.includes("bonus_mp_regen")) {
                let value = tryGetTalentSpecialAbilityValue(talent, "value");
                if (value) {
                    totalManaRegen += parseFloat(value);
                }
            } else if (talent.includes("bonus_intelligence")) {
                let bonusAllStats = tryGetTalentSpecialAbilityValue(talent, "value");
                if (bonusAllStats) {
                    totalManaRegen += bonusAllStats * MANA_REGEN_PER_INT;
                }
            } else if (talent.includes("bonus_all_stats")) {
                let bonusAllStats = tryGetTalentSpecialAbilityValue(talent, "value");
                if (bonusAllStats) {
                    totalManaRegen += bonusAllStats * MANA_REGEN_PER_INT;
                }
            }
        }
    }

    return totalManaRegen.toFixed(1);
}

// Calculates the main armor of the hero
// Each point of agility increases a hero's armor by 0.167 (1/6) https://dota2.gamepedia.com/Armor
export function calculateMainArmor(hero, level, items, neutral, abilities, talents) {
    if (!hero) {
        return "?";
    }

    let ARMOR_PER_AGI = 0.167;
    let baseArmor = hero.ArmorPhysical;
    let baseAgility = hero.AttributeBaseAgility;
    let agiPerLevel = hero.AttributeAgilityGain;

    // Determine bonus agility from perLevel. Then work out main armor
    var agiPer = (parseFloat(agiPerLevel) * (level - 1));
    var totalArmor = parseInt(baseArmor) + ((parseInt(baseAgility) + agiPer) * ARMOR_PER_AGI);
    
    if (items && items.length > 0) {
        for(let item of items) {
            let bonusArmor = tryGetItemSpecialValue(item, "bonus_armor");
            if (bonusArmor) {
                totalArmor += bonusArmor;
            }

            let bonusAgility = tryGetItemSpecialValue(item, "bonus_agility");
            if (bonusAgility) {
                let armor = bonusAgility * ARMOR_PER_AGI;
                totalArmor += armor;
            }

            let bonusAllStats = tryGetItemSpecialValue(item, "bonus_all_stats");
            if (bonusAllStats) {
                let armor = bonusAllStats * ARMOR_PER_AGI;
                totalArmor += armor;
            }
        }
    }
    
    if(neutral) {
        let bonusArmor = tryGetNeutralSpecialValue(neutral, "bonus_armor");
        if (bonusArmor) {
            totalArmor += bonusArmor;
        }

        let bonusAgi = tryGetNeutralSpecialValue(neutral, "bonus_agility");
        if (bonusAgi) {
            totalArmor += bonusAgi * ARMOR_PER_AGI;
        }

        let bonusAllStats = tryGetNeutralSpecialValue(neutral, "bonus_all_stats");
        if (bonusAllStats) {
            let armor = bonusAllStats * ARMOR_PER_AGI;
            totalArmor += armor;
        }
    }

    if (abilities && abilities.length > 0) {
        for(let ability of abilities) {
            let bonusArmor = tryGetAbilitySpecialAbilityValue(ability, "bonus_armor");
            if (bonusArmor) {
                totalArmor += bonusArmor;
            }
        }
    }

    if(talents && talents.length > 0) {
        for(let talent of talents) {
            if (talent.includes("bonus_armor")) {
                let bonusArmor = tryGetTalentSpecialAbilityValue(talent, "value");
                if (bonusArmor) {
                    totalArmor += bonusArmor;
                }
            } else if (talent.includes("bonus_agility")) {
                let bonusAgility = tryGetTalentSpecialAbilityValue(talent, "value");
                if (bonusAgility) {
                    totalArmor += bonusAgility * ARMOR_PER_AGI;
                }
            } else if (talent.includes("bonus_all_stats")) {
                let bonusAllStats = tryGetTalentSpecialAbilityValue(talent, "value");
                if (bonusAllStats) {
                    totalArmor += bonusAllStats * ARMOR_PER_AGI;
                }
            }
        }
    }

    // Round to one decimal place
    return totalArmor.toFixed(1);
}

/// Returns the total amount of spell amplification as a percentage applied to the hero
export function calculateTotalSpellAmp (talents, items, neutral) {
    let totalSpellAmp = 0;
    
    // Determine if any talents provide spell amp
    if (talents && talents.length > 0) {
        let ampTalent = talents.find(element => element.includes("spell_amplify"));
        if (ampTalent) {
            let talentInfo = DOTAAbilities[ampTalent.name];
            if (talentInfo) {
                let spellAmpInfo = talentInfo.AbilitySpecial.find(element => element.value);
                if (spellAmpInfo) {
                    let spellAmpAmt = parseInt(spellAmpInfo.value);
                    totalSpellAmp += spellAmpAmt;

                    //console.log(`Talent ${ampTalent.name} provides ${spellAmpAmt}% spell amp`);
                }
            }
        }
    }

    // Determine if current neutral item provides any spell amplification
    if (neutral) {
        let foundNeutral = getItemInfoFromName(neutral.item);
        if (foundNeutral) {
            let spellAmpAmount = getItemSpecialAbilityValue(foundNeutral, "spell_amp");
            if (spellAmpAmount) {
                totalSpellAmp += spellAmpAmount;
                //console.log(`Neutral ${neutral.item} provides ${spellAmpAmount}% spell amp`);
            }
        }
    }

    /// Determine if any items provide spell amp
    if (items && items.length > 0) {
        for(let i = 0; i < items.length; i++) {
            if (items[i].item) {
                let itemInfo = getItemInfoFromName(items[i].item);
                if (itemInfo) {
                    let spellAmpAmount = getItemSpecialAbilityValue(itemInfo, "spell_amp");
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
    let totalStatusResist = 0.0;

    if (items && items.length > 0) {
        for(let i = 0; i < items.length; i++) {
            if (items[i].item) {
                let itemInfo = getItemInfoFromName(items[i].item);
                if (itemInfo) {
                    let statusResistAmount = getItemSpecialAbilityValue(itemInfo, "status_resistance");
                    if (statusResistAmount) {
                        totalStatusResist += statusResistAmount;
                    }
                }
            }
        }
    }

    if (neutral) {
        let statusResistAmount = tryGetNeutralSpecialValue(neutral, "status_resistance");
        if (statusResistAmount) {
            totalStatusResist += statusResistAmount;
        }
    }

    return totalStatusResist;
}

export function calculateMagicResist (items, neutral, abilities) {
    // Formula from Wiki
    // Total magic resistance = 1 − ((1 − natural resistance) × (1 − first resistance bonus) × (1 − second resistance bonus) × (1 + first resistance reduction) × (1 + second resistance reduction))
    
    // Array of magic resistance values
    let resistanceBonuses = [ ];
    
    if (DOTAHeroes && DOTAHeroes?.npc_dota_hero_base?.MagicalResistance) {
        let baseResist = parseInt(DOTAHeroes.npc_dota_hero_base.MagicalResistance);
        resistanceBonuses.push(baseResist);
    }

    if (items && items.length > 0) {
        for(let i = 0; i < items.length; i++) {
            let itemInfo = getItemInfoFromName(items[i].item);
            if (itemInfo) {
                let magicResistAmount = getItemSpecialAbilityValue(itemInfo, "bonus_magic_resistance");
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
        let magicResistAmount = tryGetNeutralSpecialValue(neutral, "magic_resistance");
        if (magicResistAmount) {
            resistanceBonuses.push(magicResistAmount);
        }
    }

    if (abilities && abilities.length > 0) { 
        for(let ability of abilities) {
            // let magicResistAmount = tryGetAbilitySpecialAbilityValue(ability, "magic_resistance");
            // if (magicResistAmount) {
            //     resistanceBonuses.push(magicResistAmount);
            // }
            
            let magicResistAmount = tryGetAbilitySpecialAbilityValue(ability, "bonus_magic_resistance");
            if (magicResistAmount) {
                resistanceBonuses.push(magicResistAmount);
            }
        }
    }

    // Divide original value into 0.x and minus from 1 to get the reverse
    let edited = []
    for(let i = 0; i < resistanceBonuses.length; i++) {
        edited.push(1 - (resistanceBonuses[i] / 100));
    }

    // multiply them all together 
    let total = edited[0];
    for(let i = 1; i < edited.length; i++) {
        total *= edited[i];
    }

    // then minus from 1, and multiply by 100 to get value as a percentage
    let percent = (1 - total) * 100;
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
export function calculateEvasion(items, neutral, abilities, talents) {
    var totalEvasion = 0.0;

    if (abilities && abilities.length > 0) {
        for(let ability of abilities) {
            let bonusEvasion = tryGetAbilitySpecialAbilityValue(ability, "bonus_evasion");
            if (bonusEvasion) {
                totalEvasion += bonusEvasion;
            }
        }
    }

    if (talents && talents.length > 0) {
        for(let talent of talents) {
            if (talent.includes("bonus_evasion")) {
                let bonusEvasion = tryGetTalentSpecialAbilityValue(talent, "value");
                if (bonusEvasion) {
                    totalEvasion += bonusEvasion;
                }
            }
        }
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

/// Returns the minimum and maximum right click damage of a hero
// atkMin, atkMax, primaryAttributeStats, heroLevel = 1
export function calculateRightClickDamage(hero, level, items, neutral, abilities, talents) {
    if (!hero) {
        return "?";
    }
    
    let heroMainAttribute = getPrimaryAttribute(hero);
    let atkMin = parseInt(hero.AttackDamageMin);
    let atkMax = parseInt(hero.AttackDamageMax);
    let primaryAttributeStats = getPrimaryAttributeStats(hero);

    // Work out how much bonus attack hero recieves from their primary attribute
    let totalPrimaryAttribute = primaryAttributeStats.base + (primaryAttributeStats.perLevel * (level - 1));
    
    /* Iterate over all items, neutral, abilities and talents to
        get all primary attribute and all stat bonuses
        */
    if (items && items.length > 0) {
        for(let item of items) {
            let allAttrKeys = primaryAttributeToItemBonusKey(heroMainAttribute);
            for(let key of allAttrKeys) {
                let bonusPrimaryAttr = tryGetItemSpecialValue(item, key);
                if (bonusPrimaryAttr) {
                    totalPrimaryAttribute += bonusPrimaryAttr;
                }
            }

            let bonusPrimaryStat = tryGetItemSpecialValue(item, "bonus_primary_stat");
            if (bonusPrimaryStat) {
                totalPrimaryAttribute += bonusPrimaryStat;
            }

            let bonusAllStats = tryGetItemSpecialValue(item, "bonus_all_stats");
            if (bonusAllStats) {
                totalPrimaryAttribute += bonusAllStats;
            }
        }
    }

    if (neutral) {
        let allAttrKeys = primaryAttributeToItemBonusKey(heroMainAttribute);
        for(let key of allAttrKeys) {
            let bonusPrimaryAttr = tryGetNeutralSpecialValue(neutral, key);
            if (bonusPrimaryAttr) {
                totalPrimaryAttribute += bonusPrimaryAttr;
            }
        }

        let bonusPrimaryStat = tryGetNeutralSpecialValue(neutral, "primary_stat");
        if (bonusPrimaryStat) {
            totalPrimaryAttribute += bonusPrimaryStat;
        }
    }

    if (talents && talents.length > 0) {
        for(let talent of talents) {
            let allAttrKeys = primaryAttributeToItemBonusKey(heroMainAttribute);
            for(let key of allAttrKeys) {
                if (talent.includes(key)) {
                    let bonusPrimaryAttr = tryGetNeutralSpecialValue(talent, "value");
                    if (bonusPrimaryAttr) {
                        totalPrimaryAttribute += bonusPrimaryAttr;
                    }
                }
            }
            
            if (talent.includes("bonus_all_stats")) {
                let allStats = tryGetNeutralSpecialValue(talent, "value");
                if (allStats) {
                    totalPrimaryAttribute += allStats;
                }
            }
        }
    }

    // Add and return
    let min = atkMin + totalPrimaryAttribute;
    let max = atkMax + totalPrimaryAttribute;
    return {
        /// minimum attack damage of the hero
        min: Math.floor(min).toFixed(0),
        /// maximum attack damage of the hero
        max: Math.floor(max).toFixed(0),
    };
}

/// Returns info on the attack time of the hero
export function calculateAttackTime(hero, level, items, neutral, abilities, talents) {
    if (!hero) {
        return "?";
    }
    
    let MAX_ATTACK_SPEED = 700;

    // Check if hero has different attack rate or attack speed than base hero
    let totalAttackSpeed = parseInt(getDotaBaseHero()?.BaseAttackSpeed);

    /// Get base agi stats
    let agiStats = getSpecificAttributeStats(EAttributes.ATTR_AGILITY, hero);
    let baseAgi = agiStats.base;
    let agiPerLevel = agiStats.perLevel;

    let totalAgi = baseAgi + (agiPerLevel * (level - 1));

    if (items && items.length > 0) {
        for(let item of items) {
            let bonusAttackSpeed = tryGetItemSpecialValue(item, "bonus_attack_speed");
            if (bonusAttackSpeed) {
                totalAttackSpeed += bonusAttackSpeed;
            }

            let bonusAgility = tryGetItemSpecialValue(item, "bonus_agility");
            if (bonusAgility) {
                totalAgi += bonusAgility;
            }

            let bonusAllStats = tryGetItemSpecialValue(item, "bonus_all_stats");
            if (bonusAllStats) {
                totalAgi += bonusAllStats;
            }
        }
    }

    if (neutral) {
        let bonusAttackSpeed = tryGetNeutralSpecialValue(neutral, "bonus_attack_speed");
        if (bonusAttackSpeed) {
            totalAttackSpeed += bonusAttackSpeed;
        }
    }

    // Only actives that gives attack speed bonuses
    // if (abilities && abilities.length > 0) {
    // }

    if (talents && talents.length > 0) {
        for(let talent of talents) {
            let bonusAttackSpeed = tryGetTalentSpecialAbilityValue(talent, "bonus_attack_speed");
            if (bonusAttackSpeed) {
                totalAttackSpeed += bonusAttackSpeed;
            }

            let bonusAgility = tryGetTalentSpecialAbilityValue(talent, "bonus_agility");
            if (bonusAgility) {
                totalAgi += bonusAgility;
            }

            let bonusAllStats = tryGetTalentSpecialAbilityValue(talent, "bonus_all_stats");
            if (bonusAllStats) {
                totalAgi += bonusAllStats;
            }
        }
    }

    /// Check that max atk speed hasn't been reached
    if ((totalAttackSpeed + totalAgi) > MAX_ATTACK_SPEED) {
        // Use totalAttackSpeed at max if so, reset agi since 1 agi = 1 atk speed
        totalAttackSpeed = MAX_ATTACK_SPEED;
        totalAgi = 0;
    }

    let attacksPerSec = ((totalAttackSpeed + totalAgi) * 0.01) / 1.7;
    let attackTime = 1.7 / ((totalAttackSpeed + totalAgi) * 0.01);
    attackTime = 1 / attacksPerSec;

    let atkSpeed = totalAttackSpeed + totalAgi;

    return {
        /// Amount of seconds inbetween attacks
        attackTime: attackTime.toFixed(2),
        /// Amount of attacks per second
        attacksPerSecond: attacksPerSec.toFixed(2),
        /// Attack speed value shown in UI of dota
        attackSpeed: atkSpeed.toFixed(0),
    };
}

/// Calculates how much output damage an ability will do to an enemy, factoring in any items
export function calculateSpellDamage(abilityInfo, abilityLevel, items, neutral, talents) {
    if (!abilityLevel || !abilityInfo) {
        return -1;
    }

    // Get normal dmg output of ability
    let abilityDamageInfo = getAbilityOutputDamage(abilityInfo, abilityLevel);
    
    // Add up spellAmp from all bonuses to calculate at end
    let totalSpellAmpPercent = 0;

    if (items) {
        // Add item spell damage increase
        for(let i = 0; i < items.length; i++) {
            var itemInfo = getItemInfoFromName(items[i].item);
            if (itemInfo) {
                let spellAmp = getItemSpecialAbilityValue(itemInfo, "spell_amp");
                if (spellAmp) {
                    totalSpellAmpPercent += spellAmp;
                }

                let bonusSpellAmp = getItemSpecialAbilityValue(itemInfo, "bonus_spell_amp");
                if (bonusSpellAmp) {
                    totalSpellAmpPercent += bonusSpellAmp;
                }

                // Bloodstone, item specific
                let chargeCount = getItemSpecialAbilityValue(itemInfo, "initial_charges_tooltip");
                let ampPerCharge = getItemSpecialAbilityValue(itemInfo, "amp_per_charge");
                if (ampPerCharge && chargeCount) {
                    totalSpellAmpPercent += (ampPerCharge * chargeCount);
                }
            }
        }
    }

    if (neutral) {
        //Add neutral item spell dmg
        var neutralInfo = getItemInfoFromName(neutral.item);
        if (neutralInfo && neutralInfo.AbilitySpecial) {
            for (let i = 0; i < neutralInfo.AbilitySpecial.length; i++) {
                let special = neutralInfo.AbilitySpecial[i];
                // Spell amp
                if (special.bonus_spell_amp) {
                    let bonusSpellAmp = parseInt(special.bonus_spell_amp);
                    totalSpellAmpPercent += bonusSpellAmp; 
                }

                if (special.spell_amp) {
                    let bonusSpellAmp = parseInt(special.spell_amp);
                    totalSpellAmpPercent += bonusSpellAmp;
                }
            }
        }
    }

    if (talents && talents.length > 0) {
        // Add spell amplify from any selected talents
        for(let talent of talents) {
            if (talent.includes("spell_amplify")) {
                let ampTalentValue = tryGetTalentSpecialAbilityValue(talent, "value");
                if (ampTalentValue) {
                    totalSpellAmpPercent += ampTalentValue;

                }
            }
        }
    }
    
    let abilityDamage = calculateSpellAmp(abilityDamageInfo.damage, totalSpellAmpPercent);
    return {
        damage: abilityDamage === 0 ? null : abilityDamage,
        isPercent: abilityDamageInfo.isPercent,
    };
}

/// Calculates and applies spell amp to the spell damage and returns the result
export function calculateSpellAmp (spellDamage, spellAmpPercent) {
    return spellDamage + ((spellDamage / 100) * spellAmpPercent);
}

/// Calculates ability mana cost with items, neutrals and talents that contain reductions
export function calculateManaCost(abilityInfo, abilityLevel, items, neutral, talents) {
    if (abilityLevel <= 0) {
        return null;
    }
    
    let manaCost = null;

    // Get inital mana cost amount
    if (abilityInfo && abilityInfo.AbilityManaCost) {
        manaCost = parseAbilityValueByLevel(abilityInfo.AbilityManaCost, abilityLevel);
    }

    // Determine mana reductions from items, neutral, talents
    // Take all percentages and calculate at end
    let totalManaCostReducePercent = 0;

    if (items) {
        for(let item of items) {
            var itemInfo = getItemInfoFromName(item.item);
            if(itemInfo) {
                var manaCostReduceAmount = getItemSpecialAbilityValue(itemInfo, "manacost_reduction");
                if(manaCostReduceAmount) {
                    totalManaCostReducePercent += manaCostReduceAmount;
                }
            }
        }
    }

    if (neutral) {
        let neutralInfo = getItemInfoFromName(neutral.item);
        if (neutralInfo) {
            let costReductionAmount = getItemSpecialAbilityValue(neutralInfo, "manacost_reduction");
            if (costReductionAmount) {
                totalManaCostReducePercent += costReductionAmount;
            }
        }
    }

    if (talents) {
        for(let talent of talents) {
            // Only apply mana reducing talents
            if (talent.includes("mana_reduction")) {
                let reduceAmount = tryGetTalentSpecialAbilityValue(talent, "value");
                if (reduceAmount) {
                    totalManaCostReducePercent += reduceAmount;
                }
            }
        }
    }

    // If ability has a mana value and has mana reductions
    if (manaCost && totalManaCostReducePercent > 0) {
        let removeManaAmt = (manaCost / 100) * totalManaCostReducePercent;
        manaCost -= removeManaAmt;
    }

    return manaCost;
}

/// Calculates ability cooldown with items, neutrals, talents and abilities
/// https://liquipedia.net/dota2/Cooldown_Reduction
export function calculateAbilityCooldown(abilityInfo, abilityLevel, items, neutral, talents) {
    if (abilityLevel <= 0) {
        return null;
    }
    
    let cooldown = null;
    
    if (abilityInfo && abilityInfo.AbilityCooldown) {
        cooldown = parseAbilityValueByLevel(abilityInfo.AbilityCooldown, abilityLevel);
    }

    let allReductions = [];
    if (items) {
        for (let item of items) {
            if (item && item.item) {
                var itemInfo = getItemInfoFromName(item.item);
                if (itemInfo) {
                    var bonusCooldown = getItemSpecialAbilityValue(itemInfo, "bonus_cooldown");
                    if (bonusCooldown) {
                        allReductions.push({ amount: bonusCooldown, source: item.item });
                    }
                }
            }
        }
    }

    if (neutral) {
        let neutralInfo = getItemInfoFromName(neutral.item);
        if (neutralInfo) {
            let bonusCooldown = getItemSpecialAbilityValue(neutralInfo, "bonus_cooldown");
            if (bonusCooldown) {
                allReductions.push({ amount: bonusCooldown, source: neutral });
            } 
        }
    }

    if (talents) {
        for(let talent of talents) {
            // Ignore talent if it isn't a cd reduction one
            if (talent.includes("cooldown_reduction")) {
                let reduction = tryGetTalentSpecialAbilityValue(talent, "value");
                if (reduction) {
                    allReductions.push({ amount: reduction, source: talent });
                }
            }
        }
    }


    let sourceOfReductions = [];
    for(let reduction of allReductions) {
        let decimal = reduction.amount / 100;
        sourceOfReductions.push((1 - decimal));
    }

    let reductionTotal = cooldown;
    for(let reduce of sourceOfReductions) {
        reductionTotal *= reduce;
    }

    return reductionTotal.toFixed(2);
}

/// Calculates the movement speed of the hero, factoring in their items, neutral, abilities and talents
export function calculateMoveSpeed (hero, items, neutral, abilities, talents) {
    if (!hero) {
        return "?";
    }

    let baseSpeed = parseInt(hero.MovementSpeed);
    let flatBonus = 0;
    let percentageBasedBonuses = 0;

    if (items && items.length > 0) {
        for (let item of items) {
            let moveSpeed = tryGetItemSpecialValue(item, "bonus_movement_speed");
            if (moveSpeed) {
                flatBonus += moveSpeed;
            }

            let moveSpeedPercentBonus = tryGetItemSpecialValue(item, "movement_speed_percent_bonus");
            if (moveSpeedPercentBonus) {
                percentageBasedBonuses += moveSpeedPercentBonus;
            }
        }
    }

    if (neutral) {
        let bonusMoveSpeed = tryGetNeutralSpecialValue(neutral, "bonus_movement_speed");
        if (bonusMoveSpeed) {
            flatBonus += bonusMoveSpeed;
        }

        let moveSpeedPercentBonus = tryGetNeutralSpecialValue(neutral, "movement_speed_percent_bonus");
        if (moveSpeedPercentBonus) {
            percentageBasedBonuses += moveSpeedPercentBonus;
        }
    }

    /// Abilities are actives so dont include since no way in UI to activate an ability yet
    // if (abilities && abilities.length > 0) {
    //     for(let ability of abilities) {
    //         let bonusMoveSpeed = tryGetAbilitySpecialAbilityValue(ability, "bonus_movespeed");
    //         if (bonusMoveSpeed) {
    //             flatBonus += bonusMoveSpeed;
    //         }
    //     }
    // }

    if (talents && talents.length > 0) {
        for(let talent of talents) {
            if (talent.includes("bonus_movement_speed")) {
                let bonusSpeed = tryGetTalentSpecialAbilityValue(talent, "value");
                if (bonusSpeed) {
                    flatBonus += bonusSpeed;
                }
            }
        }
    }

    let total = baseSpeed + flatBonus;
    return total;
}

export function calculateAttackRange (hero, level, items, neutral, abilities, talents) {
    if (!hero) {
        return "?";
    }

    let isHeroRanged = hero.AttackCapabilities === "DOTA_UNIT_CAP_RANGED_ATTACK";

    let baseRange = parseInt(hero.AttackRange);
    let totalAttackRange = baseRange;

    // Dont add bonuses if hero isn't ranged
    if (isHeroRanged) {
        if (items && items.length > 0) {
            for(let item of items) {
                let baseRange = tryGetItemSpecialValue(item, "base_attack_range");
                if (baseRange) {
                    totalAttackRange += baseRange;
                }
            }
        }
    
        if (neutral) {
            let rangeBonus = tryGetNeutralSpecialValue(neutral, "attack_range_bonus");
            if (rangeBonus) {
                totalAttackRange += rangeBonus;
            }
    
            let bonusAttackRange = tryGetNeutralSpecialValue(neutral, "bonus_attack_range");
            if (bonusAttackRange) {
                totalAttackRange += bonusAttackRange;
            }
        }

        if (abilities && abilities.length > 0) {
            for(let ability of abilities) {
                let bonusAttackRange = tryGetAbilitySpecialAbilityValue(ability, "bonus_attack_range", 1);
                if (bonusAttackRange) {
                    totalAttackRange += bonusAttackRange;
                }
            }
        }

        if (talents && talents.length > 0) {
            for(let talent of talents) {
                if (talent.includes("bonus_attack_range")) {
                    let bonusAttackRange = tryGetTalentSpecialAbilityValue(talent, "value");
                    if (bonusAttackRange) {
                        totalAttackRange += bonusAttackRange;
                    }
                }
            }
        }
    } else {
        // Melee units, apply any melee attack range bonuses
        if (neutral) {
            let bonusAttackRange = tryGetNeutralSpecialValue(neutral, "melee_attack_range");
            if (bonusAttackRange) {
                totalAttackRange += bonusAttackRange;
            }
        }
    }

    return totalAttackRange;
}

export function calculateAttribute(attribute, hero, level, items, neutral, abilities, talents) {
    if (!hero) {
        return "?";
    }

    let attributeStats = getSpecificAttributeStats(attribute, hero);
    let baseStrength = attributeStats.base;
    let strengthPerLevel = attributeStats.perLevel;

    let totalAttribute = baseStrength + (strengthPerLevel * (level - 1));
    let additionalAttribute = 0;

    if (items && items.length > 0) {
        for(let item of items) {
            switch(attribute) {
                case EAttributes.ATTR_STRENGTH:
                    {
                        let bonusStr = tryGetItemSpecialValue(item, "bonus_strength");
                        if (bonusStr) {
                            additionalAttribute += bonusStr;
                        }
                        break;
                    }
                case EAttributes.ATTR_AGILITY:
                    {
                        let bonusAgi = tryGetItemSpecialValue(item, "bonus_agility");
                        if (bonusAgi) {
                            additionalAttribute += bonusAgi;
                        }
                        break;
                    }
                case EAttributes.ATTR_INTELLIGENCE:
                    {
                        let bonusInt = tryGetItemSpecialValue(item, "bonus_intellect");
                        if (bonusInt) {
                            additionalAttribute += bonusInt;
                        }
                        break;    
                    }
                default:
                    break;
            }
        }
    }

    if (neutral) {
        switch(attribute) {
            case EAttributes.ATTR_STRENGTH:
                    {
                        let bonusStr = tryGetNeutralSpecialValue(neutral, "bonus_strength");
                        if (bonusStr) {
                            additionalAttribute += bonusStr;
                        }
                        break;
                    }
            case EAttributes.ATTR_AGILITY:
                {
                    let bonusAgi = tryGetNeutralSpecialValue(neutral, "bonus_agility");
                    if (bonusAgi) {
                        additionalAttribute += bonusAgi;
                    }
                    break;
                }
            case EAttributes.ATTR_INTELLIGENCE:
                {
                    let bonusInt = tryGetNeutralSpecialValue(neutral, "bonus_intelligence");
                    if (bonusInt) {
                        additionalAttribute += bonusInt;
                    }
                    break;    
                }
            default:
                break;
        }
    }

    if (talents && talents.length > 0) {
        for(let talent of talents) {
            switch(attribute) {
                case EAttributes.ATTR_STRENGTH:
                        {
                            if (talent.includes("bonus_strength")) {
                                let bonusStr = tryGetTalentSpecialAbilityValue(talent, "value");
                                if (bonusStr) {
                                    additionalAttribute += bonusStr;
                                }
                            }
                            break;
                        }
                case EAttributes.ATTR_AGILITY:
                    {
                        if (talent.includes("bonus_agility")) {
                            let bonusAgi = tryGetTalentSpecialAbilityValue(talent, "value");
                            if (bonusAgi) {
                                additionalAttribute += bonusAgi;
                            }
                        }
                        break;
                    }
                case EAttributes.ATTR_INTELLIGENCE:
                    {
                        if (talent.includes("bonus_intelligence")) {
                            let bonusInt = tryGetTalentSpecialAbilityValue(talent, "value");
                            if (bonusInt) {
                                additionalAttribute += bonusInt;
                            }
                        }
                        break;    
                    }
                default:
                    break;
            }
        }
    }

    return {
        /// Base attribute amount, includes per level
        attribute: totalAttribute,
        /// Additional attribute amount, from items/neutral/abils/talents
        additionalAttribute: additionalAttribute,
        /// Amount of strength per level
        perLevel: strengthPerLevel,
    };
}