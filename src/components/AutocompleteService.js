import * as SmartyStreetsSDK from "smartystreets-javascript-sdk";
import * as sdkUtils from "smartystreets-javascript-sdk-utils";

export const queryMyAddress = (query) => {
  const SmartyStreetsCore = SmartyStreetsSDK.core;
  const websiteKey = process.env.SMARTY_WEBSITE_KEY;
  const smartyStreetsSharedCredentials = new SmartyStreetsCore.SharedCredentials(
    websiteKey
  );
  const autoCompleteClientBuilder = new SmartyStreetsCore.ClientBuilder(
    smartyStreetsSharedCredentials
  );

  const autoCompleteClient = autoCompleteClientBuilder.buildUsAutocompleteClient();

  const lookup = new SmartyStreetsSDK.usAutocomplete.Lookup(query);

  autoCompleteClient
    .send(lookup)
    .then((response) => {
      console.log({ suggestions: response.result });
    })
    .catch(console.warn);
};

export const validateMyAddress = (state) => {
  const SmartyStreetsCore = SmartyStreetsSDK.core;
  const websiteKey = process.env.SMARTY_WEBSITE_KEY;
  const smartyStreetsSharedCredentials = new SmartyStreetsCore.SharedCredentials(
    websiteKey
  );
  const usStreetClientBuilder = new SmartyStreetsCore.ClientBuilder(
    smartyStreetsSharedCredentials
  );
  const usStreetClient = usStreetClientBuilder.buildUsStreetApiClient();

  console.log(state);
  let lookup = new SmartyStreetsSDK.usStreet.Lookup();
  lookup.street = state.address1;
  lookup.street2 = state.address2;
  lookup.city = state.city;
  lookup.state = state.state;
  lookup.zipCode = state.zipCode;

  if (!!lookup.street) {
    usStreetClient
      .send(lookup)
      .then(updateStateFromValidatedUsAddress)
      .catch((e) => this.setState({ error: e.error }));
  } else {
    console.log({ error: "A street address is required." });
  }
};

export const updateStateFromValidatedUsAddress = (response) => {
  console.log(response);
  const lookup = response.lookups[0];
  const isValid = sdkUtils.isValid(lookup);
  const isAmbiguous = sdkUtils.isAmbiguous(lookup);
  const isMissingSecondary = sdkUtils.isMissingSecondary(lookup);
  const newState = {
    error: "",
  };

  if (!isValid) {
    newState.error = "The address is invalid.";
  } else if (isAmbiguous) {
    newState.error = "The address is ambiguous.";
  } else if (isMissingSecondary) {
    newState.error = "The address is missing a secondary number.";
  } else if (isValid) {
    const candidate = lookup.result[0];

    newState.address1 = candidate.deliveryLine1;
    newState.address2 = candidate.deliveryLine2 || "";
    newState.city = candidate.components.cityName;
    newState.state = candidate.components.state;
    newState.zipCode = `${candidate.components.zipCode}-${candidate.components.plus4Code}`;
    newState.error = "";
    console.log("The address is valid");
  }

  console.log(newState);
};
