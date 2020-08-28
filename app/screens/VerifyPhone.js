import React, {Component} from 'react';
import PropTypes from 'prop-types';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import {View, StyleSheet} from 'react-native';
import t from 'tcomb-form-native';
import {Button, Icon, Text, Content} from 'native-base';
import {EtsContainer} from '../components/Container';
import {CustomHeader} from '../components/CustomHeader';
import {updateUser} from '../actions/login';

const _ = require ('lodash');

const Form = t.form.Form;
const reg = /^(\+44\s?7\d{3})\s?\d{3}\s?\d{3}$/;

const phoneValidator = t.refinement (t.String, s => reg.test (s));

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
stylesheet.textboxView.normal.borderRadius = 20;
stylesheet.textboxView.error.borderRadius = 20;
stylesheet.textboxView.normal.borderWidth = 0;
stylesheet.textboxView.error.borderWidth = 0;
stylesheet.textboxView.normal.borderWidth = 3;
stylesheet.textboxView.error.borderWidth = 3;
stylesheet.textboxView.normal.borderColor = '#EA2141';
stylesheet.textboxView.error.borderColor = 'brown';
stylesheet.textboxView.normal.width = 300;
stylesheet.errorBlock.marginLeft = 35;
stylesheet.textbox.error.width = 300;
stylesheet.textbox.normal.width = 300;
stylesheet.textboxView.error.width = 300;
stylesheet.textboxView.normal.alignSelf = 'center';
stylesheet.textboxView.error.alignSelf = 'center';
stylesheet.textbox.normal.fontSize = 15;
stylesheet.textbox.error.fontSize = 15;
stylesheet.textboxView.normal.marginBottom = 0;
stylesheet.textboxView.error.marginBottom = 0;
stylesheet.textboxView.normal.marginTop = 20;
stylesheet.textboxView.error.marginTop = 20;

const options = {
  stylesheet,
  fields: {
    code: {
      auto: 'none',
      placeholder: 'Code ...',
      keyboardType: 'phone-pad',
      error: '*Required field',
    },
    phone: {
      auto: 'none',
      placeholder: 'Format: +44 XXXX XXXXXX',
      keyboardType: 'phone-pad',
    },
  },
};
class VerifyPhone extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    currentUser: PropTypes.object,
    userLoginData: PropTypes.object,
  };

  constructor (props) {
    super (props);
    this.unsubscribe = null;
    this.state = {
      message: '',
      phoneVerified: false,
      codeSent: false,
    };
  }

  onChange = value => {
    this.setState ({value});
  };

  componentWillUnmount () {
    if (this.unsubscribe) this.unsubscribe ();
  }

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
                message: phoneAuthSnapshot.error.message,
              });

              break;
          }
        },
        error => {
          this.setState ({
            message: error.message,
          });
        }
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

          currentUser.phoneVerified = newData.phoneNumber !== null;
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
        })
        .catch (err => {
          this.setState ({
            message: err.message,
          });
        });
    }
  };

  renderPhoneNumberInput () {
    return (
      <View style={styles.container}>

        <Text style={styles.text}> Your phone number is</Text>
        <Form
          ref={c => (this._form = c)}
          type={numberUpdate}
          options={options}
          value={this.state.value}
          onChange={this.onChange}
        />

        <Button
          iconLeft
          rounded
          style={styles.button}
          onPress={this.verifyPhone}
        >
          <Icon name="call" />
          <Text>Verify Phone</Text>
        </Button>

      </View>
    );
  }

  renderMessage () {
    const {message} = this.state;
    if (!message.length) return null;
    return (
      <Text style={{padding: 5, backgroundColor: '#EA2141', color: '#fff'}}>
        {message}
      </Text>
    );
  }

  renderVerificationCodeInput () {
    return (
      <View style={styles.container}>

        <Text style={styles.text}>Enter verification code below:</Text>

        <Form
          ref={c => (this._form = c)}
          type={codeSent}
          options={options}
          value={this.state.value}
          onChange={this.onChange}
        />

        <Button
          style={styles.button}
          rounded
          onPress={() => this.confirmCode (this.state.verificationId)}
        >
          <Text>Confirm Verificaiton</Text>
        </Button>

      </View>
    );
  }

  render () {
    return (
      <EtsContainer>
        <CustomHeader
          title="Verify Phone"
          goback={() => this.props.navigation.goBack ()}
          backButton
        />
        <Content contentContainerStyle={styles.container}>
          <View style={{flex: 1}}>
            {!this.state.codeSent && this.renderPhoneNumberInput ()}
            {this.state.codeSent &&
              !this.state.phoneVerified &&
              this.renderVerificationCodeInput ()}
            {this.renderMessage ()}
          </View>
        </Content>
      </EtsContainer>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    alignSelf: 'center',
    color: '#EA2141',
    fontSize: 25,
    fontWeight: 'bold',
  },
  border: {
    borderColor: '#EA2141',
    borderRadius: 20,
    borderWidth: 3,
    width: 300,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  email: {
    alignSelf: 'center',
    color: '#EA2141',
    fontSize: 20,
  },
  button: {
    backgroundColor: '#EA2141',
    alignSelf: 'center',
    justifyContent: 'center',
    width: 300,
    marginTop: 5,
  },
});

const mapStateToProps = state => ({
  currentUser: state.login.currentUser,
  userLoginData: state.login.userLoginData,
});

export default connect (mapStateToProps) (VerifyPhone);
