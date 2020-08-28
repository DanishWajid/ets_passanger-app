import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, TouchableHighlight} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {Text, List, Icon} from 'native-base';
import styles from './styles';
import GooglePlacesSearch from '../GooglePlacesSearch/GooglePlacesSearch';
import {getLocationObj} from '../../utils';

class Vias extends Component {
  constructor (props) {
    super (props);
    this.state = {via: null, stops: []};
  }

  addVia = async () => {
    const { via, stops } = this.state;
    if (via) {
      const loc = await getLocationObj(via);
      stops.push(loc);
    }
    this.setState ({
      via: null,
      stops
    });
    this.props.callbackFromParent(stops);
  };

  removeVia (data) {
    let { stops } = this.state;
    stops = stops.filter (e => e.description !== data.description);
    this.setState({ stops });
    this.props.callbackFromParent (stops);
  }

  render () {
    const { via, stops } = this.state;
    const { editable, placeholder, checked, onPress} = this.props;
    const searchBarStyles = [styles.inputContainer];
    const iconStyles = [styles.icon];
    if (!editable) {
      searchBarStyles.push (styles.searchBarDisabled);
      iconStyles.push (styles.iconDisabled);
    }
    return (
      <View>
        <View style={styles.container}>
          <CheckBox
            title="Vias"
            onPress={onPress}
            checked={checked}
            textStyle={styles.text}
            checkedColor="#ffffff"
            uncheckedColor="#ffffff"
            containerStyle={styles.checkboxContainer}
          />
          <GooglePlacesSearch
              smallInput
              editable={editable}
              placeholder={placeholder}
              inputStyle={styles.searchBar}
              inputContainer={searchBarStyles}
              value={via ? via.description : ''}
              callbackFromParent={via => this.setState({via})}
          />
          <TouchableHighlight
            underlayColor="rgba(253, 254, 254,0)"
            onPress={this.addVia}
          >
            <Icon name="ios-checkmark-circle" style={iconStyles} />
          </TouchableHighlight>
        </View>
        <List
          style={styles.viasContainer}
          dataArray={stops}
          renderRow={data => (
            <View style={styles.viasView}>
              <TouchableHighlight
                underlayColor="rgba(253, 254, 254,0)"
                onPress={() => this.removeVia (data)}
              >
                <Icon name="ios-close-circle" style={styles.closeIcon} />
              </TouchableHighlight>
              <Text style={styles.viasText}>{data.description}</Text>
            </View>
          )}
        />

      </View>
    );
  }
}
Vias.propTypes = {
  onPress: PropTypes.func,
  placeholder: PropTypes.string,
  editable: PropTypes.bool,
  checked: PropTypes.bool,
  callbackFromParent: PropTypes.func,
};

export default Vias;
