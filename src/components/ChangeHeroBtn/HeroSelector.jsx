import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form } from "react-bootstrap";
import {  faSearch } from "@fortawesome/free-solid-svg-icons";

class HeroSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            heroes: props.heroes,
            filteredHeroes: props.heroes,
            onSelectedHero: props.onSelectedHero,
        };

        this.onSearchChanged = this.onSearchChanged.bind(this);
    }

    onSearchChanged(e) {
        var searchTerm = e.target.value;
        var filtered = this.state.heroes;
        filtered = filtered.filter((hero) => {
            return hero.name.indexOf(searchTerm.toLowerCase()) !== -1;
        });

        this.setState({
            filteredHeroes: filtered,
        });
    }

    render() {
        var iconScale = 0.5;
        return (
            <div className="hero-card">
                <div className="hero-card header d-flex">
                    <div className="d-flex">
                        <h5 className="my-auto ml-2">CHOOSE A HERO</h5>
                        <div className="ml-auto p-1">
                            <Form.Control type="text" placeholder="" onChange={this.onSearchChanged} />
                        </div>
                        <FontAwesomeIcon icon={faSearch} className="my-auto mr-2" />
                    </div>
                </div>
                <div className="content">
                    <div className="d-flex flex-wrap">
                        {
                            this.state.filteredHeroes && this.state.filteredHeroes.map((value) => {
                                return (
                                    <div
                                        key={value.name}  
                                        onClick={this.state.onSelectedHero}
                                        className="m-1"
                                        style={{ height: `calc(72px * ${iconScale})`, width: `calc(128px * ${iconScale})` }}>
                                        <span 
                                            className={`hero-icon-big hero-icon-big-${value.name}_png`} 
                                            style={{ transformOrigin: "top left", transform: `scale(${iconScale}, ${iconScale})` }}
                                            data-heroname={value.displayName}
                                            data-hero={value.name} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default HeroSelector;