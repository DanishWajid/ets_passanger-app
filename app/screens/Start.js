import React, {Component} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Image, View, AsyncStorage, ImageBackground} from 'react-native';
import PropTypes from 'prop-types';
import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux';
import {LSButton} from '../components/Buttton';
import {loginUser} from '../actions/login';
import {myHeight} from '../utils';

class Start extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.object,
  };

  constructor (props) {
    super (props);

    this.state = {
      userExistingChecked: false,
    };
  }

  componentWillMount () {
    AsyncStorage.getItem ('currentUser')
      .then (currentUser => {
        if (currentUser != null) {
          this.props.dispatch (loginUser (JSON.parse (currentUser)));
          this.props.navigation.navigate ('AppPage');
        }
        this.setState ({
          userExistingChecked: true,
        });
      })
      .catch (() => {
        this.setState ({
          userExistingChecked: true,
        });
      });
  }

  handlePressSignin = () => {
    this.props.navigation.navigate ('LoginPage');
  };

  handlePressSignup = () => {
    this.props.navigation.navigate ('SignupPage');
  };

  render () {
    if (this.state.userExistingChecked) {
      return (
        <ImageBackground
          source={require ('../assets/whiteOverlay.png')}
          style={styles.background}
        >
          <Image style={styles.icon} source={require ('../assets/icon.png')} />
          <View style={styles.buttonContainer}>
            <LSButton
              title="SIGN IN"
              onPress={() => this.handlePressSignin ()}
            />
            <LSButton
              title="SIGN UP"
              onPress={() => this.handlePressSignup ()}
            />
          </View>
        </ImageBackground>
      );
    }
    return (
      <View style={{flex: 1}}>
        <Spinner visible={!this.state.isLoaded} size="large" animation="fade" />
      </View>
    );
  }
}

const styles = EStyleSheet.create ({
  background: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    // paddingBottom: '2%',
  },
  icon: {
    alignSelf: 'center',
    height: 31,
    width: 160,
    marginTop: myHeight * 0.46875,
    tintColor: '#EA2141',
  },
  buttonContainer: {
    marginTop: myHeight * 0.22,
  },
});
const mapStateToProps = state => {
  const currentUser = state.login.currentUser;
  return {
    currentUser,
  };
};

export default connect (mapStateToProps) (Start);
