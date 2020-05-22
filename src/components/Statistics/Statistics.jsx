import React, { Component } from 'react';
import {
    Row, Col
} from "react-bootstrap";

import { EAttributes } from "../../enums/attributes";

import {
    calculateHealthRegen,
    calculateManaRegen,
    calculateMainArmor,
    calculateSpellAmp,
    calculateStatusResist,
    calculateMagicResist,
    calculatePhysicalResist,
    calculateEvasion
} from "../../utility/calculate";

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

class Statistics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hero: props.hero,
            level: 1,
            talents: props.talents,
            items: props.items,
            neutral: props.neutral,
            abilities: props.abilities,
        };
    }

    componentDidMount() {
        this.setState({
            armor: calculateMainArmor(this.state.hero.ArmorPhysical, this.state.hero.AttributeBaseAgility, this.state.hero.AttributeAgilityGain, this.state.level)
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.hero !== this.props.hero) {
            this.setState({ 
                hero: this.props.hero, 
                armor: calculateMainArmor(this.state.hero.ArmorPhysical, this.state.hero.AttributeBaseAgility, this.state.hero.AttributeAgilityGain, this.state.level)
            });
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
                        { name: "spell amp", value: calculateSpellAmp(this.state.talents, this.state.items, this.state.neutral) + "%" },
                        { name: "mana regen", value: calculateManaRegen(this.state.hero.AttributeBaseIntelligence, this.state.level, this.state.hero.StatusManaRegen) },
                    ]} />
                </Col>
                <Col md={6}>
                    <StatArray title="DEFENCE" stats={[
                        { name: "armor", value: this.state.armor },
                        { name: "physical resist", value: calculatePhysicalResist(this.state.armor) + "%" },
                        { name: "magic resist", value: calculateMagicResist(this.state.items, this.state.neutral, this.state.abilities) + "%" },
                        { name: "status resist", value: calculateStatusResist(this.state.items, this.state.neutral) + "%" },
                        { name: "evasion", value: calculateEvasion(this.state.talents, this.state.items, this.state.abilities) + "%" },
                        { name: "health regen", value: calculateHealthRegen(this.state.hero.AttributeBaseStrength, this.state.level, this.state.hero.StatusHealthRegen) },
                    ]}/>
                </Col>
            </Row>
        );
    }
}

export default Statistics;