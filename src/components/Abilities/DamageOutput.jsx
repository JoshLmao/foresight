import React, { Component } from 'react';

/// Parses a string that contains damage values separated with a space
function getDmgValue(dmgValues, index) {
    return dmgValues.split(' ')[index];
}

function getAbilityDmg(index, level, abilityInfo) {

    //console.log("updating " + index + " at level " + level);

    var dmgVals = abilityInfo.AbilityDamage;
    if(dmgVals) {
        return dmgVals.split(' ')[level - 1];
    }
    else if (abilityInfo.AbilitySpecial) 
    {
        //console.log(abilityInfo.AbilitySpecial);
        for (var i = 0; i < abilityInfo.AbilitySpecial.length; i++) {
            var specAbil = abilityInfo.AbilitySpecial[i];

            /// Array of AbilitySpecial keys that deal damage
            var specialAbilityDamageKeys = [
                //Generic
                "damage",
                // Abaddon
                "target_damage", "damage_absorb", 
                //Alchemist
                "max_damage",
                
                //zeus
                "arc_damage",
            ];

            // Find matching key in AbilitySpecial
            for(var j = 0; j < specialAbilityDamageKeys.length; j++) {
                if (specAbil[specialAbilityDamageKeys[j]]) {
                    return getDmgValue(specAbil[specialAbilityDamageKeys[j]], level - 1);
                }
            }
        }
    }
    
    return "No Output Damage";
}

class DamageOutput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            abilityInfo: props.abilityInfo,
            level: props.levelInfo,
        };
    }

    render() {
        return (
            <h6>
                { getAbilityDmg(this.state.level.ability, this.state.level.level, this.state.abilityInfo) }
            </h6>
        );
    }
}

export default DamageOutput;