import React from "react";
import InputForm from "./InputForm";
import { queryMyAddress, validateMyAddress } from "./AutocompleteService";

export default class Autocomplete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shouldValidate: true,
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
      suggestions: [],
      error: "",
    };

    this.updateField = this.updateField.bind(this);
    this.updateCheckbox = this.updateCheckbox.bind(this);
    this.selectSuggestion = this.selectSuggestion.bind(this);
  }

  updateStateFromForm(key, value) {
    const newState = {};
    newState[key] = value;

    this.setState(newState);
  }

  updateField(e) {
    this.updateStateFromForm(e.target.id, e.target.value);
  }

  updateCheckbox(e) {
    this.updateStateFromForm(e.target.id, e.target.checked);
  }

  selectSuggestion(suggestion) {
    this.useAutoCompleteSuggestion(suggestion).then(() => {
      if (this.state.shouldValidate) validateMyAddress(this.state);
    });
  }

  validateUsAddress() {
    validateMyAddress(state);
  }

  render() {
    return (
      <div>
        <div>
          <InputForm
            updateField={this.updateField}
            updateCheckbox={this.updateCheckbox}
            queryAutocompleteForSuggestions={queryMyAddress}
            state={this.state}
            validateCallback={validateMyAddress}
            suggestions={this.state.suggestions}
          />
        </div>
        {this.state.error && (
          <div>
            <h3>Validation Error:</h3>
            {this.state.error}
          </div>
        )}
      </div>
    );
  }
}
