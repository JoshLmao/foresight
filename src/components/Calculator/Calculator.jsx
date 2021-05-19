import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Button,
    Form,
} from 'react-bootstrap';
import { connect } from "react-redux";
import copy from "copy-to-clipboard";
import { Base64 } from "js-base64";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faFile, faChevronUp, faChevronDown, faShare } from '@fortawesome/free-solid-svg-icons';

import {
    SELECTED_HERO,
    SELECTED_ITEM,
    SELECTED_NEUTRAL,
    SELECTED_BACKPACK_ITEM,
    SELECTED_TALENT,
    UNSELECTED_TALENT,
    NEW_HERO_LEVEL,
    ENEMY_SELECTED_TALENT, 
    SELECTED_ABILITY_LEVEL,
    SHARD_SET,
} from "../../constants/actionTypes";

import { 
    getLocalizedString
} from '../../utility/data-helpers/language';

import Abilities from "../Abilities";
import ItemsBar from "../ItemsBar";
import Attributes from "../Attributes";
import Statistics from "../Statistics";
import ChangeHeroBtn from "../ChangeHeroBtn";
import TalentTree from "../TalentTree";
import HealthManaBar from "../HealthManaBar";
import LevelSelector from "../LevelSelector";
import EnemyHero from '../EnemyHero';
import { 
    AghanimsUpgrades
} from '../Aghanims';

import "../../css/dota_hero_icons.css";
import "../../css/dota_attributes.css";
import "../../css/dota_items.css";
import "../../css/dota_hero_icons_big.css";
import "./Calculator.css";

