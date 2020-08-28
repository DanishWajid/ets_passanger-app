import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TextInput,
  View,
  ScrollView,
  Text,
  Platform,
  ActivityIndicator
} from 'react-native';
import Qs from 'qs';
import debounce from 'lodash.debounce';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
import {Icon} from 'native-base';
import styles from './styles';

const { Popover } = renderers;

class GooglePlacesAutocomplete extends Component {
  _isMounted = false;

  _results = [];

  _requests = [];

  constructor (props) {
    super(props);
    this.state = this.getInitialState.call(this);
  }

  getInitialState = () => ({
    optionsWidth: 0,
    text: this.props.getDefaultValue(),
    dataSource: this.buildRowsFromResults([]),
  })


  buildRowsFromResults = (results) => {
    let res = [];

    if (results.length === 0 || this.props.predefinedPlacesAlwaysVisible === true) {
      res = [...this.props.predefinedPlaces];

      if (this.props.currentLocation === true) {
        res.unshift({
          description: this.props.currentLocationLabel,
          isCurrentLocation: true,
        });
      }
    }

    res = res.map(place => ({
      ...place,
      isPredefinedPlace: true
    }));

    return [...res, ...results];
  }

  componentDidMount() {
    this._request = this.props.debounce
        ? debounce(this._request, this.props.debounce)
        : this._request;
    this._handleChangeText(this.state.text);
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._abortRequests();
    this._isMounted = false;
  }

  componentWillReceiveProps(nextProps): void {
    const { defaultValue } = nextProps;
    const { defaultValue: text } = this.props;
    if (defaultValue !== text) {
      this.setState( { text: defaultValue });
    }
  }

  _abortRequests = () => {
    this._requests.map(i => i.abort());
    this._requests = [];
  }

  /**
   * This method is exposed to parent components to focus on textInput manually.
   * @public
   */
  triggerFocus = () => {
    if (this.refs.textInput) this.refs.textInput.focus();
  }

  /**
   * This method is exposed to parent components to blur textInput manually.
   * @public
   */
  triggerBlur = () => {
    this.menu && this.menu.close();
    if (this.refs.textInput) this.refs.textInput.blur();
  }

