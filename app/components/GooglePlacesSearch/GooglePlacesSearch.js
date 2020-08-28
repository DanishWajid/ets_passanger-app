import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { GooglePlacesAutocomplete } from './GooglePlacesAutocomplete';

class GooglePlacesSearch extends Component {
    render() {
        const { callbackFromParent, value: defaultValue = '', ...otherProps } = this.props;
        return (
          <GooglePlacesAutocomplete
              {...otherProps}
                minLength={2}
                autoFocus={false}
                returnKeyType="search"
                listViewDisplayed="auto"
                fetchDetails
                defaultValue={defaultValue}
                renderDescription={row => row.description}
                onPress={(data, details = null) => {
                    callbackFromParent({...data, ...details});
                }}
                getDefaultValue={() => defaultValue}
                query={{
                    key: 'AIzaSyC1yCPUGUUdpy64y2oEAnJ21iPqOLwQlDY',
                    language: 'en', // language of the results
                    types: 'geocode', // default: 'geocode'
                    components: 'country:uk'
                }}
                predefinedPlaces={[]}
                currentLocation={false}
          />
        );
    }
}

GooglePlacesSearch.propTypes = {
    callbackFromParent: PropTypes.func,
};
export default GooglePlacesSearch;