class Calculator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            buildName: "",
            buildCreator: "",
            openBuildShare: false,
            loadedFromParams: false,
        };

        this.onHeroSelected = this.onHeroSelected.bind(this);
        this.onItemSelected = this.onItemSelected.bind(this);
        this.onNeutralSelected = this.onNeutralSelected.bind(this);
        this.onTalentSelected = this.onTalentSelected.bind(this);
        this.onTalentUnselected = this.onTalentUnselected.bind(this);
        this.onHeroLevelChanged = this.onHeroLevelChanged.bind(this);
        this.onAbilityLevelChanged = this.onAbilityLevelChanged.bind(this);
        this.onShardSet = this.onShardSet.bind(this);

        this.onShareBuild = this.onShareBuild.bind(this);
        this.onBuildNameChanged = this.onBuildNameChanged.bind(this);
        this.onBuildCreatorChanged = this.onBuildCreatorChanged.bind(this);
    }

    componentDidMount() {
        /// Parse build data from url on start and set app state
        if (this.props.location.search) {
            let params = new URLSearchParams(this.props.location.search);
            let buildData = params.get("build");
            if (buildData) {
                let decoded = Base64.decode(buildData);
                let buildObject = null;
                try {
                    buildObject = JSON.parse(decoded);
                } catch(e) {
                    console.error("Unable to parse build object");
                }

                if (buildObject) {
                    this.setState({
                        buildCreator: buildObject.creator,
                        buildName: buildObject.name,
                        openBuildShare: true,
                        loadedFromParams: true,
                    });
                    
                    let build = buildObject.build;
                    if (build?.selectedHeroName)
                        this.props.dispatch({ type: SELECTED_HERO, value: build.selectedHeroName });
                    if (build?.heroLevel)
                        this.props.dispatch({ type: NEW_HERO_LEVEL, value: build.heroLevel });
                    if (build?.selectedTalents) {
                        for(let talent of  build.selectedTalents) {
                            this.props.dispatch({ type: SELECTED_TALENT, value: talent });
                        }
                    }
                    if (build?.heroAbilityLevels) {
                        for (let abilLevel of build.heroAbilityLevels) {
                            this.props.dispatch({ type: SELECTED_ABILITY_LEVEL, value: abilLevel });
                        }
                    }
                    if (build?.items) {
                        for (let item of build.items) {
                            if (item.item) {
                                this.props.dispatch({ type: SELECTED_ITEM, value: item });
                            }
                        }
                    }
                    if (build?.neutralItem) {
                        this.props.dispatch({ type: SELECTED_NEUTRAL, value: build.neutralItem });
                    }
                }
            }
        }
    }

    onShareBuild() {
        let buildObject = {
            name: this.state.buildName ?? "Unknown",
            creator: this.state.buildCreator ?? "Unknown",
            build: {
                selectedHeroName: this.props.selectedHeroName,
                heroAbilities: this.props.heroAbilities,
                heroAbilityLevels: this.props.heroAbilityLevels,
                heroTalents: this.props.heroTalents,
                heroLevel: this.props.heroLevel,

                items: this.props.items,
                backpack: this.props.backpack,
                neutralItem: this.props.neutralItem,
                selectedTalents: this.props.selectedTalents,
            },
        };
        let str = JSON.stringify(buildObject);
        let encoded = Base64.encode(str);
        // set clipboard
        copy(`${window.location.href}?build=${encoded}`);
    }

    onHeroSelected(heroName) {
        console.log(`${SELECTED_HERO}: ${heroName}`);
        this.props.dispatch({ type: SELECTED_HERO, value: heroName });
    }

    onItemSelected (item) {
        if (item.isBackpack) 
        {
            console.log(`${SELECTED_BACKPACK_ITEM}: Slot: ${item.slot} Item: ${item.item}`);
            this.props.dispatch({ type: SELECTED_BACKPACK_ITEM, value: item });
        }
        else
        {
            let extraString = JSON.stringify(item.extra);
            console.log(`${SELECTED_ITEM}: Slot: ${item.slot} Item: ${item.item} ${ extraString !== "{}" ? `Extra: ${extraString}` : "" }`);
            this.props.dispatch({ type: SELECTED_ITEM, value: item });
        }
    }

    onNeutralSelected(neutralItem) {
        console.log(`${SELECTED_NEUTRAL}: ${neutralItem.item}`);
        this.props.dispatch({ type: SELECTED_NEUTRAL, value: neutralItem });
    }

    onTalentSelected (talent) {
        console.log(`${SELECTED_TALENT}: ${talent}`);
        this.props.dispatch({ type: SELECTED_TALENT, value: talent });
    }

    onTalentUnselected (talent) {
        console.log(`${UNSELECTED_TALENT}: ${talent}`);
        this.props.dispatch({ type: UNSELECTED_TALENT, value: talent });
    }

    onEnemyTalentSelected (enemy, talent) {
        console.log(`${ENEMY_SELECTED_TALENT}: ${enemy}, ${talent}`);
        this.props.dispatch({ type: ENEMY_SELECTED_TALENT, value: talent });
    }

    onHeroLevelChanged(newLevel) {
        //console.log(`${NEW_HERO_LEVEL}: ${newLevel}`);
        this.props.dispatch({ type: NEW_HERO_LEVEL, value: newLevel });
    }

    onAbilityLevelChanged (abilLvlInfo) {
        console.log(`${SELECTED_ABILITY_LEVEL}: Ability: ${abilLvlInfo.ability} Level: ${abilLvlInfo.level}`);
        this.props.dispatch({ type: SELECTED_ABILITY_LEVEL, value: abilLvlInfo });
    }

    onBuildNameChanged(e) {
        this.setState({ buildName: e.target.value });
    }

    onBuildCreatorChanged(e) {
        this.setState({ buildCreator: e.target.value });
    }

    onShardSet(isSet) {
        console.log(`${SHARD_SET}: Set: ${isSet}`)
        this.props.dispatch({ type: SHARD_SET, value: isSet });
    }

    render() {
        return (
            <div className="foresite-app-container">
                <Container className="app-main-content py-3" fluid="md">
                    {/* Top row, Inital Hero Information */}
                    <Row>
                        {/* Main Hero Info */}
                        <Col className="my-auto" md={3}>
                            <span 
                                className={`hero-icon-big hero-icon-big-${this.props.selectedHeroName}_png mx-3`}
                                height={50}
                                alt="hero banner" />
                            <div className="d-flex mt-3">
                                <h5 className="my-auto px-3">
                                    { getLocalizedString(this.props.dotaStrings, this.props.selectedHeroName) }
                                </h5>
                                <ChangeHeroBtn 
                                    onSelectHero={this.onHeroSelected}
                                    dotaStrings={this.props.dotaStrings} />
                            </div>
                        </Col>
                        {/* Small Stats */}
                        <Col md={3}>
                            <Attributes 
                                hero={this.props.selectedHero} 
                                heroLevel={this.props.heroLevel}
                                talents={this.props.selectedTalents}
                                items={this.props.items}
                                neutral={this.props.neutralItem} 
                                abilities={this.props.heroAbilities} 
                                abilityLevels={this.props.heroAbilityLevels}
                                
                                abilityStrings={this.props.abilityStrings}
                                dotaStrings={this.props.dotaStrings}/>
                        </Col>
                        {/* Final Attack/Defence Stats */}
                        <Col md={5}>
                            <Statistics 
                                hero={this.props.selectedHero} 
                                heroLevel={this.props.heroLevel}
                                talents={this.props.selectedTalents}
                                items={this.props.items}
                                neutral={this.props.neutralItem} 
                                abilities={this.props.heroAbilities} 
                                abilityLevels={this.props.heroAbilityLevels}

                                abilityStrings={this.props.abilityStrings}
                                dotaStrings={this.props.dotaStrings}  />
                        </Col>
                    </Row>

                    {/* Health/Mana and Hero Lvl  */}
                    <Row className="my-2 py-2">
                        <Col md={7}>
                            <HealthManaBar 
                                hero={this.props.selectedHero} 
                                heroLevel={this.props.heroLevel}
                                talents={this.props.selectedTalents}
                                items={this.props.items}
                                neutral={this.props.neutralItem} 
                                abilities={this.props.heroAbilities}
                                abilityLevels={this.props.heroAbilityLevels} />
                        </Col>
                        <Col md={4}>
                            <LevelSelector 
                                heroLevel={ this.props.heroLevel } 
                                onHeroLevelChanged={ this.onHeroLevelChanged }
                                dotaStrings={this.props.dotaStrings} />
                        </Col>
                        <Col md={1}>
                            <AghanimsUpgrades
                                hero={this.props.selectedHero} 
                                abilities={this.props.heroAbilities}
                                items={this.props.items}

                                dotaStrings={this.props.dotaStrings}
                                abilityStrings={this.props.abilityStrings}
                                
                                onShardSet={this.onShardSet}
                                />
                        </Col>
                    </Row>

                    {/* Items/Talent */}
                    <Row className="items-row my-4">
                        <Col md={7}>
                            <ItemsBar
                                items={this.props.items} 
                                backpack={this.props.backpack} 
                                neutral={this.props.neutralItem} 
                                onItemChanged={this.onItemSelected}
                                onNeutralChanged={this.onNeutralSelected} 
                                dotaStrings={this.props.dotaStrings}
                                abilityStrings={this.props.abilityStrings} />
                        </Col>
                        <Col md={5}>
                            <TalentTree
                                talents={this.props.heroTalents} 
                                selectedTalents={this.props.selectedTalents}
                                onTalentSelected={this.onTalentSelected} 
                                onTalentUnselected={this.onTalentUnselected} 
                                dotaStrings={this.props.dotaStrings}
                                abilityStrings={this.props.abilityStrings} />
                        </Col>
                    </Row>

                    {/* Abilities */}
                    <Abilities 
                        displayDamage={true}

                        heroName={this.props.selectedHeroName}
                        abilities={this.props.heroAbilities}
                        abilityLevels={this.props.heroAbilityLevels}
                        items={this.props.items}
                        neutral={this.props.neutralItem} 
                        selectedTalents={this.props.selectedTalents} 
                        shard={this.props.shard}

                        abilityStrings={this.props.abilityStrings}
                        dotaStrings={this.props.dotaStrings} 

                        onAbilityLevelChanged={this.onAbilityLevelChanged}
                        />

                    {/* Share Build */}
                    <div className="pb-4">
                        <Button 
                            className="d-flex py-2"
                            onClick={() => this.setState({ openBuildShare: !this.state.openBuildShare })}>
                            <h6 className="mx-1 mr-2 mb-0">Share</h6>
                            <FontAwesomeIcon className="my-auto" icon={this.state.openBuildShare ? faChevronUp : faChevronDown} />
                        </Button>
                        {
                            this.state.openBuildShare &&
                                <Row>
                                    <Col md={4}>
                                        <h4>Build Name</h4>
                                        {
                                            this.state.buildName && this.state.loadedFromParams 
                                            ?
                                            <Form.Control 
                                                className="foresight-input-control mr-2 ml-0"
                                                type="text" 
                                                placeholder="Build Name" 
                                                value={this.state.buildName} 
                                                plaintext
                                                readonly />
                                            :
                                            <Form.Control 
                                                className="foresight-input-control mr-2 ml-0"
                                                type="text" 
                                                placeholder="Build Name" 
                                                onChange={this.onBuildNameChanged} />
                                        }
                                    </Col>
                                    <Col md={4}>
                                        <h4>Creator</h4>
                                        {
                                            this.state.buildCreator && this.state.loadedFromParams
                                            ?
                                            <Form.Control 
                                                className="foresight-input-control mr-2 ml-0"
                                                type="text" 
                                                placeholder="Creator" 
                                                value={this.state.buildCreator} 
                                                plaintext
                                                readonly />
                                            :
                                            <Form.Control 
                                                className="foresight-input-control mr-2 ml-0"
                                                type="text" 
                                                placeholder="Creator" 
                                                onChange={this.onBuildCreatorChanged} />
                                        }
                                    </Col>
                                    <Col md={4}>
                                        <div className="d-flex my-auto h-100">
                                            <Button className="mr-1 my-auto" onClick={this.onShareBuild}>
                                                <FontAwesomeIcon icon={faShare} />
                                            </Button>
                                            <div className="my-auto">Share this build!</div>
                                        </div>
                                    </Col>
                                </Row>
                        }
                    </div>

                    {/* Padding Separator */}
                    {/* <div className="py-5" /> */}
                    
                    {/* Enemy Hero */}
                    {/* <EnemyHero 
                        hero={this.props.selectedEnemyHero}
                        heroName={this.props.selectedEnemyHeroName} 
                        heroAbilities={this.props.enemyHeroAbilities} 
                        heroItems={this.props.enemyHeroItems}
                        heroTalents={this.props.enemyHeroTalents} 
                        selectedTalents={this.props.selectedEnemyTalents}
                        neutral={this.props.enemyNeutralItem}
                        abilityStrings={this.props.abilityStrings} 
                        dotaStrings={this.props.dotaStrings} /> */}
                </Container>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    selectedHero: state.hero.selectedHero,
    selectedHeroName: state.hero.selectedHeroName,
    
    heroAbilities: state.hero.heroAbilities,
    heroAbilityLevels: state.hero.heroAbilityLevels,

    heroTalents: state.hero.heroTalents,
    heroLevel: state.hero.heroLevel,

    items: state.hero.items,
    backpack: state.hero.backpack,
    neutralItem: state.hero.neutralItem,
    selectedTalents: state.hero.selectedTalents,

    shard: state.hero.shard,

    abilityStrings: state.language.stringsAbilities,
    dotaStrings: state.language.stringsDota,

    selectedEnemyHero: state.enemy.selectedEnemyHero,
    selectedEnemyHeroName: state.enemy.selectedEnemyHeroName,
    enemyHeroTalents: state.enemy.enemyHeroTalents,
    enemyHeroAbilities: state.enemy.enemyHeroAbilities,
    selectedEnemyTalents: state.enemy.selectedEnemyTalents,
    enemyHeroItems: state.enemy.enemyHeroItems,
});

export default connect(mapStateToProps)(Calculator);