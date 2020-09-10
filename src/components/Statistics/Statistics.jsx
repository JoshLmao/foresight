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
    calculateAttackTime,
    calculateMoveSpeed,
    calculateAttackRange
} from "../../utility/calculate";
import {
    getLocalizedString
} from "../../utility/data-helpers/language";

function StatArray(props) {
    return (
        <div style={{ backgroundColor: "#171717", color: "white", fontSize: "0.8rem" }} className="p-2 h-100">
            <h6 className="ml-auto">{props.title}</h6>
            {
                props.stats &&
                    props.stats.map((value) => {
                        return (
                        <Row 
                            key={value.name}
                            className="mx-0">
                            <Col 
                                md={6}
                                className="px-0">
                                {value.name}
                            </Col>
                            <Col 
                                md={6}
                                className="px-0">
                                {value.value}
                            </Col>
                        </Row>
                        );
                    })
            }
        </div>
    );
}

/// Gets the attack min/max and formats it for display in UI
function formatAttackMinMax(hero, lvl, items, neutral, abilities, talents) {
    let standardAtkDmg = calculateRightClickDamage(hero, lvl, items, neutral, abilities, talents);
    
    // Range string
    //let dmgString = `${standardAtkDmg.min} - ${standardAtkDmg.max}`;
    // Average damage inbetween range value
    let dmgString = standardAtkDmg.min + ((standardAtkDmg.max - standardAtkDmg.min) / 2);
    if (standardAtkDmg.additional) {
        dmgString += " ";
        dmgString += `${ standardAtkDmg.additional >= 0 ? "+" : "-" } ${Math.abs(standardAtkDmg.additional)}`;
    }
    return dmgString;
}

/// Gets the atk time and formats it to display in UI
function formatAttackTime(hero, lvl, items, neutral, abilities, talents) {
    let attackInfo = calculateAttackTime(hero, lvl, items, neutral, abilities, talents);
    return `${attackInfo.attackSpeed} (${attackInfo.attackTime} s)`;
}

