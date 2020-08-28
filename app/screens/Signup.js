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
  AsyncStorage,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {Spinner} from 'native-base';
import {connect} from 'react-redux';
import firebase from 'react-native-firebase';
import Toast, {DURATION} from 'react-native-easy-toast';
import t from 'tcomb-form-native';
import {diff, myWidth, myHeight} from '../utils';
import {loginUser} from '../actions/login';

const _ = require ('lodash');
const V = require ('tcomb-validation');

let formValue = '';

const Form = t.form.Form;
const reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const strength = s => s.length >= 8;
const upperCase = /[A-Z]+/;
const specialCharacter = /\W/;
const length = s => s.length < 11;

const emailValidator = t.refinement (t.String, email => reg.test (email));
const nameValidator = t.refinement (t.String, s => length (s));

nameValidator.getValidationErrorMessage = function (value) {
  if (!value) {
    return '*Required field';
  }
  if (value.length >= 11) {
    return 'Name is too long';
  }
};

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

const signup = t.struct ({
  name: t.struct ({
    firstName: nameValidator,
    lastName: nameValidator,
  }),
  // phone: phoneValidator,
  email: emailValidator,
  password: passwordValidator,
  confirmPassword: passwordValidator,
});

const parentStyle = _.cloneDeep (t.form.Form.stylesheet);
const childStyle = _.cloneDeep (t.form.Form.stylesheet);

childStyle.textbox.normal.borderWidth = 0;
childStyle.textbox.error.borderWidth = 0;
childStyle.textbox.normal.marginBottom = 0;
childStyle.textbox.error.marginBottom = 0;
childStyle.textbox.normal.marginTop = 15;
childStyle.textbox.error.marginTop = 15;
childStyle.textboxView.normal.borderWidth = 0;
childStyle.textboxView.error.borderWidth = 0;
childStyle.textboxView.normal.borderRadius = 0;
childStyle.textboxView.error.borderRadius = 0;
childStyle.textboxView.normal.borderBottomWidth = 1;
childStyle.textboxView.error.borderBottomWidth = 1;
childStyle.textboxView.normal.borderColor = '#878787';
childStyle.textboxView.error.borderColor = 'brown';
childStyle.textboxView.normal.marginBottom = 5;
childStyle.textboxView.error.marginBottom = 5;
childStyle.textboxView.normal.width = '95%';
childStyle.textboxView.error.width = '95%';
childStyle.textboxView.normal.alignSelf = 'center';
childStyle.textboxView.error.alignSelf = 'center';
childStyle.textbox.normal.color = '#878787';
childStyle.textbox.error.color = '#878787';
childStyle.textbox.normal.paddingHorizontal = 0;
childStyle.textbox.error.paddingHorizontal = 0;
childStyle.textbox.normal.fontSize = 15;
childStyle.textbox.error.fontSize = 15;
parentStyle.fieldset.flex = 1;
parentStyle.fieldset.flexDirection = 'row';

childStyle.formGroup.normal.flex = 1;
childStyle.formGroup.error.flex = 1;

const options = {
  childStyle,
  fields: {
    name: {
      stylesheet: parentStyle,
      label: ' ',
      fields: {
        firstName: {
          stylesheet: childStyle,
          auto: 'none',
          placeholder: 'First Name',
        },
        lastName: {
          stylesheet: childStyle,
          auto: 'none',
          placeholder: 'Last Name',
        },
      },
    },
    email: {
      stylesheet: childStyle,
      auto: 'none',
      placeholder: 'Email',
      keyboardType: 'email-address',
    },

    password: {
      stylesheet: childStyle,
      auto: 'none',
      placeholder: 'Password',
      secureTextEntry: true,
    },
    confirmPassword: {
      stylesheet: childStyle,
      auto: 'none',
      placeholder: 'Re-type Password',
      secureTextEntry: true,
    },
  },
};

