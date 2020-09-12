import React, { Component } from 'react';
import {
    Button
} from "react-bootstrap";
import Popup from "reactjs-popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

import HeroSelector from "./HeroSelector";

class ChangeHeroBtn extends Component {
    constructor(props){
        super(props);

        this.state = {
            onSelectHero: props.onSelectHero,
            dotaStrings: props.dotaStrings,

            heroSelectorDisabled: false,
        };

        this.onSelectHero = this.onSelectHero.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                dotaStrings: this.props.dotaStrings,
                onSelectHero: this.props.onSelectHero,
            });
        }
    }

    onSelectHero (e) {
        // Disable popup to force close
        this.setState({
            heroSelectorDisabled: true,
        });

        let hero = e.target.dataset.hero;
        this.state.onSelectHero(hero);
    }

    render() {
        // If last render popup was force disabled to close, then flip to false
        // to allow reopening 
        if (this.state.heroSelectorDisabled) {
            this.setState({ heroSelectorDisabled: false });
        }

        return (
            <div>
                <Popup 
                    trigger={isOpen => (
                        <Button onClick={this.onToggleHeroSelect}><FontAwesomeIcon icon={faPencilAlt} /></Button>
                    )} 
                    position="right top"
                    closeOnDocumentClick
                    closeOnEscape
                    disabled={this.state.heroSelectorDisabled}
                    className="foresight-tooltip"
                    contentStyle={{ 
                        width: "750px"
                    }}>
                     <HeroSelector 
                        onSelectedHero={this.onSelectHero} 
                        dotaStrings={this.state.dotaStrings}
                         />
                </Popup>
            </div>
        );
    }
}

export default ChangeHeroBtn;