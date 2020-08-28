import React, {Component} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Content, View, Text, Button} from 'native-base';
import PropTypes from 'prop-types';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import Toast, {DURATION} from 'react-native-easy-toast';
import t from 'tcomb-form-native';
import {SettingsDescription} from '../components/Heading';
import {UpdateButton} from '../components/Buttton';
import {CustomHeader} from '../components/CustomHeader';
import {updateUser} from '../actions/login';

const _ = require ('lodash');
const V = require ('tcomb-validation');

const validate = V.validate;
const Form = t.form.Form;
// const reg = /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/;
const reg = /^(\+44\s?7\d{3})\s?\d{3}\s?\d{3}$/;

const phoneValidator = t.refinement (t.String, s => reg.test (s));
let Ref = '';

phoneValidator.getValidationErrorMessage = function (value) {
  if (!value) {
    return '*Required field';
  }
  if (!reg.test (value)) {
    return 'Invalid mobile number';
  }
};

const numberUpdate = t.struct ({
  phone: phoneValidator,
});

const codeSent = t.struct ({
  code: t.String,
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
    phone: {
      auto: 'none',
      placeholder: 'Enter your mobile number',
      keyboardType: 'phone-pad',
    },
    code: {
      auto: 'none',
      placeholder: 'Code ...',
      keyboardType: 'phone-pad',
      error: '*Required field',
    },
  },
};

class MobileNumber extends Component {
  static propTypes = {
    alertWithType: PropTypes.func,
    navigation: PropTypes.object,
    currentUser: PropTypes.object,
    dispatch: PropTypes.func,
  };

  constructor (props) {
    super (props);
    this.state = {
      toasterMessage: 'Updating ...',
      toasterColor: 'gray',
      codeSent: true,
    };
  }

  onChange = value => {
    this.setState ({value});
  };

  verifyPhone = () => {
    if (this._form.getValue () !== null) {
      const myValue = this._form.getValue ();
      const phoneNumber = myValue.phone;

      this.setState ({message: 'Sending code ...'});

      firebase.auth ().verifyPhoneNumber (phoneNumber).on (
        'state_changed',
        phoneAuthSnapshot => {
          switch (phoneAuthSnapshot.state) {
            case firebase.auth.PhoneAuthState.CODE_SENT:
              const {verificationId} = phoneAuthSnapshot;
              this.setState ({
                codeSent: true,
                message: 'Code has been sent: ',
                verificationId,
              });
              break;

            case firebase.auth.PhoneAuthState.ERROR:
              this.setState ({
                message: 'Something Went Wrong during phone verification',
              });
              console.log ('Error in PhoneAuthState', phoneAuthSnapshot.error);
              break;

            case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT:
              console.log ('auto verify on android timed out');
              break;
          }
        },
        error => {
          console.log ('Something Went Wrong during phone verification', error);
          this.setState ({
            message: 'Something Went Wrong during phone verification',
          });
        }
        // phoneAuthSnapshot => {
        //   console.log (
        //     'phoneAuthSnapshot in final complete',
        //     phoneAuthSnapshot
        //   );
        // }
      );
    }
  };

  confirmCode = verificationId => {
    if (this._form.getValue () !== null) {
      const myValue = this._form.getValue ();

      const currentUser = this.props.currentUser;
      const userLoginData = this.props.userLoginData;
      const codeInput = myValue.code;
      const credential = firebase.auth.PhoneAuthProvider.credential (
        verificationId,
        codeInput
      );
      firebase
        .auth ()
        .currentUser.linkWithCredential (credential)
        .then (data => {
          const newData = data.user.toJSON ();

          currentUser.firebaseData = newData;
          currentUser.emailVerified = newData.emailVerified;

          currentUser.phoneVerified = newData.phoneNumber === null
            ? false
            : true;
          if (
            currentUser.emailVerified === true &&
            currentUser.phoneVerified === true
          ) {
            userLoginData.compVerified = true;
          } else {
            userLoginData.compVerified = false;
          }
          this.props.dispatch (updateUser (currentUser));
          this.setState ({
            phoneVerified: true,
            message: 'Phone has been verified',
          });
          this.props.navigation.state.params.onGoBack ();
          this.props.navigation.navigate ('LimitedAccess');
        });
    }
  };

  handleUpdateNumber = () => {
    if (this._form.getValue () !== null) {
      const myValue = this._form.getValue ();
      const phone = myValue.phone;

      const db = firebase.firestore ();
      const batch = db.batch ();
      firebase.auth ().onAuthStateChanged (user => {
        if (user) {
          Ref = db.collection ('users').doc (user.uid);
          user
            .updatePhoneNumber (
              firebase.auth.PhoneAuthProvider.credential (
                '03135128987',
                'Phone',
                '062566'
              )
            )
            .then (() => {
              batch.update (Ref, {mobileNumber: phone});
              this.props.currentUser.mobileNumber = phone;
              const currentUser = this.props.currentUser;
              batch.commit ();
              this.setState ({
                toasterColor: 'gray',
              });
              this.setState ({
                toasterMessage: 'Contact Number Updated Sucessfully',
              });
              this.refs.toast.show (
                this.state.toasterMessage,
                DURATION.LENGTH_LONG,
                () => {
                  this.props.dispatch (updateUser (currentUser));
                  this.props.navigation.state.params.onGoBack ();
                  this.props.navigation.navigate ('Settings');
                }
              );
            })
            .catch (error => {
              this.setState ({
                toasterColor: 'red',
                toasterMessage: error.message,
              });

              this.refs.toast.show (
                this.state.toasterMessage,
                DURATION.LENGTH_LONG
              );
            });
        }
      });
    }
  };

  renderPhoneNumberInput () {
    return (
      <View style={styles.background}>
        <CustomHeader
          title="Update Your Number"
          goback={() => this.props.navigation.goBack ()}
          backButton
        />
        <Content style={styles.content}>
          <SettingsDescription text="We will send a code to your new mobile number to verify your account" />

          <Form
            ref={c => (this._form = c)}
            type={numberUpdate}
            options={options}
            value={this.state.value}
            onChange={this.onChange}
          />
        </Content>

        <UpdateButton
          title="Update"
          accessibilityLabel="Update your mobile number"
          onPress={this.verifyPhone}
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

  renderVerificationCodeInput () {
    return (
      <View style={styles.background}>
        <CustomHeader
          title="Verify Code"
          goback={() => this.props.navigation.goBack ()}
          backButton
        />
        <Content style={styles.content}>
          <SettingsDescription text="Enter verification code below:" />

          <Form
            ref={c => (this._form = c)}
            type={codeSent}
            options={options}
            value={this.state.value}
            onChange={this.onChange}
          />
        </Content>
        <UpdateButton
          title="Confirm Verificaiton"
          accessibilityLabel="Confirm Verificaiton"
          onPress={() => this.confirmCode (this.state.verificationId)}
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

  render () {
    return (
      <View style={{flex: 1}}>

        {!this.state.codeSent && this.renderPhoneNumberInput ()}
        {this.state.codeSent && this.renderVerificationCodeInput ()}
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

export default connect (mapStateToProps) (MobileNumber);
