import { 
    getItemInfoFromName,
    getItemSpecialAbilityValue,
} from "./dataHelperItems";

import {
    getAbilityInfoFromName,
    getAbilitySpecialAbilityValue,
    getAbilityOutputDamage
} from "./dataHelperAbilities";

import {
    getTalentInfoFromName
} from "./dataHelperTalents";

import { DOTAHeroes } from "../data/dota2/json/npc_heroes.json";
import { DOTAAbilities } from "../data/dota2/json/npc_abilities.json";

/// Calculates the health of a hero
/// https://dota2.gamepedia.com/Health
export function calculateHealth(baseStrength, strengthGain, heroLevel, isStrength) {
    var healthPerStrPoint = 20;

    baseStrength = parseInt(baseStrength);
    strengthGain = parseFloat(strengthGain);

    var baseHealth = 0;
    if (DOTAHeroes && DOTAHeroes.npc_dota_hero_base && DOTAHeroes.npc_dota_hero_base.StatusHealth) {
        baseHealth = parseInt(DOTAHeroes.npc_dota_hero_base.StatusHealth);
    } else {
        console.error("Can't add baseHealth to heroes health pool");
    }

    var totalStr = baseStrength + (strengthGain * (heroLevel - 1));
    return baseHealth + (totalStr * healthPerStrPoint);
}

/// Calculates the mana pool of a hero
/// https://dota2.gamepedia.com/Mana
export function calculateMana(baseInt, intGain, heroLevel, isIntelligence) {
    var manaPerIntPoint = 12;
    
    baseInt = parseInt(baseInt);
    intGain = parseFloat(intGain);

    var baseMana = 0;
    if (DOTAHeroes && DOTAHeroes.npc_dota_hero_base && DOTAHeroes.npc_dota_hero_base.StatusMana) {
        baseMana = parseInt(DOTAHeroes.npc_dota_hero_base.StatusMana);
    } else {
        console.error("Can't add baseMana to heroes mana pool");
    }

    var totalInt = baseInt + (intGain * (heroLevel - 1));
    return baseMana + (totalInt * manaPerIntPoint);
}

/* Hero gains +0.1 regen per each point of strength
* https://dota2.gamepedia.com/Health_regeneration */
export function calculateHealthRegen(baseStrength, strengthPerLvl, additionalHealthRegen,  heroLvl = 1) {
    var hpRegenPerStrength = 0.1;
    var baseStr = parseInt(baseStrength);
    var strGain = parseFloat(strengthPerLvl);

    var hpRegen = (baseStr + (strGain * (heroLvl - 1))) * hpRegenPerStrength;
    if (additionalHealthRegen) {
        hpRegen += parseFloat(additionalHealthRegen);
    }
    return hpRegen.toFixed(1);
}

/* Each point of intelligence increases the hero's mana regeneration by 0.05.
 * https://dota2.gamepedia.com/Mana_regeneration */
export function calculateManaRegen(baseIntelligence, intelligencePerLvl, additionalManaRegen, heroLvl = 1) {
    var manaRegenPerInt = 0.05;
    var baseInt = parseInt(baseIntelligence);
    var intGain = parseFloat(intelligencePerLvl);

    var manaRegen = (baseInt + (intGain * (heroLvl - 1))) * manaRegenPerInt;
    if (additionalManaRegen) {
        manaRegen += parseFloat(additionalManaRegen);
    }

    return manaRegen.toFixed(1);
}

// Calculates the main armor of the hero
export function calculateMainArmor(baseArmor, baseAgility, agiPerLevel, level) {
    // Determine bonus agility from perLevel. Then work out main armor
    var agiPer = (parseFloat(agiPerLevel) * (level - 1));
    var mainArmor = parseInt(baseArmor) + ((parseInt(baseAgility) + agiPer) * 0.16);
    // Round to one decimal place
    return mainArmor.toFixed(1);
}

