import {
    getAbilitySpecialValue
} from "./dataHelperGeneric";

import { 
    getItemInfoFromName,
    tryGetItemSpecialValue,
    tryGetNeutralSpecialValue,
    primaryAttributeToItemBonusKey,
    itemsContainsScepter
} from "./dataHelperItems";

import {
    getAbilityInfoFromName,
    getAbilitySpecialAbilityValue,
    getAbilityOutputDamage,
    tryGetAbilitySpecialAbilityValue,
    parseAbilityValueByLevel,
    isCooldownTalent,
    isDamageTalent,
    isCastRangeTalent,
    getAbilitySpecialCastRangeValue,
    getIncludesAbilitySpecialAbilityValue,
    isAbilityBehaviour
} from "./dataHelperAbilities";

import {
    getTalentInfoFromName,
    tryGetTalentSpecialAbilityValue,
    tryGetTalentValueInclude,
} from "./dataHelperTalents";

import {
    getDotaBaseHero,
    getSpecificAttributeStats,
    getPrimaryAttributeStats,
    getPrimaryAttribute,
    isHeroAttackCapability
} from "./dataHelperHero";

import {
    calculateMultiplicativeStackingTotal
} from "./generalMath";

import { EAttributes } from "../enums/attributes";
import { EAttackCapabilities } from "../enums/hero";
import { EAbilityBehaviour } from "../enums/abilities";

import { DOTAHeroes } from "../data/dota2/json/npc_heroes.json";
import { DOTAAbilities } from "../data/dota2/json/npc_abilities.json";

