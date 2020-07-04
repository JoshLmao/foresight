import React, { Component } from 'react';
import { Form } from 'react-bootstrap';

import { connect } from "react-redux";
import { LANGUAGE_CHANGED } from "../../constants/actionTypes";
import { ELanguages } from "../../enums/languages";

function getSupportedLanguages() {
    var langs = Object.values(ELanguages);
    return langs.map((value) => {
        return (
            <option value={value} key={value}>{value}</option>
        )
    });
}

class LanguageSelect extends Component {
    constructor(props) {
        super(props);

        this.onLanguageChanged = this.onLanguageChanged.bind(this);
    }

    onLanguageChanged(event) {
        let newLanguage = event.target.value;
        this.props.dispatch({ type: LANGUAGE_CHANGED, value: newLanguage });
    }

    render() {
        return (
            <div>
                <Form.Control as="select" onChange={this.onLanguageChanged} defaultValue={this.props.lang}>
                    { getSupportedLanguages() }
                </Form.Control>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    lang: state.language.lang,
});

export default connect(mapStateToProps)(LanguageSelect);