import React, { Component } from 'react';
import {
    Row, Col
} from "react-bootstrap";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    calculateAttackRange,
    calculateTotalLifesteal,
    calculateTotalCleaveDmgPercent,
    calculateCritPercent,
    calculateTotalSpellLifesteal,
    calculateCritChancePercent
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
function formatAttackMinMax(hero, lvl, items, neutral, abilities, talents, abilityLevels) {
    let standardAtkDmg = calculateRightClickDamage(hero, lvl, items, neutral, abilities, talents, abilityLevels);
    
    // Range string
    //let dmgString = `${standardAtkDmg.min} - ${standardAtkDmg.max}`;
    // Average damage inbetween range value
    let dmgString = standardAtkDmg.average;
    if (standardAtkDmg.additional) {
        dmgString += " ";
        dmgString += `${ standardAtkDmg.additional >= 0 ? "+" : "-" } ${Math.abs(standardAtkDmg.additional)}`;
    }
    return dmgString;
}

/// Gets the atk time and formats it to display in UI
function formatAttackTime(hero, lvl, items, neutral, abilities, talents, abilityLevels) {
    let attackInfo = calculateAttackTime(hero, lvl, items, neutral, abilities, talents, abilityLevels);
    return `${attackInfo.attackSpeed} (${attackInfo.attackTime} s)`;
}

/// Format a total value and additional value into a string,
/// hiding and displaying the correct sign if additional value is +/- or 0
function formatTotalAdditional (total, additional, toFixedAmt = -1) {
    if (total == null) {
        return null;
    }

    let val = total;
    // Convert to fixed decimal place if value given
    if (toFixedAmt >= 0) {
        val = total.toFixed(toFixedAmt)
    }
    // If additional value, append "+{value}"
    if (additional && additional > 0) {
        let additionalValue = additional;
        // If to fixed decimal place, do it
        if (toFixedAmt >= 0) {
            additionalValue = Math.abs(additionalValue.toFixed(toFixedAmt));
        }

        // Append space with formatting
        val += " ";
        val += `${additional > 0 ? "+" : "-"} ${additionalValue}`;
    }

    return val;
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
            abilityLevels: props.abilityLevels,

            dotaStrings: props.dotaStrings,
            abilityStrings: props.abilityStrings,

            otherOpen: false,
        };

        this.updateStatistics = this.updateStatistics.bind(this);
        this.onToggleOtherDetails = this.onToggleOtherDetails.bind(this);
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
        if (prevProps.abilityLevels !== this.props.abilityLevels) {
            this.setState({ 
                abilityLevels: this.props.abilityLevels, 
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

    onToggleOtherDetails () {
        this.setState({
            otherOpen: !this.state.otherOpen,
        });
    }

    updateStatistics() {
        let armorInfo =  calculateMainArmor(this.state.hero, this.state.level, this.state.items, this.state.neutral, this.state.abilities, this.state.talents, this.state.abilityLevels);
        let physResist = calculatePhysicalResist(armorInfo.armor + armorInfo.additional);
        let moveSpeedInfo = calculateMoveSpeed(this.state.hero, this.state.items, this.state.neutral, this.state.abilities, this.state.talents);
        this.setState({
            // Attack
            attackSpeed: formatAttackTime(this.state.hero, this.state.level, this.state.items, this.state.neutral, this.state.abilities, this.state.talents, this.state.abilityLevels),
            damage: formatAttackMinMax(this.state.hero, this.state.level, this.state.items, this.state.neutral, this.state.abilities, this.state.talents, this.state.abilityLevels),
            attackRange: calculateAttackRange(this.state.hero, this.state.level, this.state.items, this.state.neutral, this.state.abilities, this.state.talents, this.state.abilityLevels),
            moveSpeed: formatTotalAdditional(moveSpeedInfo?.baseSpeed, moveSpeedInfo?.additional),
            spellAmp: calculateTotalSpellAmp(this.state.talents, this.state.items, this.state.neutral),
            manaRegen: calculateManaRegen(this.state.hero, this.state.level, this.state.items, this.state.neutral, this.state.abilities, this.state.talents, this.state.abilityLevels),

            // Defence
            armor: formatTotalAdditional(armorInfo?.armor, armorInfo?.additional, 2),
            physicalResist: physResist,
            magicResist: calculateMagicResist(this.state.items, this.state.neutral, this.state.abilities, this.state.talents, this.state.abilityLevels),
            statusResist: calculateStatusResist(this.state.items, this.state.neutral),
            evasion: calculateEvasion(this.state.items, this.state.neutral, this.state.abilities , this.state.talents, this.state.abilityLevels),
            healthRegen: calculateHealthRegen(this.state.hero, this.state.level, this.state.items, this.state.neutral, this.state.abilities, this.state.talents),

            // Other
            totalLifesteal: calculateTotalLifesteal(this.state.items, this.state.neutral, this.state.abilities, this.state.talents, this.state.abilityLevels),
            totalSpellLifesteal: calculateTotalSpellLifesteal(this.state.items, this.state.neutral, this.state.abilities, this.state.talents),
            totalCleaveAmount: calculateTotalCleaveDmgPercent(this.state.hero, this.state.items, this.state.neutral, this.state.abilities, this.state.talents),
            totalCritPercent: calculateCritPercent(this.state.items, this.state.neutral, this.state.abilities, this.state.talents, this.state.abilityLevels),
            totalCritChancePercent: calculateCritChancePercent(this.state.items, this.state.neutral, this.state.abilities, this.state.talents, this.state.abilityLevels),
            totalCooldownAmount: 0,
        });
    }

    render() {
        return (
            <div>
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
                                    value: formatTotalAdditional(this.state.healthRegen?.total, this.state.healthRegen?.additional, 2),
                                },
                            ]}/>
                        </Col>
                    }
                </Row>
                <FontAwesomeIcon 
                        icon={this.state.otherOpen ? faEyeSlash : faEye} 
                        onClick={this.onToggleOtherDetails} />
                <Row className="my-1">
                    <Col className={!this.state.otherOpen ? "collapse" : ""}>
                        <StatArray title={getLocalizedString(this.state.dotaStrings, "DOTA_OtherType").toUpperCase()} stats={[
                            {
                                name: getLocalizedString(this.state.dotaStrings, "DOTA_SHOP_TAG_LIFESTEAL"),
                                value: this.state.totalLifesteal + "%",
                            },
                            {
                                name: getLocalizedString(this.state.abilityStrings, "DOTA_Tooltip_ability_special_bonus_spell_lifesteal_6").split("% ")[1],
                                value: `${getLocalizedString(this.state.dotaStrings, "DOTA_Scoreboard_Header_Hero")}: ${this.state.totalSpellLifesteal?.heroLifesteal + "%"}
                                        ${getLocalizedString(this.state.dotaStrings, "npc_dota_creep")}: ${this.state.totalSpellLifesteal?.creepLifesteal + "%"}`,
                            },
                            {
                                name: "Critical Strike Amount",
                                value: this.state.totalCritPercent + "%",
                            },
                            {
                                name: "Critical Strike Chance",
                                value: this.state.totalCritChancePercent + "%",
                            },
                            {
                                name: "Cleave Damage Amount",
                                value: this.state.totalCleaveAmount + "%",
                            },
                            // {
                            //     name: "Total Cooldown Amount",
                            //     value: this.state.totalCooldownAmount + "%",
                            // }
                        ]} 
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Statistics;