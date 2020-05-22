import React, { Component } from 'react';

import TalentRow from "./TalentRow";

class TalentTree extends Component {
    constructor(props) {
        super(props);

        this.state = {
            talents: this.props.talents,
            selectedTalents: this.props.selectedTalents,

            onTalentSelected: this.props.onTalentSelected,
        };
        this.findSelectedTalent = this.findSelectedTalent.bind(this);
    }

    componentDidUpdate(prevProps) {
        if(prevProps.talents !== this.props.talents) {
            this.setState({
                talents: this.props.talents,
            });
        }

        if (prevProps.selectedTalents !== this.props.selectedTalents) {
            this.setState({ selectedTalents: this.props.selectedTalents });
        }
    }

    findSelectedTalent(leftTalent, rightTalent) {
        if (this.state.selectedTalents && this.state.selectedTalents.length > 0) {
            var matchTalent = this.state.selectedTalents.find((val) => {
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
                <h6 className="text-center">TALENT TREE</h6>
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
                                                selectedTalent={this.findSelectedTalent(talentInfo.leftTalent, talentInfo.rightTalent)}
                                                onTalentSelected={this.state.onTalentSelected}/>
                            })
                        }
                </div>
            </div>
        );
    }
}

export default TalentTree;