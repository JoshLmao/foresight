import React, { Component } from 'react';
import {
    Row,
    Col,
} from 'react-bootstrap';

import TalentTree from "../TalentTree";
import ItemsBar from '../ItemsBar/ItemsBar';
import Abilities from '../Abilities';
import HealthManaBar from "../HealthManaBar";

class EnemyHero extends Component {
    constructor(props) {
        super(props);

        this.state = {
            enemyHero: this.props.hero,
            enemyHeroName: this.props.heroName,
            heroTalents: this.props.heroTalents,
            heroAbilities: this.props.heroAbilities,
            selectedTalents: this.props.selectedTalents,
            heroItems: this.props.heroItems,
            heroNeutral: this.props.neutral,

            abilityStrings: this.props.abilityStrings,
            dotaStrings: this.props.dotaStrings,

            heroLevel: 0,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.hero !== this.props.hero) {
            this.setState({ enemyHero: this.props.hero });
        }
        if (prevProps.heroName !== this.props.heroName) {
            this.setState({ enemyHeroName: this.props.heroName });
        }
        if (prevProps.heroTalents !== this.props.heroTalents) {
            this.setState({ heroTalents: this.props.heroTalents });
        }
        if (prevProps.heroAbilities !== this.props.heroAbilities) {
            this.setState({ heroAbilities: this.props.heroAbilities });
        }
        if (prevProps.selectedTalents !== this.props.selectedTalents) {
            this.setState({ selectedTalents: this.props.selectedTalents });
        }
        if (prevProps.heroItems !== this.props.heroItems) {
            this.setState({ heroItems: this.props.heroItems });
        }
    }

    render() {
        return (
            <div>
                <Row>
                    <Col md={4}>
                        {this.state.enemyHeroName}
                    </Col>
                    <Col md={8}>
                        <HealthManaBar 
                                baseStrength ={ this.state.enemyHero?.AttributeBaseStrength }
                                strengthGain={ this.state.enemyHero?.AttributeStrengthGain } 
                                baseIntelligence={this.state.enemyHero?.AttributeBaseIntelligence }
                                intelligenceGain={ this.state.enemyHero?.AttributeIntelligenceGain }
                                heroLevel={ this.state.heroLevel } 
                                primaryAttribute={ this.state.enemyHero?.AttributePrimary }
                                bonusHealthRegen={ this.state.enemyHero?.StatusHealthRegen }
                                bonusManaRegen={ this.state.enemyHero?.StatusManaRegen } />
                    </Col>
                </Row>
                <Row className="">
                    {/* Talents */}
                    <Col md={5}>
                        <TalentTree
                            talents={this.state.heroTalents} 
                            selectedTalents={this.state.selectedTalents}
                            onTalentSelected={this.onTalentSelected} 
                            onTalentUnselected={this.onTalentUnselected} 
                            abilityStrings={this.state.abilityStrings} />
                    </Col>
                    {/* Abilities */}
                    
                    {/* Items */}
                    <Col md={5}>
                        <ItemsBar
                            items={this.state.heroItems}  
                            neutral={this.props.neutralItem}
                            onItemChanged={this.onItemSelected}
                            onNeutralChanged={this.onNeutralSelected} />
                    </Col>
                </Row>
                <Abilities 
                        abilities={this.state.heroAbilities}
                        items={this.state.heroItems}
                        neutral={this.props.neutralItem} 
                        selectedTalents={this.props.selectedTalents} 
                        abilityStrings={this.props.abilityStrings}
                        dotaStrings={this.state.dotaStrings} 
                        displayDamage={false} />
            </div>
        );
    }
}

export default EnemyHero;