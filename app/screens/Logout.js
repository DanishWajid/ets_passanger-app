import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux';
import {View} from 'react-native';
import {logoutUser} from '../actions/login';
import {connectAlert} from '../components/Alert';

class Logout extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
  };

  constructor (props) {
    super (props);
    this.state = {
      loggedIn: true,
    };
  }

  componentWillMount () {
    this.props.dispatch (logoutUser ());
    this.props.navigation.navigate ('SignedOut');
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <Spinner visible={this.state.loggedIn} size="large" animation="fade" />
      </View>
    );
  }
}

export default connectAlert (connect () (Logout));
