import React, {Component} from 'react';
import {View, TextInput} from 'react-native';
import PropTypes from 'prop-types';
import {Icon} from 'native-base';
import styles from './styles';

class SearchBar extends Component {
  onChange (data) {
    this.props.callbackFromParent (data);
  }

  render () {
    return (
      <View style={styles.container}>

        <Icon style={styles.icon} {...this.props} />

        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          {...this.props}
          onChangeText={address => this.onChange (address)}
        />
      </View>
    );
  }
}

SearchBar.propTypes = {
  callbackFromParent: PropTypes.func,
};
export default SearchBar;
