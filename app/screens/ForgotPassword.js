import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Animated,
  Text,
  ImageBackground,
} from 'react-native';
import {connect} from 'react-redux';
import firebase from 'react-native-firebase';
import Toast, {DURATION} from 'react-native-easy-toast';
import t from 'tcomb-form-native';
import {Spinner} from 'native-base';
import {diff, myWidth, myHeight} from '../utils';

const _ = require ('lodash');
const V = require ('tcomb-validation');

const validate = V.validate;
const Form = t.form.Form;
const reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const emailValidator = t.refinement (t.String, email => reg.test (email));

emailValidator.getValidationErrorMessage = function (value) {
  if (!value) {
    return '*Required field';
  }
  if (!reg.test (value)) {
    return 'Invalid email address';
  }
};

const emailUpdate = t.struct ({
  email: emailValidator,
});

const stylesheet = _.cloneDeep (t.form.Form.stylesheet);

stylesheet.textbox.normal.borderWidth = 0;
stylesheet.textbox.error.borderWidth = 0;
stylesheet.textbox.normal.marginBottom = 0;
stylesheet.textbox.error.marginBottom = 0;
stylesheet.textbox.normal.marginTop = 20;
stylesheet.textbox.error.marginTop = 20;
stylesheet.textboxView.normal.borderWidth = 0;
stylesheet.textboxView.error.borderWidth = 0;
stylesheet.textboxView.normal.borderRadius = 0;
stylesheet.textboxView.error.borderRadius = 0;
stylesheet.textboxView.normal.borderColor = '#878787';
stylesheet.textboxView.error.borderColor = 'brown';
stylesheet.textboxView.normal.borderBottomWidth = 1;
stylesheet.textboxView.error.borderBottomWidth = 1;
stylesheet.textbox.normal.color = '#878787';
stylesheet.textbox.error.color = '#878787';
stylesheet.textboxView.normal.marginBottom = 5;
stylesheet.textboxView.error.marginBottom = 5;
stylesheet.textbox.normal.paddingHorizontal = 0;
stylesheet.textbox.error.paddingHorizontal = 0;
stylesheet.textbox.normal.fontSize = 15;
stylesheet.textbox.error.fontSize = 15;

const options = {
  stylesheet,
  fields: {
    email: {
      auto: 'none',
      placeholder: 'Enter your new email address',
    },
  },
};

class ForgotPassword extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.object,
  };

  constructor (props) {
    super (props);

    this.state = {
      userExistingChecked: true,
      isLoading: false,
      toasterMessage: 'Updating ...',
      toasterColor: 'gray',
    };

    this.buttonAnimated = new Animated.Value (0);
    this.onPress = this.onPress.bind (this);
  }

  onChange = value => {
    this.setState ({value});
  };

  onPress () {
    if (
      this._form.getValue () !== null &&
      validate (this._form.getValue ().email, emailValidator)
    ) {
      firebase
        .auth ()
        .sendPasswordResetEmail (this._form.getValue ().email)
        .then (() => {
          this.setState ({isLoading: false});
          this.animation (this.buttonAnimated, 0, 200);
          this.props.navigation.navigate ('LoginPage');
        })
        .catch (error => {
          this.setState ({
            toasterColor: 'red',
            toasterMessage: error.message,
            isLoading: false,
          });
          this.refs.toast.show (
            this.state.toasterMessage,
            DURATION.LENGTH_LONG
          );
          this.animation (this.buttonAnimated, 0, 200);
        });

      if (this.state.isLoading) return;

      this.setState ({isLoading: true});
      this.animation (this.buttonAnimated, 1, 200);
    }
  }

  animation (obj, toValue, duration) {
    Animated.timing (obj, {
      toValue,
      duration,
    }).start ();
  }

  render () {
    const changeWidth = this.buttonAnimated.interpolate ({
      inputRange: [0, 1],
      outputRange: [myWidth * 0.84, myHeight * 0.08],
    });
    if (this.state.userExistingChecked) {
      return (
        <KeyboardAvoidingView style={styles.background}>
          <ImageBackground
            source={require ('../assets/whiteOverlay.png')}
            style={styles.background}
          >
            <View style={styles.buttonContainer}>
              <Text style={styles.heading}>Forgot Password?</Text>
              <Text style={styles.description}>
                Seems like you forgot your password for ETS Cars. If this is true, enter email address below to get a link to reset your account password.
              </Text>
              <Form
                ref={c => (this._form = c)}
                type={emailUpdate}
                options={options}
                value={this.state.value}
                onChange={this.onChange}
              />

            </View>
            <View style={styles.container}>
              <Animated.View style={{width: changeWidth}}>
                <TouchableOpacity
                  onPress={this.onPress}
                  activeOpacity={0.8}
                  style={styles.btn}
                >
                  {this.state.isLoading
                    ? <Spinner color="white" />
                    : <Text style={styles.txt}>Recover Account</Text>}
                </TouchableOpacity>
              </Animated.View>
            </View>
            <Toast
              ref="toast"
              style={{
                backgroundColor: this.state.toasterColor,
                borderRadius: 30,
              }}
              position="top"
              positionValue={200}
              fadeInDuration={750}
              fadeOutDuration={2500}
              opacity={0.8}
              textStyle={{color: 'white', fontSize: 18}}
            />

          </ImageBackground>
        </KeyboardAvoidingView>
      );
    }
    return (
      <View style={{flex: 1}}>
        <Spinner visible={!this.state.isLoaded} size="large" animation="fade" />
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    top: diff,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    width: '100%',
    height: myHeight * 0.08,
    marginTop: 40,
    borderRadius: myHeight * 0.04,
    backgroundColor: '#EA2141',
  },
  txt: {
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    color: 'white',
  },
  heading: {
    color: '#EA2141',
    paddingVertical: 20,
    fontWeight: '500',
    fontSize: 20,
    paddingLeft: 4,
  },
  description: {
    fontSize: 16,
    paddingLeft: 4,
  },
  background: {
    backgroundColor: 'white',
    flex: 1,
    top: diff,
    justifyContent: 'center',
  },

  bottomButton: {
    backgroundColor: '#EA2141',
    marginTop: myHeight * 0.105,
    height: 60,
    width: '100%',
    justifyContent: 'center',
  },
  buttonContainer: {
    alignContent: 'space-between',
    paddingHorizontal: '10%',
  },
  imgLoading: {
    width: myHeight * 0.08,
    height: myHeight * 0.08,
  },
});

const mapStateToProps = state => {
  const currentUser = state.login.currentUser;
  return {
    currentUser,
  };
};

export default connect (mapStateToProps) (ForgotPassword);
