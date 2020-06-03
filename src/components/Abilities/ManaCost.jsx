import React, { Component } from 'react';
import { 
    calculateManaCost 
} from '../../utility/calculate';

class ManaCost extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ability: props.ability,
            abilityLevel: props.abilityLevel,

            items: props.items,
            neutral: props.neutral,
            selectedTalents: props.selectedTalents,
        };

        this.updateMana = this.updateMana.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                ability: this.props.ability,
                abilityLevel: this.props.abilityLevel,

                items: this.props.items,
                neutral: this.props.neutral,
                selectedTalents: this.props.selectedTalents,
            });
        }
    }

    updateMana() {
        let manaCost = -1;
        if (this.state.ability) {
            manaCost = calculateManaCost(this.state.ability, this.state.abilityLevel, this.state.items, this.state.neutral, this.state.selectedTalents);
        }
        
        // this.setState({
        //     abilityManaCost: manaCost,
        // });
        return manaCost;
    }

    render() {
        let manaCost = this.updateMana();
        return (
            <div>
                { 
                    manaCost &&
                        <div className="mana-cost d-flex">
                            <div className="my-auto mr-1" style={{ 
                                height: "10px",
                                width: "10px",
                                backgroundColor: "rgb(69, 148, 207)",
                            }}/>
                            <div>{ manaCost }</div>
                        </div>
                }
            </div>
        );
    }
}

export default ManaCost;