import React, { Component } from 'react';
import { 
    Button, 
    Form
} from 'react-bootstrap';
import { getLocalizedString } from '../../utility/data-helpers/language';

const MAX_LEVEL = 30;
const MIN_LEVEL = 1;

function ModifyBtn (props) {
    return (
        <Button 
            className="py-1"
            variant="outline-secondary" 
            onClick={props.onClick}>
            { props.text }
        </Button>
    );
}

class LevelSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            level: props.heroLevel,
            onHeroLevelChanged: props.onHeroLevelChanged,
            dotaStrings: props.dotaStrings,
        };

        this.onIncrementHeroLevel = this.onIncrementHeroLevel.bind(this);
        this.onDecrementHeroLevel = this.onDecrementHeroLevel.bind(this);
        this.onLvlInputChanged = this.onLvlInputChanged.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.heroLevel !== this.props.heroLevel) {
            this.setState({
                level: this.props.heroLevel,
            });
        }
        if (prevProps.dotaStrings !== this.props.dotaStrings) {
            this.setState({ dotaStrings: this.props.dotaStrings });
        }
    }

    onIncrementHeroLevel() {
        let newLevel = this.state.level;
        newLevel += 1;

        if (newLevel >= MAX_LEVEL) {
            newLevel = MAX_LEVEL;
        }

        this.state.onHeroLevelChanged(newLevel);
    }

    onDecrementHeroLevel() {
        let newLevel = this.state.level;
        newLevel -= 1;

        if (newLevel < MIN_LEVEL) {
            newLevel = MIN_LEVEL;
        }

        this.state.onHeroLevelChanged(newLevel);
    }

    onLvlInputChanged(e) {
        let lvl = parseInt(e.target.value);
        if (lvl) {
            if (lvl > MAX_LEVEL) {
                lvl = MAX_LEVEL;
            }
            else if (lvl < MIN_LEVEL) {
                lvl = MIN_LEVEL;
            }
        } else {
            lvl = MIN_LEVEL;
        }

        this.state.onHeroLevelChanged(lvl);
    }

    render() {
        return (
            <div className="mx-5">
                <h6>{ getLocalizedString(this.state.dotaStrings, "dota_stat_dropdown_level") }</h6>
                <div className="d-flex">
                    <ModifyBtn 
                        onClick={this.onDecrementHeroLevel} 
                        text="-" />
                    <Form.Control
                        className="mx-3" 
                        style={{ width: "75px" }}
                        placeholder="lvl" 
                        type="number" 
                        value={this.state.level} 
                        onChange={this.onLvlInputChanged} />
                    <ModifyBtn 
                        onClick={this.onIncrementHeroLevel} 
                        text="+" />
                </div>
            </div>
        );
    }
}

export default LevelSelector;