import React from "react";
import "./InputForm.scss";
import inputFields from "../data/input_fields";
import { countries } from "../data/countries";
import Suggestion from "./Suggestion";

export default function InputForm({
  state,
  updateField,
  updateCheckbox,
  queryAutocompleteForSuggestions,
  validateCallback,
  suggestions,
}) {
  return (
    <form className={"autocomplete--input-form"}>
      {inputFields.map((inputField) => {
        return (
          <div
            className={"autocomplete--input-group"}
            key={inputField.fieldName}
          >
            <label
              className={"autocomplete--input-label"}
              htmlFor={inputField.fieldName}
            >
              {inputField.fieldLabel}
            </label>
            <input
              className={"autocomplete--input-field"}
              type="text"
              id={inputField.fieldName}
              value={state[inputField.fieldName]}
              onChange={(e) => {
                updateField(e);

                if (inputField.fieldName === "address1") {
                  queryAutocompleteForSuggestions(e.target.value);
                }
              }}
            />
            {inputField.fieldName === "address1" &&
              suggestions &&
              suggestions.map((suggestion) => (
                <Suggestion
                  key={suggestion.text}
                  suggestion={suggestion}
                  selectSuggestion={() => {}}
                />
              ))}
          </div>
        );
      })}
      <div className={"autocomplete--input-group"}>
        <label className={"autocomplete--input-label"} htmlFor="country">
          Country
        </label>
        <select
          value={state.country}
          onChange={updateField}
          id={"country"}
          className={"autocomplete--input-field"}
        >
          {countries.map((country) => {
            return (
              <option value={country.iso2} key={country.iso2}>
                {country.name}
              </option>
            );
          })}
        </select>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          validateCallback(state);
        }}
      >
        Validate
      </button>
    </form>
  );
}
