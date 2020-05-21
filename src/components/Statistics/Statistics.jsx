import React, { Component } from 'react';
import {
    Row, Col
} from "react-bootstrap";

import { EAttributes } from "../../enums/attributes";
import { DOTAHeroes } from "../../data/dota2/json/npc_heroes.json";

function parse(value) {
    return parseInt(value);
}

function StatArray(props) {
    return (
        <div style={{ backgroundColor: "#171717", color: "white", fontSize: "0.85rem" }} className="p-2 h-100">
            <h6 className="ml-auto">{props.title}</h6>
            {
                props.stats &&
                    props.stats.map((value) => {
                        return (<Row key={value.name}>
                            <Col md={7}>
                                {value.name}
                            </Col>
                            <Col md={5}>
                                {value.value}
                            </Col>
                        </Row>
                        );
                    })
            }
        </div>
    );
}

/* Hero gains +0.1 regen per each point of strength
* https://dota2.gamepedia.com/Health_regeneration */
function calculateHealthRegen(baseStrength, heroLvl = 1, additionalHealthRegen) {
    var hpRegen = (parseInt(baseStrength) * 0.1) * heroLvl;
    if (additionalHealthRegen) {
        hpRegen += parseFloat(additionalHealthRegen);
    }
    return hpRegen.toFixed(2);
}

/* Each point of intelligence increases the hero's mana regeneration by 0.05.
 * https://dota2.gamepedia.com/Mana_regeneration */
function calculateManaRegen(baseIntelligence, heroLvl = 1, additionalHealthRegen) {
    var manaRegen = (parseInt(baseIntelligence) * 0.05) * heroLvl;
    if (additionalHealthRegen) {
        manaRegen += parseFloat(additionalHealthRegen);
    }
    return manaRegen.toFixed(2);
}

/// Returns the base number of the hero's primary attribute
function determinePrimaryAttribute(heroInfo) {
    switch(heroInfo.AttributePrimary) {
        case EAttributes.ATTR_STRENGTH:
            return parseInt(heroInfo.AttributeBaseStrength);
        case EAttributes.ATTR_AGILITY:
            return parseInt(heroInfo.AttributeBaseAgility);
        case EAttributes.ATTR_INTELLIGENCE:
            return parseInt(heroInfo.AttributeBaseIntelligence);
        default:
            return 0;
    }
}

// Calculates the main armor of the hero
function calcMainArmor(baseArmor, baseAgility, agiPerLevel, level) {
    // Determine bonus agility from perLevel. Then work out main armor
    var agiPer = (parseFloat(agiPerLevel) * level - 1);
    var mainArmor = parseInt(baseArmor) + ((parseInt(baseAgility) + agiPer) * 0.16);
    // Round to one decimal place
    return mainArmor.toFixed(1);
}

const BASE_HERO = DOTAHeroes.npc_dota_hero_base;

class Statistics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hero: props.hero,
            level: 1,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.hero !== this.props.hero) {
            this.setState({
                hero: this.props.hero,
            });
        }
    }

    render() {
        return (
            <Row>
                <Col md={6}>
                    <StatArray title="ATTACK" stats={[
                        { name: "attack speed", value: -1 },
                        { name: "damage", value: `${parse(this.state.hero.AttackDamageMin) + determinePrimaryAttribute(this.state.hero)} - ${parse(this.state.hero.AttackDamageMax) + determinePrimaryAttribute(this.state.hero)}` },
                        { name: "attack range", value: parse(this.state.hero.AttackRange) },
                        { name: "move speed", value: parse(this.state.hero.MovementSpeed) },
                        { name: "spell amp", value: -1 },
                        { name: "mana regen", value: calculateManaRegen(this.state.hero.AttributeBaseIntelligence, this.state.level, this.state.hero.StatusManaRegen) },
                    ]} />
                </Col>
                <Col md={6}>
                    <StatArray title="DEFENCE" stats={[
                        { name: "armor", value: calcMainArmor(this.state.hero.ArmorPhysical, this.state.hero.AttributeBaseAgility, this.state.hero.AttributeAgilityGain, this.state.level) },
                        { name: "physical resist", value: -1 },
                        { name: "magic resist", value: parse(BASE_HERO.MagicalResistance) },
                        { name: "status resist", value: -1 },
                        { name: "evasion", value: -1 },
                        { name: "health regen", value: calculateHealthRegen(this.state.hero.AttributeBaseStrength, this.state.level, this.state.hero.StatusHealthRegen) },
                    ]}/>
                </Col>
            </Row>
        );
    }
}

export default Statistics;