function formatArmor (armorInfo) {
    if (!armorInfo || !armorInfo?.armor) {
        return null;
    }

    let str = armorInfo.armor.toFixed(1);
    if (armorInfo.additional) {
        str += " ";
        str += `${armorInfo.additional > 0 ? "+" : "-"} ${Math.abs(armorInfo.additional)}`;
    }

    return str;
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

            dotaStrings: props.dotaStrings,
            abilityStrings: props.abilityStrings,
        };

        this.updateStatistics = this.updateStatistics.bind(this);
    }

    componentDidMount() {
        this.updateStatistics();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.hero !== this.props.hero) {
            this.setState({ 
                hero: this.props.hero 
            }, () => {
                this.updateStatistics();
            });
        }
        if (prevProps.items !== this.props.items) {
            this.setState({ 
                items: this.props.items 
            }, () => {
                this.updateStatistics();
            });
        }
        if (prevProps.neutral !== this.props.neutral) {
            this.setState({ 
                neutral: this.props.neutral, 
            }, () => {
                this.updateStatistics();
            });
        }
        if (prevProps.talents !== this.props.talents) {
            this.setState({ 
                talents: this.props.talents 
            }, () => {
                this.updateStatistics();
            });
        }
        if (prevProps.abilities !== this.props.abilities) {
            this.setState({ 
                abilities: this.props.abilities 
            }, () => {
                this.updateStatistics();
            });
        }
        if (prevProps.heroLevel !== this.props.heroLevel) {
            this.setState({ 
                level: this.props.heroLevel 
            }, () => {
                this.updateStatistics();
            });
        }
        if (prevProps.dotaStrings !== this.props.dotaStrings) {
            this.setState({ dotaStrings: this.props.dotaStrings });
        }
        if (prevProps.abilityStrings !== this.props.abilityStrings) {
            this.setState({ abilityStrings: this.props.abilityStrings });
        }
    }

    updateStatistics() {
        let armorInfo =  calculateMainArmor(this.state.hero, this.state.level, this.state.items, this.state.neutral, this.state.abilities, this.state.talents);
        let physResist = calculatePhysicalResist(armorInfo.armor + armorInfo.additional);
        this.setState({
            // Attack
            attackSpeed: formatAttackTime(this.state.hero, this.state.level, this.state.items, this.state.neutral, this.state.abilities, this.state.talents),
            damage: formatAttackMinMax(this.state.hero, this.state.level, this.state.items, this.state.neutral, this.state.abilities, this.state.talents),
            attackRange: calculateAttackRange(this.state.hero, this.state.level, this.state.items, this.state.neutral, this.state.abilities, this.state.talents),
            moveSpeed: calculateMoveSpeed(this.state.hero, this.state.items, this.state.neutral, this.state.abilities, this.state.talents),
            spellAmp: calculateTotalSpellAmp(this.state.talents, this.state.items, this.state.neutral),
            manaRegen: calculateManaRegen(this.state.hero, this.state.level, this.state.items, this.state.neutral, this.state.abilities, this.state.talents),

            // Defence
            armor: formatArmor(armorInfo),
            physicalResist: physResist,
            magicResist: calculateMagicResist(this.state.items, this.state.neutral, this.state.abilities),
            statusResist: calculateStatusResist(this.state.items, this.state.neutral),
            evasion: calculateEvasion(this.state.items, this.state.neutrak, this.state.abilities , this.state.talents),
            healthRegen: calculateHealthRegen(this.state.hero, this.state.level, this.state.items, this.state.neutral, this.state.abilities, this.state.talents),
        });
    }

    render() {
        return (
            <Row>
                {
                    this.state.hero &&
                    <Col md={6}>
                        <StatArray title={getLocalizedString(this.state.dotaStrings, "DOTA_HUD_Attack")} stats={[
                            { 
                                name: getLocalizedString(this.state.dotaStrings, "DOTA_HUD_AttackSpeed"),
                                value: this.state.attackSpeed
                            },
                            { 
                                name: getLocalizedString(this.state.dotaStrings, "DOTA_HUD_Damage"), 
                                value: this.state.damage 
                            },
                            { 
                                name: getLocalizedString(this.state.dotaStrings, "DOTA_HUD_AttackRange"), 
                                value: this.state.attackRange 
                            },
                            { 
                                name: getLocalizedString(this.state.dotaStrings, "DOTA_HUD_MoveSpeed"), 
                                value: this.state.moveSpeed 
                            },
                            { 
                                name: getLocalizedString(this.state.dotaStrings, "DOTA_HUD_SpellAmp"), 
                                value: this.state.spellAmp + "%" 
                            },
                            { 
                                name: getLocalizedString(this.state.dotaStrings, "DOTA_HUD_ManaRegenDetail"), 
                                value: this.state.manaRegen 
                            },
                        ]} />
                    </Col>
                }   
                {
                    this.state.hero &&
                    <Col md={6}>
                        <StatArray title={getLocalizedString(this.state.dotaStrings, "DOTA_HUD_Defense")} stats={[
                            { 
                                name: getLocalizedString(this.state.dotaStrings, "DOTA_HUD_Armor"), 
                                value: this.state.armor,
                            },
                            { 
                                name: getLocalizedString(this.state.dotaStrings, "DOTA_HUD_PhysicalResist"), 
                                value: this.state.physicalResist + "%" 
                            },
                            { 
                                name: getLocalizedString(this.state.dotaStrings, "DOTA_HUD_MagicResist"), 
                                value: this.state.magicResist + "%" 
                            },
                            { 
                                name: getLocalizedString(this.state.dotaStrings, "DOTA_HUD_StatusResist"), 
                                value: this.state.statusResist + "%" 
                            },
                            { 
                                name: getLocalizedString(this.state.dotaStrings, "DOTA_HUD_Evasion"), 
                                value: this.state.evasion + "%" 
                            },
                            { 
                                name: getLocalizedString(this.state.dotaStrings, "DOTA_HUD_HealthRegenDetail"), 
                                value: this.state.healthRegen 
                            },
                        ]}/>
                    </Col>
                }
            </Row>
        );
    }
}

export default Statistics;