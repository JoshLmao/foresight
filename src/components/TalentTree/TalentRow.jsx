import React, { Component } from 'react';
import {
    Row,
    Col
} from "react-bootstrap";

import { DOTAAbilities } from "../../data/dota2/json/npc_abilities.json";
import { lang as EnglishStrings } from "../../data/dota2/languages/abilities_english.json";

class TalentRow extends Component {
    constructor(props){
        super(props);

        this.state = {
            leftTalent: props.leftTalent,
            rightTalent: props.rightTalent,
            level: props.lvl,

            selectedTalent: props.selectedTalent,
            onTalentSelected: this.props.onTalentSelected,
        };

        this.onSelectTalent = this.onSelectTalent.bind(this);
        this.getTalentDisplayName = this.getTalentDisplayName.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.leftTalent !== this.props.leftTalent) {
            this.setState({ leftTalent: this.props.leftTalent });
        }

        if(prevProps.rightTalent !== this.props.rightTalent) {
            this.setState({ rightTalent: this.props.rightTalent });
        }

        if (prevProps.lvl !== this.props.lvl) {
            this.setState({ level: this.props.lvl });
        }

        if (prevProps.selectedTalent !== this.props.selectedTalent) {
            this.setState({ selectedTalent: this.props.selectedTalent });
        }
    }

    onSelectTalent(e) {
        var selectedTalent = e.target.dataset.talent;
        // if clicked twice, unselect the talent
        if (this.state.selectedTalent === selectedTalent) {
            selectedTalent = null;
        }

        this.state.onTalentSelected({ 
            level: this.state.level,
            name: selectedTalent,
        });
    }

    getTalentDisplayName (talent) {
        var englishKeys = Object.keys(EnglishStrings.Tokens);
        var finalKey = englishKeys.filter((key) => {
            if (key.includes(talent)) {
                return key;
            }
            return null;
        });

        var talentInfo = DOTAAbilities[talent];
        var displayName = EnglishStrings.Tokens[finalKey[0]];
        if (talentInfo && talentInfo.AbilitySpecial) {
            displayName = displayName.replace('{s:value}', talentInfo.AbilitySpecial[0].value);
        }

        return displayName;
    }

    render() {
        return (
            <Row className="my-1 py-2" style={{ backgroundColor: "rgb(24, 30, 33)"}}>
                {/* Left Talent */}
                <Col 
                    md={5}
                    className="text-center"
                    style={{ color: this.state.leftTalent === this.state.selectedTalent ? "#c4a66f" : "white" }}>
                    <div onClick={this.onSelectTalent} data-talent={this.state.leftTalent}>
                        {
                            this.getTalentDisplayName(this.state.leftTalent)
                        }
                    </div>
                </Col>
                {/* Talent Level */}
                <Col md={2}>
                    <h6 
                        className="text-center"
                        style={{ color: "#e7d291"}}>
                        {this.state.level}
                    </h6>
                </Col>
                {/* Right Talent */}
                <Col 
                    md={5}
                    className="text-center"
                    style={{ color: this.state.rightTalent === this.state.selectedTalent ? "#c4a66f" : "white" }}>
                    <div onClick={this.onSelectTalent} data-talent={this.state.rightTalent}>
                        {
                            this.getTalentDisplayName(this.state.rightTalent)
                        }
                    </div>
                </Col>
            </Row>
        );
    }
}

export default TalentRow;