  getCurrentLocation = () => {
    let options = {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 1000
    };

    if (this.props.enableHighAccuracyLocation && Platform.OS === 'android') {
      options = {
        enableHighAccuracy: true,
        timeout: 20000
      };
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (this.props.nearbyPlacesAPI === 'None') {
          const currentLocation = {
            description: this.props.currentLocationLabel,
            geometry: {
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
            }
          };

          this._disableRowLoaders();
          this.props.onPress(currentLocation, currentLocation);
        } else {
          this._requestNearby(position.coords.latitude, position.coords.longitude);
        }
      },
      (error) => {
        this._disableRowLoaders();
        alert(error.message);
      },
      options
    );
  }

  _onPress = (rowData) => {
    this.menu && this.menu.close();
    if (rowData.isPredefinedPlace !== true && this.props.fetchDetails === true) {
      if (rowData.isLoading === true) {
        // already requesting
        return;
      }

      this._abortRequests();

      // display loader
      this._enableRowLoader(rowData);

      // fetch details
      const request = new XMLHttpRequest();
      this._requests.push(request);
      request.timeout = this.props.timeout;
      request.ontimeout = this.props.onTimeout;
      request.onreadystatechange = () => {
        if (request.readyState !== 4) return;

        if (request.status === 200) {
          const responseJSON = JSON.parse(request.responseText);

          if (responseJSON.status === 'OK') {
            if (this._isMounted === true) {
              const details = responseJSON.result;
              this._disableRowLoaders();
              this.triggerBlur();

              this.setState({
                text: rowData.description,
              });

              delete rowData.isLoading;
              this.props.onPress(rowData, details);
            }
          } else {
            this._disableRowLoaders();

            if (this.props.autoFillOnNotFound) {
              this.setState({
                text: rowData.description
              });
              delete rowData.isLoading;
            }

            if (!this.props.onNotFound) {
              console.warn(`google places autocomplete: ${responseJSON.status}`);
            } else {
              this.props.onNotFound(responseJSON);
            }
          }
        } else {
          this._disableRowLoaders();

          if (!this.props.onFail) {
            console.warn(
              'google places autocomplete: request could not be completed or has been aborted'
            );
          } else {
            this.props.onFail();
          }
        }
      };

      request.open('GET', `https://maps.googleapis.com/maps/api/place/details/json?${Qs.stringify({
        key: this.props.query.key,
        placeid: rowData.place_id,
        language: this.props.query.language,
      })}`);

      if (this.props.query.origin !== null) {
        request.setRequestHeader('Referer', this.props.query.origin);
      }

      request.send();
    } else if (rowData.isCurrentLocation === true) {
      // display loader
      this._enableRowLoader(rowData);

      this.setState({
        text: rowData.description,
      });

      this.triggerBlur(); // hide keyboard but not the results
      delete rowData.isLoading;
      this.getCurrentLocation();
    } else {
      this.setState({
        text: rowData.description,
      });

      this.triggerBlur();
      delete rowData.isLoading;
      const predefinedPlace = this._getPredefinedPlace(rowData);

      // sending predefinedPlace as details for predefined places
      this.props.onPress(predefinedPlace, predefinedPlace);
    }
  }

  _enableRowLoader = (rowData) => {
    const rows = this.buildRowsFromResults(this._results);
    for (let i = 0; i < rows.length; i++) {
      if ((rows[i].place_id === rowData.place_id) || (rows[i].isCurrentLocation === true && rowData.isCurrentLocation === true)) {
        rows[i].isLoading = true;
        this.setState({
          dataSource: rows,
        });
        break;
      }
    }
  }

  _disableRowLoaders = () => {
    if (this._isMounted === true) {
      for (let i = 0; i < this._results.length; i++) {
        if (this._results[i].isLoading === true) {
          this._results[i].isLoading = false;
        }
      }

      this.setState({
        dataSource: this.buildRowsFromResults(this._results),
      });
    }
  }

  _getPredefinedPlace = (rowData) => {
    if (rowData.isPredefinedPlace !== true) {
      return rowData;
    }

    for (let i = 0; i < this.props.predefinedPlaces.length; i++) {
      if (this.props.predefinedPlaces[i].description === rowData.description) {
        return this.props.predefinedPlaces[i];
      }
    }

    return rowData;
  }

  _filterResultsByTypes = (unfilteredResults, types) => {
    if (types.length === 0) return unfilteredResults;

    const results = [];
    for (let i = 0; i < unfilteredResults.length; i++) {
      let found = false;

      for (let j = 0; j < types.length; j++) {
        if (unfilteredResults[i].types.indexOf(types[j]) !== -1) {
          found = true;
          break;
        }
      }

      if (found === true) {
        results.push(unfilteredResults[i]);
      }
    }
    return results;
  }

  _requestNearby = (latitude, longitude) => {
    this._abortRequests();

    if (latitude !== undefined && longitude !== undefined && latitude !== null && longitude !== null) {
      const request = new XMLHttpRequest();
      this._requests.push(request);
      request.timeout = this.props.timeout;
      request.ontimeout = this.props.onTimeout;
      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return;
        }

        if (request.status === 200) {
          const responseJSON = JSON.parse(request.responseText);

          this._disableRowLoaders();

          if (typeof responseJSON.results !== 'undefined') {
            if (this._isMounted === true) {
              let results = [];
              if (this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding') {
                results = this._filterResultsByTypes(responseJSON.results, this.props.filterReverseGeocodingByTypes);
              } else {
                results = responseJSON.results;
              }

              this.setState({
                dataSource: this.buildRowsFromResults(results),
              });
            }
          }
          if (typeof responseJSON.error_message !== 'undefined') {
            console.warn(`google places autocomplete: ${responseJSON.error_message}`);
          }
        } else {
          // console.warn("google places autocomplete: request could not be completed or has been aborted");
        }
      };

      let url = '';
      if (this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding') {
        // your key must be allowed to use Google Maps Geocoding API
        url = `https://maps.googleapis.com/maps/api/geocode/json?${Qs.stringify({
          latlng: `${latitude},${longitude}`,
          key: this.props.query.key,
          ...this.props.GoogleReverseGeocodingQuery,
        })}`;
      } else {
        url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${Qs.stringify({
          location: `${latitude},${longitude}`,
          key: this.props.query.key,
          ...this.props.GooglePlacesSearchQuery,
        })}`;
      }

      request.open('GET', url);
      if (this.props.query.origin !== null) {
         request.setRequestHeader('Referer', this.props.query.origin);
      }

      request.send();
    } else {
      this._results = [];
      this.setState({
        dataSource: this.buildRowsFromResults([]),
      });
    }
  }

  _request = (text) => {
    this._abortRequests();
    if (text.length >= this.props.minLength) {
      const request = new XMLHttpRequest();
      this._requests.push(request);
      request.timeout = this.props.timeout;
      request.ontimeout = this.props.onTimeout;
      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return;
        }

        if (request.status === 200) {
          const responseJSON = JSON.parse(request.responseText);
          if (typeof responseJSON.predictions !== 'undefined') {
            if (this._isMounted === true) {
              const results = this.props.nearbyPlacesAPI === 'GoogleReverseGeocoding'
                ? this._filterResultsByTypes(responseJSON.predictions, this.props.filterReverseGeocodingByTypes)
                : responseJSON.predictions;

              this._results = results;
              this.setState({
                dataSource: this.buildRowsFromResults(results),
              });
            }
          }
          if (typeof responseJSON.error_message !== 'undefined') {
            console.warn(`google places autocomplete: ${responseJSON.error_message}`);
          }
        } else {
          // console.warn("google places autocomplete: request could not be completed or has been aborted");
        }
      };
      request.open('GET', `https://maps.googleapis.com/maps/api/place/autocomplete/json?&input=${encodeURIComponent(text)}&${Qs.stringify(this.props.query)}`);
      if (this.props.query.origin !== null) {
         request.setRequestHeader('Referer', this.props.query.origin);
      }

      request.send();
    } else {
      this._results = [];
      this.setState({
        dataSource: this.buildRowsFromResults([]),
      });
    }
  }

  _onChangeText = (text) => {
    this._request(text);
    this.setState({
      text
    });
  }

  _handleChangeText = (text) => {
    this._onChangeText(text);
    if (text.length > 1) {
      this.menu.open();
    } else {
      this.menu.close();
    }

    const onChangeText = this.props
      && this.props.textInputProps
      && this.props.textInputProps.onChangeText;

    if (onChangeText) {
      onChangeText(text);
    }
  }

  _renderLoader = () => {
    const { dataSource, text } = this.state;
    if (!dataSource.length && text.length > 1) {
      return (
        <View style={styles.loader}>
          <Text style={{ marginRight: 10 }}>Loading Places... </Text>
          <ActivityIndicator
              animating
              size="small"
          />
        </View>
      );
    }
    return null;
  }

  getDimensions = (event) => {
    const { optionsWidth } = this.state;
    if (!optionsWidth) {
      const { width } = event.nativeEvent.layout;
      this.setState({ optionsWidth: width });
    }
  }


  render() {
    const { optionsWidth, text } = this.state;
    const { iconName, inputStyle, inputContainer, smallInput } = this.props;
    const innerStyle = smallInput ? styles.smallInput : styles.container;
    const inputField = smallInput ? inputStyle : styles.textInput;
    const menuWidth = smallInput ? optionsWidth - 20 : optionsWidth;
    return (
      <View
          style={inputContainer}
          onLayout={this.getDimensions}
          pointerEvents="box-none"
      >
        <Menu
              ref={(ref) => this.menu = ref}
              renderer={Popover}
              rendererProps={{
                placement: 'bottom',
                preferredPlacement: 'bottom',
                anchorStyle: { backgroundColor: 'transparent' } }
              }
        >
          <MenuTrigger
              disabled
              customStyles={{ alignSelf: 'stretch' }}
          >
            <View style={innerStyle}>
              {!!iconName && <Icon name={iconName} style={styles.icon} />}
              <TextInput
                  ref="textInput"
                  value={text}
                  style={inputField}
                  editable={this.props.editable}
                  returnKeyType={this.props.returnKeyType}
                  autoFocus={this.props.autoFocus}
                  placeholder={this.props.placeholder}
                  onSubmitEditing={this.props.onSubmitEditing}
                  placeholderTextColor={this.props.placeholderTextColor}
                  clearButtonMode="while-editing"
                  underlineColorAndroid={this.props.underlineColorAndroid}
                  onChangeText={this._handleChangeText}
              />
            </View>
          </MenuTrigger>
          <MenuOptions
              optionsContainerStyle={[styles.menuCover, {
                height: text.length > 1 ? 'auto' : 0,
                minWidth: menuWidth,
                marginTop: smallInput ? -5 : -15
              }]}
          >
            <ScrollView keyboardShouldPersistTaps="handled" style={styles.menuScroll}>
              {
                this.state.dataSource.map((item, index) => (
                  <MenuOption
                        value={index}
                        key={item.description}
                        customStyles={
                          {optionWrapper: styles.menuItem}
                        }
                        onSelect={() => this._onPress(item)}
                  >
                    <Text numberOfLines={1} style={styles.menuText}>{item.description}</Text>
                  </MenuOption>))}
              {this._renderLoader()}
            </ScrollView>
          </MenuOptions>
        </Menu>
      </View>
    );
  }
}

