import React, { Component } from 'react';
import {
    Row,
    Col
} from "react-bootstrap";

import {
    getTalentInfoFromName,
} from "../../utility/dataHelperTalents";
import { 
    tryGetTalentLocalizedString
} from "../../utility/data-helpers/language";

function isTalentSelected (selectedTalents, talent) {
    return selectedTalents?.includes(talent);
}

class TalentRow extends Component {
    constructor(props){
        super(props);

        this.state = {
            leftTalent: props.leftTalent,
            rightTalent: props.rightTalent,
            level: props.lvl,

            selectedTalents: this.props.selectedTalents,
            onTalentSelected: this.props.onTalentSelected,
            onTalentUnselected: this.props.onTalentUnselected,

            abilityStrings: this.props.abilityStrings,
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

        if (prevProps.selectedTalents !== this.props.selectedTalents) {
            this.setState({ selectedTalents: this.props.selectedTalents });
        }

        if (prevProps.abilityStrings !== this.props.abilityStrings) {
            this.setState({ abilityStrings: this.props.abilityStrings });
        }
    }

    onSelectTalent(e) {
        var selectedTalent = e.target.dataset.talent;
        // if clicked twice, unselect the talent
        if (isTalentSelected(this.state.selectedTalents, selectedTalent)) {
            this.state.onTalentUnselected(selectedTalent);
        } else {
            this.state.onTalentSelected(selectedTalent);
        }
    }

    getTalentDisplayName (talent) {
        let talentInfo = getTalentInfoFromName(talent);
        if (!talentInfo) {
            return "Unknown Talent";
        }

        let displayName = tryGetTalentLocalizedString(this.state.abilityStrings, talent);
        if (displayName && talentInfo && talentInfo.AbilitySpecial) {
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
                    style={{ color: isTalentSelected(this.state.selectedTalents, this.state.leftTalent) ? "#c4a66f" : "white" }}>
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
                    style={{ color: isTalentSelected(this.state.selectedTalents, this.state.rightTalent) ? "#c4a66f" : "white" }}>
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
