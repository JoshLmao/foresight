import React, { Component } from 'react';

import TalentRow from "./TalentRow";
import { getLocalizedString } from '../../utility/data-helpers/language';

class TalentTree extends Component {
    constructor(props) {
        super(props);

        this.state = {
            talents: this.props.talents,
            selectedTalents: this.props.selectedTalents,

            onTalentSelected: this.props.onTalentSelected,
            onTalentUnselected: this.props.onTalentUnselected,

            dotaStrings: this.props.dotaStrings,
            abilityStrings: this.props.abilityStrings,
        };
        this.findSelectedTalent = this.findSelectedTalent.bind(this);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.talents !== this.props.talents) {
            this.setState({ talents: this.props.talents });
        }
        if (prevProps.selectedTalents !== this.props.selectedTalents) {
            this.setState({ selectedTalents: this.props.selectedTalents });
        }
        if (prevProps.abilityStrings !== this.props.abilityStrings) {
            this.setState({ abilityStrings: this.props.abilityStrings });
        }
        if (prevProps.dotaStrings !== this.props.dotaStrings) {
            this.setState({ dotaStrings: this.props.dotaStrings });
        }
    }

    findSelectedTalent(leftTalent, rightTalent) {
        if (this.state.selectedTalents && this.state.selectedTalents.length > 0) {
            let matchTalent = this.state.selectedTalents.find((val) => {
                if (val.name === leftTalent) {
                    return leftTalent;
                } else if (val.name === rightTalent) {
                    return rightTalent;
                }
                return null;
            });
            return matchTalent?.name;
        }

        return null;
    }

    render() {
        return (
            <div>
                <h6 className="text-center">{ getLocalizedString(this.state.dotaStrings, "DOTA_StatBranch_TooltipTitle") }</h6>
                {/* <img src="/images/dota2/talent.jpg" alt="talent tree" /> */}
                <div 
                    className="mr-2"
                    style={{ fontSize: "0.8rem" }}>
                        {
                            this.state.talents && this.state.talents.map((talentInfo) => {
                                return <TalentRow 
                                                key={talentInfo.lvl}
                                                lvl={talentInfo.lvl}
                                                leftTalent={talentInfo.leftTalent} 
                                                rightTalent={talentInfo.rightTalent} 
                                                selectedTalents={this.state.selectedTalents}
                                                onTalentSelected={this.state.onTalentSelected}
                                                onTalentUnselected={this.state.onTalentUnselected} 
                                                
                                                abilityStrings={this.state.abilityStrings} />
                            })
                        }
                </div>
            </div>
        );
    }
}

export default TalentTree;