/// Calculates the health of a hero
/// https://dota2.gamepedia.com/Health
export function calculateHealth(hero, heroLevel, items, neutral, abilities, talents) {
    if (!hero) {
        return "?";
    }
    
    let HEALTH_PER_STRENGTH_POINT = 20;
    let baseStrength = parseInt(hero.AttributeBaseStrength)
    let strengthGain = parseFloat(hero.AttributeStrengthGain);

    let baseHealth = 0;
    if (DOTAHeroes && DOTAHeroes.npc_dota_hero_base && DOTAHeroes.npc_dota_hero_base.StatusHealth) {
        baseHealth = parseInt(DOTAHeroes.npc_dota_hero_base.StatusHealth);
    } else {
        console.error("Can't add baseHealth to heroes health pool");
    }

    let totalStr = baseStrength + (strengthGain * (heroLevel - 1));
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

        let maxHealth = tryGetNeutralSpecialValue(neutral, "max_health");
        if (maxHealth) {
            totalHealth += maxHealth;
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
export function calculateMana(hero, heroLevel, items, neutral, abilities, abilityLevels, talents) {
    if (!hero) {
        return "?";
    }    

    let MANA_PER_INT_POINT = 12;
    let baseInt = parseInt(hero.AttributeBaseIntelligence);
    let intGain = parseFloat(hero.AttributeIntelligenceGain);

    let baseMana = 0;
    if (DOTAHeroes && DOTAHeroes.npc_dota_hero_base && DOTAHeroes.npc_dota_hero_base.StatusMana) {
        baseMana = parseInt(DOTAHeroes.npc_dota_hero_base.StatusMana);
    } else {
        console.error("Can't add baseMana to heroes mana pool");
    }

    let totalInt = baseInt + (intGain * (heroLevel - 1));
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

        // If witless shako, remove from total mana pool
        if (neutral.item === "item_witless_shako") {
            let maxMana = tryGetNeutralSpecialValue(neutral, "max_mana");
            if (maxMana) {
                totalMana -= maxMana;
            }
        }
    }

    if (abilities && abilities.length > 0) {
        for(let abilityIndex in abilities) {
            // Get name and level of ability
            let ability = abilities[abilityIndex];
            let abilityLevel = abilityLevels[abilityIndex]?.level ?? 1;
            
            let bonusMana = tryGetAbilitySpecialAbilityValue(ability, "bonus_mana", abilityLevel);
            if (bonusMana) {
                totalMana += bonusMana;
            }

            let bonusInt = tryGetAbilitySpecialAbilityValue(ability, "bonus_intellect", abilityLevel);
            if (bonusInt) {
                totalMana += bonusInt * MANA_PER_INT_POINT;
            }

            let bonusAllStats = tryGetAbilitySpecialAbilityValue(ability, "bonus_all_stats", abilityLevel);
            if (bonusAllStats) {
                totalMana += bonusAllStats * MANA_PER_INT_POINT;
            }
        }
    }

    if (talents && talents.length > 0) {
        for(let talent of talents) {
            let bonusMana = tryGetTalentValueInclude(talent, "bonus_mp");
            if (bonusMana) {
                totalMana += bonusMana;
            }
            let bonusInt = tryGetTalentValueInclude(talent, "bonus_intelligence");
            if (bonusInt) {
                totalMana += bonusInt * MANA_PER_INT_POINT;
            }
            let bonusAllStats = tryGetTalentValueInclude(talent, "bonus_all_stats");
            if (bonusAllStats) {
                totalMana += bonusAllStats * MANA_PER_INT_POINT;
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

    // total additional hp regen from sources that provide flat hp regen
    let additionalHpRegen = 0;
    // total from sources that give hp regen amplification
    let allHpRegenAmpSources = [];
    // total from sources that provide max health regen
    let totalMaxHealthRegenPercent = 0;

    if (items && items.length > 0) {
        for(let item of items) {
            let regenAmt = tryGetItemSpecialValue(item, "bonus_health_regen");
            if (regenAmt) {
                additionalHpRegen += regenAmt;
            }

            let bonusRegen = tryGetItemSpecialValue(item, "bonus_regen");
            if (bonusRegen) {
                additionalHpRegen += bonusRegen;
            }

            let healthRegen = tryGetNeutralSpecialValue(item, "hp_regen");
            if (healthRegen) {
                additionalHpRegen += healthRegen;
            }

            let bonusStr = tryGetItemSpecialValue(item, "bonus_strength");
            if(bonusStr) {
                totalHpRegen += bonusStr * HP_REGEN_PER_STRENGTH;
            }

            let bonusAllStats = tryGetItemSpecialValue(item, "bonus_all_stats");
            if (bonusAllStats) {
                totalHpRegen += bonusAllStats * HP_REGEN_PER_STRENGTH;
            }

            let regenAmp = tryGetItemSpecialValue(item, "hp_regen_amp");
            if (regenAmp) {
                allHpRegenAmpSources.push(regenAmp);
            }

            let healthRegenPct = tryGetItemSpecialValue(item, "health_regen_pct");
            if (healthRegenPct) {
                totalMaxHealthRegenPercent = healthRegenPct;
            }
        }
    }

    if (neutral) {
        let healthRegen = tryGetNeutralSpecialValue(neutral, "hp_regen");
        if (healthRegen) {
            additionalHpRegen += healthRegen;
        }

        let bonusHealthRegen = tryGetNeutralSpecialValue(neutral, "bonus_health_regen");
        if (bonusHealthRegen) {
            additionalHpRegen += bonusHealthRegen;
        }

        let bonusHpRegen = tryGetNeutralSpecialValue(neutral, "bonus_hp_regen");
        if (bonusHpRegen) {
            additionalHpRegen += bonusHpRegen;
        }

        let bonusStr = tryGetNeutralSpecialValue(neutral, "bonus_strength");
        if (bonusStr) {
            totalHpRegen += bonusStr * HP_REGEN_PER_STRENGTH;
        }
        
        let bonusAllStats = tryGetNeutralSpecialValue(neutral, "bonus_all_stats");
        if (bonusAllStats) {
            totalHpRegen += bonusAllStats * HP_REGEN_PER_STRENGTH;
        }

        let regenAmp = tryGetNeutralSpecialValue(neutral, "hp_regen_amp");
        if (regenAmp) {
            allHpRegenAmpSources.push(regenAmp);
        }
    } 

    // if (abilities && abilities.length > 0) {
    //     for (let ability of abilities) {
    //         let bonusRegen = tryGetAbilitySpecialAbilityValue(ability, "bonus_health_regen", 1);
    //         if (bonusRegen) {
    //             totalHpRegen += bonusRegen;
    //         }
    //     }
    // }

    if (talents && talents.length > 0) {
        for (let talent of talents) {
            // Only get bonus_hp_regen talents
            if (talent.includes("bonus_hp_regen")) {
                let bonusRegen = tryGetTalentSpecialAbilityValue(talent, "value");
                if (bonusRegen) {
                    additionalHpRegen += bonusRegen;
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

    let totalMaxHpRegen = 0;
    if (totalMaxHealthRegenPercent > 0) {
        let totalHealth = parseFloat(calculateHealth(hero, heroLevel, items, neutral, abilities, talents));
        totalMaxHpRegen = (totalHealth / 100) * totalMaxHealthRegenPercent;
    }

    // Merge all stacked amp sources
    let regenAmpTotalPercent = calculateMultiplicativeStackingTotal(allHpRegenAmpSources);

    // Finally apply hp regen amp to total and additional
    let ampedHpRegen = 0;
    if (regenAmpTotalPercent > 0) {
        ampedHpRegen = ((totalHpRegen + totalMaxHpRegen) / 100) * regenAmpTotalPercent;
    }

    // Add up additional sources from item hp regen, max hp regen & hp regen amp
    let finalAdditional = additionalHpRegen + totalMaxHpRegen + ampedHpRegen;
    return {
        total: totalHpRegen,
        additional: finalAdditional,
    };
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

    let totalManaRegenPercentAmp = 100;

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

            // If bloodstone mp regen per charge
            let regenPerCharge = tryGetItemSpecialValue(item, "regen_per_charge");
            if (item.extra?.charges && regenPerCharge) {
                let bloodstoneCharges = item.extra.charges;
                totalManaRegen += regenPerCharge * bloodstoneCharges;
            }

            /// any mana regen percentage multiplier
            let manaRegenAmp = tryGetItemSpecialValue(item, "mana_regen_multiplier");
            if (manaRegenAmp) {
                totalManaRegenPercentAmp += manaRegenAmp;
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

        let bonusRegen = tryGetNeutralSpecialValue(neutral, "mana_regen");
        if (bonusRegen) {
            totalManaRegen += bonusRegen;
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

    let totalMP = totalManaRegen * (totalManaRegenPercentAmp / 100);
    return totalMP.toFixed(1);
}

// Calculates the main armor of the hero
// Each point of agility increases a hero's armor by 0.167 (1/6) https://dota2.gamepedia.com/Armor
export function calculateMainArmor(hero, level, items, neutral, abilities, talents) {
    if (!hero) {
        return "?";
    }

    let ARMOR_PER_AGI = 0.167;
    let baseArmor = parseInt(hero.ArmorPhysical);
    let baseAgility = parseInt(hero.AttributeBaseAgility);
    let agiPerLevel = parseFloat(hero.AttributeAgilityGain);

    // Determine bonus agility from perLevel. Then work out main armor
    let agiPer = (agiPerLevel * (level - 1));
    let totalArmor = baseArmor + ((baseAgility + agiPer) * ARMOR_PER_AGI);
    let totalBonusArmor = 0;
    
    if (items && items.length > 0) {
        for(let item of items) {
            let bonusArmor = tryGetItemSpecialValue(item, "bonus_armor");
            if (bonusArmor) {
                totalBonusArmor += bonusArmor;
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
        /// If item is nether_shawl, armor needs to be removed
        if (neutral.item === "item_nether_shawl") {
            let bonusArmor = tryGetNeutralSpecialValue(neutral, "bonus_armor");
            if (bonusArmor) {
                totalBonusArmor -= bonusArmor;
            }
        } else {
            let bonusArmor = tryGetNeutralSpecialValue(neutral, "bonus_armor");
            if (bonusArmor) {
                totalBonusArmor += bonusArmor;
            }
        }
        

        let armorBonus = tryGetNeutralSpecialValue(neutral, "armor_bonus");
        if (armorBonus) {
            totalBonusArmor += armorBonus;
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

    /// ToDo: If abilities active, add active ability armor
    /// or if ability is passive, apply bonus
    // if (abilities && abilities.length > 0) {
    //     for(let ability of abilities) {
    //         /// if a passive, add armor depending on ability level
    //         let abilInfo = getAbilityInfoFromName(ability);
    //         if (isAbilityBehaviour(abilInfo.AbilityBehavior, [ EAbilityBehaviour.PASSIVE ])) {
    //             let bonusArmor = tryGetAbilitySpecialAbilityValue(ability, "bonus_armor");
    //             if (bonusArmor) {
    //                 totalArmor += bonusArmor;
    //             }
    //         }
    //     }
    // }

    if(talents && talents.length > 0) {
        for(let talent of talents) {
            if (talent.includes("bonus_armor")) {
                let bonusArmor = tryGetTalentSpecialAbilityValue(talent, "value");
                if (bonusArmor) {
                    totalBonusArmor += bonusArmor;
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
    return {
        armor: totalArmor,
        additional: totalBonusArmor,
    };
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
            let spellAmpAmount = getAbilitySpecialValue(foundNeutral, "spell_amp");
            if (spellAmpAmount) {
                totalSpellAmp += spellAmpAmount;
                //console.log(`Neutral ${neutral.item} provides ${spellAmpAmount}% spell amp`);
            }
        }
    }

    /// Determine if any items provide spell amp
    if (items && items.length > 0) {
        for(let item of items) {
            let spellAmpAmount = tryGetItemSpecialValue(item, "spell_amp");
            if (spellAmpAmount) {
                totalSpellAmp += spellAmpAmount;
                //console.log(`Item ${items[i].item} provides ${spellAmpAmt}% spell amp`);
            }

            let bonusSpellAmp = tryGetItemSpecialValue(item, "bonus_spell_amp");
            if (bonusSpellAmp) {
                totalSpellAmp += bonusSpellAmp;
            }

            let ampPerCharge = tryGetItemSpecialValue(item, "amp_per_charge");
            if (item.extra?.charges && ampPerCharge) {
                let bloodstoneCharges = item.extra.charges;
                totalSpellAmp += ampPerCharge * bloodstoneCharges;
            }
        }
    }


    return totalSpellAmp.toFixed(1);
}

export function calculateStatusResist(items, neutral) {
    let totalStatusResist = 0.0;

    if (items && items.length > 0) {
        for(let i = 0; i < items.length; i++) {
            if (items[i].item) {
                let itemInfo = getItemInfoFromName(items[i].item);
                if (itemInfo) {
                    let statusResistAmount = getAbilitySpecialValue(itemInfo.AbilitySpecial, "status_resistance");
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
                let magicResistAmount = getAbilitySpecialValue(itemInfo.AbilitySpecial, "bonus_magic_resistance");
                if (magicResistAmount) {
                    resistanceBonuses.push(magicResistAmount);
                }

                magicResistAmount = getAbilitySpecialValue(itemInfo.AbilitySpecial, "magic_resistance");
                if (magicResistAmount) {
                    resistanceBonuses.push(magicResistAmount);
                }

                magicResistAmount = getAbilitySpecialValue(itemInfo.AbilitySpecial, "bonus_magical_armor");
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

    // magic resistance stacks multiplicatively
    let percent = calculateMultiplicativeStackingTotal(resistanceBonuses);
    return percent.toFixed(2);
}

/// Calculates the total magic resistance of the hero
/// https://dota2.gamepedia.com/Magic_resistance
export function calculatePhysicalResist (totalArmor) {
    // Formula from https://www.dotabuff.com/blog/2018-11-30-understanding-720-armor-changes
    //( 0.052 * armor ) ÷ ( 0.9 + 0.048 * |armor|)
    let physResist = (0.052 * totalArmor) / (0.9 + 0.048 * Math.abs(totalArmor));
    let percent = physResist * 100;
    return percent < 0 ? 0 : percent.toFixed(0);
}

/// Calculates evasion
export function calculateEvasion(items, neutral, abilities, talents) {
    let totalEvasion = 0.0;

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
        for(let i = 0; i < items.length; i++) {
            if (items[i].item) {
                let itemInfo = getItemInfoFromName(items[i].item);
                if (itemInfo) {
                    let evasionAmount = getAbilitySpecialValue(itemInfo.AbilitySpecial, "bonus_evasion");
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

    // Check if the hero attack is melee or ranged
    let heroIsMelee = isHeroAttackCapability(hero, EAttackCapabilities.MELEE);

    // Work out how much bonus attack hero recieves from their primary attribute
    let totalPrimaryAttribute = primaryAttributeStats.base + (primaryAttributeStats.perLevel * (level - 1));
    // Calc additional damage from sources
    let totalAdditional = 0;

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

            let bonusDmg = tryGetItemSpecialValue(item, "bonus_damage");
            if (bonusDmg) {
                totalAdditional += bonusDmg;
            }

            if (heroIsMelee) {
                let bonusMeleeDmg = tryGetItemSpecialValue(item, "bonus_damage_melee");
                if (bonusMeleeDmg) {
                    totalAdditional += bonusMeleeDmg;
                }
            } else {
                let bonusRangedDmg = tryGetItemSpecialValue(item, "bonus_damage_ranged");
                if (bonusRangedDmg) {
                    totalAdditional += bonusRangedDmg;
                }
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

        let bonusAllStats = tryGetNeutralSpecialValue(neutral, "bonus_all_stats");
        if (bonusAllStats) {
            totalPrimaryAttribute += bonusAllStats;
        }

        let bonusDmg = tryGetNeutralSpecialValue(neutral, "bonus_damage");
        if (bonusDmg) {
            totalAdditional += bonusDmg;
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
                let allStats = tryGetTalentSpecialAbilityValue(talent, "value");
                if (allStats) {
                    totalPrimaryAttribute += allStats;
                }
            } else if (talent.includes("bonus_attack_damage")) {
                let bonusDmg = tryGetTalentSpecialAbilityValue(talent, "value");
                if (bonusDmg) {
                    totalAdditional += bonusDmg;
                }
            }
        }
    }

    /// Damage from primary attribute counts as part of the Min-Max
    /// whereas bonus damage (+5 damage) from sources count as additional

    let min = atkMin + totalPrimaryAttribute;
    let max = atkMax + totalPrimaryAttribute;

    return {
        /// minimum attack damage of the hero
        min: Math.floor(min),
        /// maximum attack damage of the hero
        max: Math.floor(max),
        additional: totalAdditional,
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

        let attackSpeed = tryGetNeutralSpecialValue(neutral, "attack_speed");
        if (attackSpeed) {
            totalAttackSpeed += attackSpeed;
        }
    }

    // Only actives that gives attack speed bonuses
    // if (abilities && abilities.length > 0) {
    // }

    if (talents && talents.length > 0) {
        for(let talent of talents) {
            let bonusAttackSpeed = tryGetTalentValueInclude (talent, "bonus_attack_speed");
            if (bonusAttackSpeed) {
                totalAttackSpeed += bonusAttackSpeed;
            }

            let bonusAgility = tryGetTalentValueInclude(talent, "bonus_all_stats");
            if (bonusAgility) {
                totalAgi += bonusAgility;
            }

            bonusAgility = tryGetTalentValueInclude(talent, "bonus_agility");
            if (bonusAgility) {
                totalAgi += bonusAgility;
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
export function calculateSpellDamage(abilityName, abilityInfo, abilityLevel, items, neutral, talents) {
    if (!abilityLevel || !abilityInfo) {
        return -1;
    }

    // Get normal dmg output of ability
    let abilityDamageInfo = getAbilityOutputDamage(abilityInfo, abilityLevel);
    
    // Add up spellAmp from all bonuses to calculate at end
    let totalSpellAmpPercent = 0;

    /// Value bonus from talent
    let talentBonus = 0;

    if (items) {
        // Add item spell damage increase
        for(let item of items) {
            let spellAmp = tryGetItemSpecialValue(item, "spell_amp");
            if (spellAmp) {
                totalSpellAmpPercent += spellAmp;
            }

            let bonusSpellAmp = tryGetItemSpecialValue(item, "bonus_spell_amp");
            if (bonusSpellAmp) {
                totalSpellAmpPercent += bonusSpellAmp;
            }

            // get current bloodstone charges and amp correctly
            let chargeCount = item.extra?.charges;
            let ampPerCharge = tryGetItemSpecialValue(item, "amp_per_charge");
            if (ampPerCharge && chargeCount) {
                totalSpellAmpPercent += (ampPerCharge * chargeCount);
            }
        }
    }

    if (neutral) {
        //Add neutral item spell dmg
        let neutralInfo = getItemInfoFromName(neutral.item);
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
            /// if a unique talent specific to a hero ability
            else if (talent.includes("special_bonus_unique")) {
                /// Search Abilities_English.json for string of talent to 
                /// check if it is a damage talent modifier and apply
                if (isDamageTalent(talent)) {
                    let linkedAbility = tryGetTalentSpecialAbilityValue(talent, "ad_linked_ability");

                    // if linked ability is equal to current one
                    if (linkedAbility && linkedAbility === abilityName) {
                        let value = tryGetTalentSpecialAbilityValue(talent, "value");
                        if (value) {
                            talentBonus = value;
                        }
                    }
                }
            }
        }
    }
    
    let totalAbilDmg = abilityDamageInfo.damage + talentBonus;
    let abilityDamage = calculateSpellAmp(totalAbilDmg, totalSpellAmpPercent);

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
            let itemInfo = getItemInfoFromName(item.item);
            if(itemInfo) {
                let manaCostReduceAmount = getAbilitySpecialValue(itemInfo.AbilitySpecial, "manacost_reduction");
                if(manaCostReduceAmount) {
                    totalManaCostReducePercent += manaCostReduceAmount;
                }
            }
        }
    }

    if (neutral) {
        let neutralInfo = getItemInfoFromName(neutral.item);
        if (neutralInfo) {
            let costReductionAmount = getAbilitySpecialValue(neutralInfo.AbilitySpecial, "manacost_reduction");
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
export function calculateAbilityCooldown(abilityName, abilityInfo, abilityLevel, items, neutral, talents) {
    if (abilityLevel <= 0) {
        return null;
    }
    
    let cooldown = null;
    let charges = null;
    let fixedAmtReductionSeconds = 0;

    if (abilityInfo && abilityInfo.AbilityCooldown) {
        cooldown = parseAbilityValueByLevel(abilityInfo.AbilityCooldown, abilityLevel);

        /// if ability uses charges, use charge cooldown
        if (cooldown === 0 && abilityInfo.AbilityCharges && abilityInfo.AbilityChargeRestoreTime) {
            cooldown = parseInt(abilityInfo.AbilityChargeRestoreTime);
            charges = parseInt(abilityInfo.AbilityCharges);
        }

        // if AbilityInfo has a Scepter upgrade and items contains scepter
        let requiresScepter = getAbilitySpecialAbilityValue(abilityInfo, "RequiresScepter") === "1";
        if (requiresScepter && itemsContainsScepter(items)) {
            let scepterCharges = getIncludesAbilitySpecialAbilityValue(abilityInfo, "charges", abilityLevel);
            charges = scepterCharges;
        }
    }

    let allReductions = [];
    if (items) {
        for (let item of items) {
            if (item && item.item) {
                let itemInfo = getItemInfoFromName(item.item);
                if (itemInfo) {
                    let bonusCooldown = getAbilitySpecialValue(itemInfo.AbilitySpecial, "bonus_cooldown");
                    if (bonusCooldown) {
                        allReductions.push(bonusCooldown);
                    }
                }
            }
        }
    }

    if (neutral) {
        let neutralInfo = getItemInfoFromName(neutral.item);
        if (neutralInfo) {
            let bonusCooldown = getAbilitySpecialValue(neutralInfo.AbilitySpecial, "bonus_cooldown");
            if (bonusCooldown) {
                allReductions.push(bonusCooldown);
            } 
        }
    }

    if (talents) {
        for(let talent of talents) {
            // Ignore talent if it isn't a cd reduction one
            if (talent.includes("cooldown_reduction")) {
                let reduction = tryGetTalentSpecialAbilityValue(talent, "value");
                if (reduction) {
                    allReductions.push(reduction);
                }
            }
            else if (talent.includes("special_bonus_unique")) {
                if (isCooldownTalent(talent)) {
                    let linkedAbility = tryGetTalentSpecialAbilityValue(talent, "ad_linked_ability", 1, false);
                    if (linkedAbility === abilityName) {
                        let value = tryGetTalentSpecialAbilityValue(talent, "value");
                        if (value) {
                            fixedAmtReductionSeconds += value;
                        }
                    }
                }
            }
        }
    }

    /// Remove any fixed amount cooldown reductions first before
    /// applying any other reductions
    let totalCooldown = cooldown - fixedAmtReductionSeconds;

    let sourceOfReductions = [];
    for(let reduction of allReductions) {
        let decimal = reduction / 100;
        sourceOfReductions.push((1 - decimal));
    }

    for(let reduce of sourceOfReductions) {
        totalCooldown *= reduce;
    }

    return {
        charges: charges,
        cooldown: totalCooldown > 0 ? totalCooldown.toFixed(2) : null,
    };
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
            
            let bonusMovement = tryGetItemSpecialValue(item, "bonus_movement");
            if (bonusMovement) {
                flatBonus += bonusMovement;
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

    let isHeroRanged = isHeroAttackCapability(hero, EAttackCapabilities.RANGED);

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
            let bonusMeleeAttackRange = tryGetNeutralSpecialValue(neutral, "melee_attack_range");
            if (bonusMeleeAttackRange) {
                totalAttackRange += bonusMeleeAttackRange;
            }
        }
    }

    return totalAttackRange;
}

/// Calculates the correct attribute stats for a given hero
export function calculateAttribute(attribute, hero, level, items, neutral, abilities, talents) {
    if (!hero) {
        return "?";
    }

    let attributeStats = getSpecificAttributeStats(attribute, hero);
    let baseAttribute = attributeStats.base;
    let attributePerLevel = attributeStats.perLevel;

    let totalAttribute = baseAttribute + (attributePerLevel * (level - 1));
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
                        let bonusIntellect = tryGetItemSpecialValue(item, "bonus_intellect");
                        if (bonusIntellect) {
                            additionalAttribute += bonusIntellect;
                        }

                        let bonusInt = tryGetItemSpecialValue(item, "bonus_intelligence");
                        if (bonusInt) {
                            additionalAttribute += bonusInt;
                        }
                        break;    
                    }
                default:
                    break;
            }

            let bonusAllStats = tryGetItemSpecialValue(item, "bonus_all_stats");
            if (bonusAllStats) {
                additionalAttribute += bonusAllStats;
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

                    let bonusIntellect = tryGetNeutralSpecialValue(neutral, "bonus_intellect");
                    if (bonusIntellect) {
                        additionalAttribute += bonusIntellect;
                    }
                    break;    
                }
            default:
                break;
        }

        let bonusAllStats = tryGetNeutralSpecialValue(neutral, "bonus_all_stats");
        if (bonusAllStats) {
            additionalAttribute += bonusAllStats;
        }

        /// Add primary stat bonus if current attribute matches hero's primary
        if (attribute == hero.AttributePrimary) {
            let primaryStat = tryGetNeutralSpecialValue(neutral, "primary_stat");
            if (primaryStat) {
                additionalAttribute += primaryStat;
            }
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

            if (talent.includes("all_stats")) {
                let bonusAllStats = tryGetTalentSpecialAbilityValue(talent, "value");
                if (bonusAllStats) {
                    additionalAttribute += bonusAllStats;
                }
            }
        }
    }

    // If primary attribute, round down else us normal rounding
    let isPrimaryAttr = getPrimaryAttribute(hero) === attribute;
    if (isPrimaryAttr) {
        totalAttribute = Math.floor(totalAttribute)
    } else {
        totalAttribute = parseInt(totalAttribute.toFixed(0));
    }

    return {
        /// Base attribute amount, includes per level
        attribute: totalAttribute,
        /// Additional attribute amount, from items/neutral/abils/talents
        additionalAttribute: additionalAttribute.toFixed(0),
        /// Amount of attribute per level
        perLevel: attributePerLevel,
    };
}

export function calculateAbilityCastRange (abilityName, abilityInfo, abilityLevel, items, neutral, talents) {
    if (!abilityInfo) {
        return "?";
    }

    /// Use CastRange or find range inside AbilitySpecial
    let baseCastRange = parseInt(abilityInfo.AbilityCastRange);
    if (!baseCastRange) {
        let foundRange = getAbilitySpecialCastRangeValue(abilityInfo, "_range", abilityLevel.level);
        if (foundRange) {
            baseCastRange = foundRange;
        } else {
            // Cant determine a cast range, none
            return null;
        }
    }

    let totalBonusRange = 0;

    if (items && items.length > 0) {
        for (let item of items) {
            let rangeBonus = tryGetItemSpecialValue(item, "cast_range_bonus");
            if (rangeBonus) {
                totalBonusRange += rangeBonus;
            }
        }
    }

    if (neutral) {
        let rangeBonus = tryGetNeutralSpecialValue(neutral, "cast_range_bonus");
        if (rangeBonus) {
            totalBonusRange += rangeBonus;
        }
    }

    if (talents && talents.length > 0) {
        for (let talent of talents) {
            if (talent.includes("bonus_cast_range")) {
                let rangeBonus = tryGetTalentSpecialAbilityValue(talent, "value");
                if (rangeBonus) {
                    totalBonusRange += rangeBonus;
                }
            }
            else if (talent.includes("special_bonus_unique")) {
                if (isCastRangeTalent(talent)) {
                    let linkedAbility = tryGetTalentSpecialAbilityValue(talent, "ad_linked_ability");
                    if (linkedAbility === abilityName) {
                        let value = tryGetTalentSpecialAbilityValue(talent, "value");
                        if (value) {
                            totalBonusRange += value;
                        }
                    }
                }
            }
        }
    }

    return baseCastRange + totalBonusRange;
}

/// Calculates the normal sell price of an item from it's ItemInfo
export function calculateItemSellCost (itemInfo) {
    if (itemInfo && itemInfo.ItemCost) {
        let cost = parseInt(itemInfo.ItemCost);
        // value rounded down
        return Math.floor(cost / 2);
    }
    return 0;
}

export function calculateTotalLifesteal (items, neutral, abilities, talents) {
    
    let totalLifestealPercent = 0;
    let totalLifestealAmp = 0;

    if (items && items.length > 0) {
        for (let item of items) {
            let lifestealPercent = tryGetItemSpecialValue(item, "lifesteal_percent");
            if (lifestealPercent) {
                totalLifestealPercent += lifestealPercent;
            }

            let lifestealAmp = tryGetItemSpecialValue(item, "hp_regen_amp");
            if (lifestealAmp) {
                totalLifestealAmp += lifestealAmp;
            }
        }
    }

    if (neutral) {
        let bonusLifesteal = tryGetNeutralSpecialValue(neutral, "bonus_lifesteal");
        if (bonusLifesteal) {
            totalLifestealPercent += bonusLifesteal;
        }
    }

    // if (abilities && abilities.length > 0) {
    //     for (let ability of abilities) {
    //         let abilityInfo = getAbilityInfoFromName(ability);
    //         // If ability is passive, add lifesteal depending on lvl
    //         if (isAbilityBehaviour(abilityInfo.isAbilityBehaviour, EAbilityBehaviour.PASSIVE)) {
                
    //         }
    //     }
    // }

    if (talents && talents.length > 0) {
        for(let talent of talents) {
            if (talent.includes("lifesteal")) {
                let bonusLifesteal = tryGetNeutralSpecialValue(neutral, "value");
                if (bonusLifesteal) {
                    totalLifestealPercent += bonusLifesteal;
                }
            }
        }
    }
    
    // Take total amp by the total lifesteal % to get actual amp percentage
    let lifestealPercentAmp = totalLifestealPercent / 100 * totalLifestealAmp;
    return totalLifestealPercent + lifestealPercentAmp;
}

/// Calculates the total cleave damage percentage
export function calculateTotalCleaveDmgPercent(heroInfo, items, neutral, abilities, talents) {
    if (!heroInfo) {
        return 0;
    }

    // No cleave on ranged heroes
    if ( isHeroAttackCapability(heroInfo, EAttackCapabilities.RANGED) ) {
        return 0;
    }

    let totalCleaveDmgPercent = 0;

    if (items && items.length > 0) {
        for (let item of items) {
            let cleaveDmgPercent = tryGetItemSpecialValue(item, "cleave_damage_percent");
            if (cleaveDmgPercent) {
                totalCleaveDmgPercent += cleaveDmgPercent;
            }
        }
    }

    if (abilities && abilities.length > 0) {
        for (let ability of abilities) {
            let cleaveDmg = tryGetAbilitySpecialAbilityValue(ability, "cleave_damage");
            if (cleaveDmg) {
                totalCleaveDmgPercent += cleaveDmg;
            }

            let greatCleaveDmg = tryGetAbilitySpecialAbilityValue(ability, "great_cleave_damage", 1);
            if (greatCleaveDmg) {
                totalCleaveDmgPercent += greatCleaveDmg;
            }
        }
    }

    if (talents && talents.length > 0) {
        for (let talent of talents) {
            if (talent.includes("cleave")) {
                let cleavePercent = tryGetTalentSpecialAbilityValue(talent,  "value");
                if (cleavePercent) {
                    totalCleaveDmgPercent += cleavePercent;
                }
            }
        }
    }

    return totalCleaveDmgPercent;
}

/// Calculates the current highest crit percent the hero can do
/// Crit will only take the highest crit damage percent
export function calculateCritPercent (items, neutral, abilities, talents) {
    let highestCritPercent = 0;
    
    if (items && items.length > 0) {
        for (let item of items) {
            let critMultiplier = tryGetItemSpecialValue(item, "crit_multiplier");
            if (critMultiplier && critMultiplier > highestCritPercent) {
                highestCritPercent = critMultiplier;
            }
        }
    }

    if (abilities && abilities.length > 0) {
        for (let ability of abilities) {
            let abilityLevel = 1;
            let critBonus = tryGetAbilitySpecialAbilityValue(ability, "crit_bonus", abilityLevel);
            if (critBonus && critBonus > highestCritPercent) {
                highestCritPercent = critBonus;
            }

            let bladeDanceCrit = tryGetAbilitySpecialAbilityValue(ability, "blade_dance_crit_mult", abilityLevel);
            if (bladeDanceCrit && bladeDanceCrit > highestCritPercent) {
                highestCritPercent = bladeDanceCrit;
            }
        }
    }

    // if (talents && talents.length > 0) {
    //     for (let talent of talents) {
    //         if (talent.includes("pl crit talent")) {
    //         }
    //     }
    // }

    return highestCritPercent;
}

/// Calculates the percent chance to crit on attack, stacks with other crit chances
export function calculateCritChancePercent (items, neutral, abilities, talents) {
    let totalCritChancePercent = 0;

    if (items && items.length > 0) {
        for (let item of items) {
            let critChance = tryGetItemSpecialValue(item, "crit_chance");
            if (critChance) {
                totalCritChancePercent += critChance;
            }
        }
    }

    if (abilities && abilities.length > 0) {
        for (let ability of abilities) {
            let abilityLevel = 1;
            let critChance = tryGetAbilitySpecialAbilityValue(ability, "crit_chance", abilityLevel);
            if (critChance) {
                totalCritChancePercent += critChance;
            }

            let bladeDanceCritChance = tryGetAbilitySpecialAbilityValue(ability, "blade_dance_crit_chance", abilityLevel);
            if (bladeDanceCritChance) {
                totalCritChancePercent += bladeDanceCritChance;
            }
        }
    }

    return totalCritChancePercent;
}

export function calculateTotalSpellLifesteal (items, neutral, abilities, talents) {
    let totalAllPercent = 0;
    let totalHeroLsPerc = 0;
    let totalCreepLsPerc = 0;

    let octarineCount = 0;
    if (items && items.length > 0) {
        for (let item of items) {
            //Check for multiple octarines and only add one
            if (item.item === "item_octarine_core") {
                octarineCount++;
                if (octarineCount > 1) {
                    continue;
                }
            }

            let heroLifesteal = tryGetItemSpecialValue(item, "hero_lifesteal");
            if (heroLifesteal) {
                totalHeroLsPerc += heroLifesteal;
            }

            let creepLifesteal = tryGetItemSpecialValue(item, "creep_lifesteal");
            if (creepLifesteal) {
                totalCreepLsPerc += creepLifesteal;
            }
        }
    }

    if (neutral) {
        let spellLifesteal = tryGetNeutralSpecialValue(neutral, "spell_lifesteal");
        if (spellLifesteal) {
            totalAllPercent += spellLifesteal;
        }
    }

    if (talents && talents.length > 0) {
        for (let talent of talents) {
            if (talent.includes("spell_lifesteal")) {
                let spellLifesteal = tryGetNeutralSpecialValue(neutral, "value");
                if (spellLifesteal) {
                    totalAllPercent += spellLifesteal;
                }
            }
        }
    }

    return {
        heroLifesteal: totalAllPercent + totalHeroLsPerc,
        creepLifesteal: totalAllPercent + totalCreepLsPerc,
    };
}