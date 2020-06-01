import React, { Component } from 'react';
import {
    Row, Col
} from "react-bootstrap";

import {
    calculateHealthRegen,
    calculateManaRegen,
    calculateMainArmor,
    calculateTotalSpellAmp,
    calculateStatusResist,
    calculateMagicResist,
    calculatePhysicalResist,
    calculateEvasion,
    calculateRightClickDamage,
    calculateAttackTime
} from "../../utility/calculate";
import { 
    getPrimaryAttributeStats,
    getSpecificAttributeStats,
    getDotaBaseHero
} from '../../utility/dataHelperHero';
import { EAttributes } from '../../enums/attributes';

function parse(value) {
    return parseInt(value);
}

function StatArray(props) {
    return (
        <div style={{ backgroundColor: "#171717", color: "white", fontSize: "0.8rem" }} className="p-2 h-100">
            <h6 className="ml-auto">{props.title}</h6>
            {
                props.stats &&
                    props.stats.map((value) => {
                        return (<Row key={value.name}>
                            <Col md={6}>
                                {value.name}
                            </Col>
                            <Col md={6}>
                                {value.value}
                            </Col>
                        </Row>
                        );
                    })
            }
        </div>
    );
}

function formatAttackMinMax(heroInfo, lvl) {
    var minMax = calculateRightClickDamage(heroInfo.AttackDamageMin, heroInfo.AttackDamageMax, getPrimaryAttributeStats(heroInfo), lvl );
    return `${minMax.min} - ${minMax.max}`;
}

function formatAttackTime(heroInfo, lvl) {
    var attackSpeed = getDotaBaseHero()?.BaseAttackSpeed;
    var attackRate = getDotaBaseHero()?.AttackRate;
    if (heroInfo) {
        // Check if hero has different attack rate or attack speed
        if (heroInfo.BaseAttackSpeed) {
            attackSpeed = heroInfo.BaseAttackSpeed;
        } 
        if (heroInfo.AttackSpeed) {
            attackRate = heroInfo.AttackSpeed;
        }
    }
    
    var agilityAttribute = getSpecificAttributeStats(EAttributes.ATTR_AGILITY, heroInfo);

    var attackInfo = calculateAttackTime(attackSpeed, attackRate, agilityAttribute?.base, agilityAttribute?.perLevel, lvl);
    return `${attackInfo.attackSpeed} (${attackInfo.attackTime} s)`;
}

class Statistics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hero: props.hero,
            level: props.heroLevel,
            talents: props.talents,
            items: props.items,
            neutral: props.neutral,
            abilities: props.abilities,
        };

        this.updateArmor = this.updateArmor.bind(this);
    }

    componentDidMount() {
        this.updateArmor();
    }

    updateArmor(lvl = undefined) {
        this.setState({ armor: calculateMainArmor(this.state.hero.ArmorPhysical, this.state.hero.AttributeBaseAgility, this.state.hero.AttributeAgilityGain, lvl ? lvl : this.state.level) })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.hero !== this.props.hero) {
            this.setState({ hero: this.props.hero });
            this.updateArmor();
        }
        if (prevProps.items !== this.props.items) {
            this.setState({ items: this.props.items });
        }
        if (prevProps.neutral !== this.props.neutral) {
            this.setState({ neutral: this.props.neutral, });
        }
        if (prevProps.talents !== this.props.talents) {
            this.setState({ talents: this.props.talents });
        }
        if (prevProps.abilities !== this.props.abilities) {
            this.setState({ abilities: this.props.abilities });
        }
        if (prevProps.heroLevel !== this.props.heroLevel) {
            this.setState({ level: this.props.heroLevel });
            // Pass value since setState isn't executed yet
            this.updateArmor(this.props.heroLevel);
        }
    }

    render() {
        return (
            <Row>
                <Col md={6}>
                    <StatArray title="ATTACK" stats={[
                        { name: "attack speed", value: formatAttackTime(this.state.hero, this.state.level) },
                        { name: "damage", value: formatAttackMinMax(this.state.hero, this.state.level) },
                        { name: "attack range", value: parse(this.state.hero.AttackRange) },
                        { name: "move speed", value: parse(this.state.hero.MovementSpeed) },
                        { name: "spell amp", value: calculateTotalSpellAmp(this.state.talents, this.state.items, this.state.neutral) + "%" },
                        { name: "mana regen", value: calculateManaRegen(this.state.hero.AttributeBaseIntelligence, this.state.hero.AttributeIntelligenceGain, this.state.hero.StatusManaRegen, this.state.level) },
                    ]} />
                </Col>
                <Col md={6}>
                    <StatArray title="DEFENCE" stats={[
                        { name: "armor", value:  this.state.armor },
                        { name: "physical resist", value: calculatePhysicalResist(this.state.armor) + "%" },
                        { name: "magic resist", value: calculateMagicResist(this.state.items, this.state.neutral, this.state.abilities) + "%" },
                        { name: "status resist", value: calculateStatusResist(this.state.items, this.state.neutral) + "%" },
                        { name: "evasion", value: calculateEvasion(this.state.talents, this.state.items, this.state.abilities) + "%" },
                        { name: "health regen", value: calculateHealthRegen(this.state.hero.AttributeBaseStrength, this.state.hero.AttributeStrengthGain, this.state.hero.StatusHealthRegen, this.state.level) },
                    ]}/>
                </Col>
            </Row>
        );
    }
}

export default Statistics;