/// Returns the total amount of spell amplification as a percentage applied to the hero
export function calculateTotalSpellAmp (talents, items, neutral) {
    var totalSpellAmp = 0;
    
    // Determine if any talents provide spell amp
    if (talents && talents.length > 0) {
        var ampTalent = talents.find(element => element.includes("spell_amplify"));
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

/// Returns the minimum and maximum right click damage of a hero
export function calculateRightClickDamage(atkMin, atkMax, primaryAttributeStats, heroLevel = 1) {
    // Work out how much bonus attack hero recieves from their primary attribute
    var bonusAtk = primaryAttributeStats.base + (primaryAttributeStats.perLevel * (heroLevel - 1));
    
    // Add and return
    var min = parseInt(atkMin) + bonusAtk;
    var max = parseInt(atkMax) + bonusAtk;
    return {
        /// minimum attack damage of the hero
        min: Math.floor(min).toFixed(0),
        /// maximum attack damage of the hero
        max: Math.floor(max).toFixed(0),
    };
}

/// Returns info on the attack time of the hero
export function calculateAttackTime(attackSpeed, attackRate, baseAgi, agiPerLevel, heroLevel) {
    attackSpeed = parseInt(attackSpeed);
    attackRate = parseFloat(attackRate);
    
    var agi = baseAgi + (agiPerLevel * (heroLevel - 1));

    var attacksPerSec = ((attackSpeed + agi) * 0.01) / 1.7;
    var attackTime = 1.7 / ((attackSpeed + agi) * 0.01);
    attackTime = 1 / attacksPerSec;

    var speed = attackSpeed + agi;

    return {
        /// Amount of seconds inbetween attacks
        attackTime: attackTime.toFixed(2),
        /// Amount of attacks per second
        attacksPerSecond: attacksPerSec.toFixed(2),
        /// Attack speed value shown in UI of dota
        attackSpeed: speed.toFixed(0),
    };
}

/// Calculates how much output damage an ability will do to an enemy, factoring in any items
export function calculateSpellDamage(abilityInfo, abilityLevel, items, neutral, talents) {
    if (!abilityLevel || !abilityInfo) {
        return -1;
    }

    // Get normal dmg output of ability
    let abilityDamage = getAbilityOutputDamage(abilityInfo, abilityLevel);
    
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

    if (talents) {
        // Add spell amplify from any selected talents
        for(let i = 0; i < talents.length; i++) {
            // Only use talents that are spell amp's
            if (!talents[i].includes("spell_amplify")) {
                continue;
            }

            var talentInfo = getTalentInfoFromName(talents[i]);
            if (talentInfo) {
                var info = talentInfo.info;
                if (info && info.AbilitySpecial) {
                    let ampTalentValue = getAbilitySpecialAbilityValue(info, "value");
                    if (ampTalentValue) {
                        totalSpellAmpPercent += ampTalentValue;
                    }
                }
            }
        }
    }

    abilityDamage = calculateSpellAmp(abilityDamage, totalSpellAmpPercent);
    return {
        damage: abilityDamage,
    };
}

/// Calculates and applies spell amp to the spell damage and returns the result
export function calculateSpellAmp (spellDamage, spellAmpPercent) {
    return spellDamage + ((spellDamage / 100) * spellAmpPercent);
}

/// Calculates ability mana cost with items, neutrals and talents that contain reductions
export function calculateManaCost(abilityInfo, abilityLevel, items, neutral, talents) {
    let manaCost = null;

    // Get inital mana cost amount
    if (abilityInfo && abilityInfo.AbilityManaCost) {
        let infoManaCost = abilityInfo.AbilityManaCost;
        if (typeof infoManaCost === "string") {
            let val = infoManaCost.split(" ")[abilityLevel - 1];
            manaCost = val;
        } else {
            manaCost = infoManaCost;
        }
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
            if (!talent.includes("mana_reduction")) {
                continue;
            }

            let talentInfo = getAbilityInfoFromName(talent);
            if(talentInfo) {
                let talentReduceAmount = getAbilitySpecialAbilityValue(talentInfo, "value");
                if(talentReduceAmount) {
                    totalManaCostReducePercent += talentReduceAmount;
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
    let cooldown = null;
    
    if (abilityInfo && abilityInfo.AbilityCooldown) {
        let infoCooldown = abilityInfo.AbilityCooldown;
        if (typeof infoCooldown === "string") {
            let val = infoCooldown.split(" ")[abilityLevel - 1];
            cooldown = parseFloat(val);
        } else {
            cooldown = infoCooldown;
        }
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
            if (!talent.includes("cooldown_reduction")) {
                continue;
            }

            var talentInfo = getTalentInfoFromName(talent)?.info;
            if (talentInfo) {
                var talentReduction = getAbilitySpecialAbilityValue(talentInfo, "value");
                if (talentReduction) {
                    allReductions.push({ amount: talentReduction, source: talent });
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