class Signup extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    navigation: PropTypes.object,
  };

  constructor (props) {
    super (props);

    this.state = {
      userExistingChecked: false,
      isLoading: false,

      toasterMessage: 'Siging Up ...',
      toasterColor: 'gray',
    };

    this.buttonAnimated = new Animated.Value (0);
    this.onPress = this.onPress.bind (this);
  }

  onChange = value => {
    this.setState ({value});
  };

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

  test = () => {
    this.setState ({isLoading: false});
    this.animation (this.buttonAnimated, 0, 200);
  };

  onPress () {
    if (this._form.getValue () !== null) {
      formValue = this._form.getValue ();
      const db = firebase.firestore ();

      if (formValue.password === formValue.confirmPassword) {
        firebase
          .auth ()
          .createUserWithEmailAndPassword (formValue.email, formValue.password)
          .then (obj => {
            db
              .collection ('users')
              .doc (obj.user.uid)
              .set ({
                firstName: formValue.name.firstName,
                lastName: formValue.name.lastName,
                email: formValue.email,
                gender: 'Select your gender',
                dateOfBirth: 'Select your date of birth',
                mobileNumber: 'Add mobile number',
              })
              .then (() => {
                this.login ();
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
      } else {
        this.setState ({isLoading: false, toasterColor: 'red'});
        this.animation (this.buttonAnimated, 0, 200);
        this.refs.toast.show ('Password does not match', DURATION.LENGTH_LONG);
      }
    }
  }

  login () {
    firebase
      .auth ()
      .signInWithEmailAndPassword (formValue.email, formValue.password)
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
            currentUser.compVerified = !!(currentUser.emailVerified &&
              currentUser.phoneVerified);
            currentUser.pass = formValue.password;
            this.props.dispatch (loginUser (currentUser));

            this.props.navigation.navigate ('AppPage');
            this.setState ({isLoading: false});
            this.animation (this.buttonAnimated, 0, 200);
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
      .catch (() => {
        this.setState ({isLoading: false});
        this.animation (this.buttonAnimated, 0, 200);
      });
    if (this.state.isLoading) return;

    this.setState ({isLoading: true});
    this.animation (this.buttonAnimated, 1, 200);
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
        <ImageBackground
          source={require ('../assets/whiteOverlay.png')}
          style={styles.background}
        >

          <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps="always"
          >
            <View style={styles.buttonContainer}>
              <Image
                style={styles.img}
                source={require ('../assets/icon.png')}
              />
              <Form
                ref={c => (this._form = c)}
                type={signup}
                options={options}
                value={this.state.value}
                onChange={this.onChange}
              />

            </View>

          </ScrollView>
          <View style={styles.container}>
            <Animated.View style={{width: changeWidth, alignSelf: 'center'}}>
              <TouchableOpacity
                onPress={this.onPress}
                activeOpacity={0.8}
                style={styles.btn}
              >
                {this.state.isLoading
                  ? <Spinner color="white" />
                  : <Text style={styles.txt}>Sign up</Text>}
              </TouchableOpacity>
            </Animated.View>

            <TouchableHighlight
              onPress={() => this.props.navigation.navigate ('LoginPage')}
              underlayColor="rgba(215, 219, 221,0)"
              style={styles.end}
            >
              <View style={styles.bottomButton}>
                <Text style={styles.buttonText}>
                  Already have an account?
                </Text>
              </View>
            </TouchableHighlight>
          </View>
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
  },
  smallInputContainer: {
    flexDirection: 'row',
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
  },

  bottomButton: {
    backgroundColor: '#EA2141',
    marginTop: myHeight * 0.068,
    alignSelf: 'flex-end',
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
  img: {
    alignSelf: 'center',
    height: 31,
    width: 160,
    marginBottom: myHeight * 0.05,
    marginTop: 35,
    tintColor: '#EA2141',
  },
  buttonContainer: {
    marginTop: myHeight * 0.12,
    paddingHorizontal: '10%',
  },
});

const mapStateToProps = state => {
  const currentUser = state.login.currentUser;
  return {
    currentUser,
  };
};

export default connect (mapStateToProps) (Signup);
