import React, {Component} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import {View} from 'native-base';
import PropTypes from 'prop-types';
import firebase from 'react-native-firebase';
import t from 'tcomb-form-native';
import {connect} from 'react-redux';
import Toast, {DURATION} from 'react-native-easy-toast';
import {UpdateButton} from '../components/Buttton';
import {CustomHeader} from '../components/CustomHeader';

const _ = require ('lodash');
const V = require ('tcomb-validation');

const validate = V.validate;
const Form = t.form.Form;
const strength = s => s.length >= 8;
const upperCase = /[A-Z]+/;
const specialCharacter = /\W/;

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

const passwordUpdate = t.struct ({
  currentPassword: passwordValidator,
  newPassword: passwordValidator,
  confirmPassword: passwordValidator,
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
stylesheet.textboxView.error.borderColor = 'red';
stylesheet.textboxView.normal.marginBottom = 5;
stylesheet.textboxView.error.marginBottom = 5;
stylesheet.textbox.normal.paddingHorizontal = 0;
stylesheet.textbox.error.paddingHorizontal = 0;
stylesheet.textbox.normal.fontSize = 15;
stylesheet.textbox.error.fontSize = 15;

const options = {
  stylesheet,
  fields: {
    currentPassword: {
      auto: 'none',
      placeholder: 'Current Password',
      secureTextEntry: true,
    },
    newPassword: {
      auto: 'none',
      placeholder: 'New Password',
      secureTextEntry: true,
    },
    confirmPassword: {
      auto: 'none',
      placeholder: 'Confirm Password',
      secureTextEntry: true,
    },
  },
};

class Password extends Component {
  static propTypes = {
    alertWithType: PropTypes.func,
    navigation: PropTypes.object,
    currentUser: PropTypes.object,
  };

  constructor (props) {
    super (props);

    this.state = {
      toasterMessage: 'Updating ...',
      toasterColor: 'gray',
    };
  }

  onChange = value => {
    this.setState ({value});
  };

  reauthenticate (currentPassword) {
    const user = firebase.auth ().currentUser;
    const cred = firebase.auth.EmailAuthProvider.credential (
      this.props.currentUser.email,
      currentPassword
    );

    return user.reauthenticateAndRetrieveDataWithCredential (cred);
  }

  changePassword () {
    if (
      this._form.getValue () !== null &&
      validate (this._form.getValue ().currentPassword, passwordValidator) &&
      validate (this._form.getValue ().newPassword, passwordValidator) &&
      validate (this._form.getValue ().confirmPassword, passwordValidator)
    ) {
      const value = this._form.getValue ();
      const currentPassword = value.currentPassword;
      const newPassword = value.newPassword;
      const confirmPassword = value.confirmPassword;

      if (newPassword === confirmPassword) {
        firebase.auth ().onAuthStateChanged (user => {
          if (user) {
            this.reauthenticate (currentPassword)
              .then (() => {
                user
                  .updatePassword (newPassword)
                  .then (() => {
                    this.setState ({
                      toasterColor: 'gray',
                    });

                    this.refs.toast.show (
                      'Password Updated Sucessfully',
                      DURATION.LENGTH_LONG,
                      () => {
                        this.props.navigation.navigate ('Settings');
                      }
                    );
                  })
                  .catch (error => {
                    this.setState ({
                      toasterColor: 'red',
                      toasterMessage: error.message,
                    });
                  });
              })
              .catch (error => {
                this.setState ({
                  toasterColor: 'red',
                  toasterMessage: error.message,
                });
              })
              .finally (() => {
                this.refs.toast.show (
                  this.state.toasterMessage,
                  DURATION.LENGTH_LONG
                );
              });
          }
        });
      } else {
        this.setState ({toasterColor: 'red'});
        this.refs.toast.show (
          'Confirm Password does not match',
          DURATION.LENGTH_LONG
        );
      }
    }
  }

  render () {
    return (
      <View style={styles.background}>
        <CustomHeader
          title="Change Password"
          goback={() => this.props.navigation.goBack ()}
          backButton
        />

        <View style={styles.content}>

          <Form
            ref={c => (this._form = c)}
            type={passwordUpdate}
            options={options}
            value={this.state.value}
            onChange={this.onChange}
          />
        </View>
        <UpdateButton
          title="Update"
          onPress={() => this.changePassword ()}
          accessibilityLabel="Update your name"
        />
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
      </View>
    );
  }
}

const styles = EStyleSheet.create ({
  background: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    paddingBottom: '2%',
  },

  content: {
    paddingHorizontal: '5%',
    paddingVertical: '2%',
  },
});

const mapStateToProps = state => {
  const currentUser = state.login.currentUser;
  return {
    currentUser,
  };
};

export default connect (mapStateToProps) (Password);
