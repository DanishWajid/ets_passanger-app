import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Animated,
  Text,
  ImageBackground,
} from 'react-native';
import {Spinner} from 'native-base';
import {connect} from 'react-redux';
import firebase from 'react-native-firebase';
import Toast, {DURATION} from 'react-native-easy-toast';
import t from 'tcomb-form-native';
import {diff, myWidth, myHeight} from '../utils';
import {loginUser} from '../actions/login';

const _ = require ('lodash');

const Form = t.form.Form;
const reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const strength = s => s.length >= 8;
const upperCase = /[A-Z]+/;
const specialCharacter = /\W/;
const emailValidator = t.refinement (t.String, email => reg.test (email));

emailValidator.getValidationErrorMessage = function (value) {
  if (!value) {
    return '*Required field';
  }
  if (!reg.test (value)) {
    return 'Invalid email address';
  }
};

const passwordValidator = t.refinement (
  t.String,
  s => strength (s) && upperCase.test (s) && specialCharacter.test (s)
);

passwordValidator.getValidationErrorMessage = function (value) {
  if (!value) {
    return '*Required field';
  }
  if (value.length < 8) {
    return 'Password must be alteast 8 Character long';
  }
  if (!upperCase.test (value)) {
    return 'Password must contain 1 upper case letter';
  }
  if (!specialCharacter.test (value)) {
    return 'Password must contain 1 special character';
  }
};

const login = t.struct ({
  email: emailValidator,
  password: passwordValidator,
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
stylesheet.textboxView.normal.borderBottomWidth = 1;
stylesheet.textboxView.error.borderBottomWidth = 1;
stylesheet.textboxView.normal.borderColor = '#878787';
stylesheet.textboxView.error.borderColor = 'brown';
stylesheet.textboxView.normal.marginBottom = 5;
stylesheet.textboxView.error.marginBottom = 5;
stylesheet.textbox.normal.color = '#878787';
stylesheet.textbox.error.color = '#878787';
stylesheet.textbox.normal.paddingHorizontal = 0;
stylesheet.textbox.error.paddingHorizontal = 0;
stylesheet.textbox.normal.fontSize = 15;
stylesheet.textbox.error.fontSize = 15;

const options = {
  stylesheet,
  fields: {
    email: {
      auto: 'none',
      placeholder: 'Email',
      keyboardType: 'email-address',
    },
    password: {
      auto: 'none',
      placeholder: 'Password',
      secureTextEntry: true,
    },
  },
};

class Login extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.object,
  };

  constructor (props) {
    super (props);

    this.state = {
      isLoading: false,
      toasterMessage: 'Loging in...',
      toasterColor: 'gray',
    };

    this.buttonAnimated = new Animated.Value (0);
    this.onPress = this.onPress.bind (this);
  }

  onChange = value => {
    this.setState ({value});
  };

  onPress () {
    if (this._form.getValue () !== null) {
      const value = this._form.getValue ();
      const emailValue = value.email;
      const passwordValue = value.password;
      firebase
        .auth ()
        .signInWithEmailAndPassword (emailValue, passwordValue)
        .then (obj => {
          firebase
            .firestore ()
            .collection ('users')
            .doc (obj.user.uid)
            .get ()
            .then (user => {
              const currentUser = user.data ();
              currentUser.uid = obj.user.uid;
              currentUser.firebaseData = obj.user.toJSON ();
              currentUser.emailVerified = obj.user.emailVerified;
              currentUser.phoneVerified = obj.user.phoneNumber !== null;
              currentUser.compVerified =
                currentUser.emailVerified && currentUser.phoneVerified;
              currentUser.pass = passwordValue;
              this.props.dispatch (loginUser (currentUser));

              this.props.navigation.navigate ('AppPage');
              this.setState ({isLoading: false});
              this.animation (this.buttonAnimated, 0, 200);
              this.setState ({value: null});
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

    return (
      <ImageBackground
        source={require ('../assets/whiteOverlay.png')}
        style={styles.background}
      >

        <View style={styles.buttonContainer}>
          <Image style={styles.img} source={require ('../assets/icon.png')} />
          <Form
            ref={c => (this._form = c)}
            type={login}
            options={options}
            value={this.state.value}
            onChange={this.onChange}
          />

          <Text
            style={styles.passwordText}
            onPress={() => this.props.navigation.navigate ('ForgotPassword')}
          >
            Forgot password?
          </Text>

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
                : <Text style={styles.txt}>Sign in</Text>}
            </TouchableOpacity>
          </Animated.View>
        </View>

        <TouchableHighlight
          onPress={() => this.props.navigation.navigate ('SignupPage')}
          underlayColor="rgba(215, 219, 221,0)"
        >
          <View style={styles.bottomButton}>
            <Text style={styles.buttonText}>Don't have an account?</Text>
          </View>
        </TouchableHighlight>
        <Toast
          ref="toast"
          style={{backgroundColor: this.state.toasterColor, borderRadius: 30}}
          position="top"
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={2500}
          opacity={0.8}
          textStyle={{color: 'white', fontSize: 18}}
        />
      </ImageBackground>
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
    borderRadius: myHeight * 0.04,
    backgroundColor: '#EA2141',
  },
  txt: {
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    color: 'white',
  },
  imgLoading: {
    width: myHeight * 0.08,
    height: myHeight * 0.08,
  },
  background: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'flex-end',
  },

  bottomButton: {
    backgroundColor: '#EA2141',
    marginTop: myHeight * 0.068,
    height: 60,
    width: '100%',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  passwordText: {
    color: '#EA2141',
    alignSelf: 'flex-end',
    fontSize: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  img: {
    alignSelf: 'center',
    height: 31,
    width: 160,
    marginBottom: myHeight * 0.15,
    marginTop: 35,
    tintColor: '#EA2141',
  },
  buttonContainer: {
    // marginTop: myHeight * 0.20,
    alignContent: 'space-between',
    paddingHorizontal: '10%',
  },
});

const mapStateToProps = state => {
  const currentUser = state.login.currentUser;
  return {
    currentUser,
  };
};

export default connect (mapStateToProps) (Login);