GooglePlacesAutocomplete.propTypes = {
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  underlineColorAndroid: PropTypes.string,
  returnKeyType: PropTypes.string,
  onPress: PropTypes.func,
  onNotFound: PropTypes.func,
  onFail: PropTypes.func,
  minLength: PropTypes.number,
  fetchDetails: PropTypes.bool,
  autoFocus: PropTypes.bool,
  autoFillOnNotFound: PropTypes.bool,
  getDefaultValue: PropTypes.func,
  timeout: PropTypes.number,
  onTimeout: PropTypes.func,
  query: PropTypes.object,
  GoogleReverseGeocodingQuery: PropTypes.object,
  GooglePlacesSearchQuery: PropTypes.object,
  styles: PropTypes.object,
  textInputProps: PropTypes.object,
  enablePoweredByContainer: PropTypes.bool,
  predefinedPlaces: PropTypes.array,
  currentLocation: PropTypes.bool,
  currentLocationLabel: PropTypes.string,
  nearbyPlacesAPI: PropTypes.string,
  enableHighAccuracyLocation: PropTypes.bool,
  filterReverseGeocodingByTypes: PropTypes.array,
  predefinedPlacesAlwaysVisible: PropTypes.bool,
  enableEmptySections: PropTypes.bool,
  renderDescription: PropTypes.func,
  renderRow: PropTypes.func,
  renderLeftButton: PropTypes.func,
  renderRightButton: PropTypes.func,
  listUnderlayColor: PropTypes.string,
  debounce: PropTypes.number,
  isRowScrollable: PropTypes.bool,
  text: PropTypes.string,
  textInputHide: PropTypes.bool,
  suppressDefaultStyles: PropTypes.bool,
  numberOfLines: PropTypes.number,
  onSubmitEditing: PropTypes.func,
  editable: PropTypes.bool
};
GooglePlacesAutocomplete.defaultProps = {
  defaultValue: '',
  placeholder: 'Search',
  placeholderTextColor: '#A8A8A8',
  isRowScrollable: true,
  underlineColorAndroid: 'transparent',
  returnKeyType: 'default',
  onPress: () => {},
  onNotFound: () => {},
  onFail: () => {},
  minLength: 0,
  fetchDetails: false,
  autoFocus: false,
  innerStyle: false,
  autoFillOnNotFound: false,
  keyboardShouldPersistTaps: 'always',
  getDefaultValue: () => '',
  timeout: 20000,
  onTimeout: () => console.warn('google places autocomplete: request timeout'),
  query: {
    key: 'missing api key',
    language: 'en',
    types: 'geocode',
  },
  GoogleReverseGeocodingQuery: {},
  GooglePlacesSearchQuery: {
    rankby: 'distance',
    types: 'food',
  },
  inputStyle: {},
  inputContainer: {},
  textInputProps: {},
  enablePoweredByContainer: true,
  predefinedPlaces: [],
  currentLocation: false,
  currentLocationLabel: 'Current location',
  nearbyPlacesAPI: 'GooglePlacesSearch',
  enableHighAccuracyLocation: true,
  filterReverseGeocodingByTypes: [],
  predefinedPlacesAlwaysVisible: false,
  enableEmptySections: true,
  debounce: 0,
  textInputHide: false,
  suppressDefaultStyles: false,
  numberOfLines: 1,
  onSubmitEditing: () => {},
  editable: true
};

// this function is still present in the library to be retrocompatible with version < 1.1.0
const create = function create(options = {}) {
  return React.createClass({
    render() {
      return (
        <GooglePlacesAutocomplete
          ref="GooglePlacesAutocomplete"
          {...options}
        />
      );
    },
  });
};

module.exports = {
  GooglePlacesAutocomplete,
  create
};
