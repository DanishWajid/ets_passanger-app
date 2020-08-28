import React, {Component} from 'react';
import PropTypes from 'prop-types';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import {View, StyleSheet} from 'react-native';
import {Button, Icon, Text, Content} from 'native-base';
import {CustomHeader} from '../components/CustomHeader';
import {EtsContainer} from '../components/Container';
import {updateUser} from '../actions/login';

class VerifyEmail extends Component {
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
      emailSent: false,
    };
  }

  componentDidMount () {
    this.unsubscribe = firebase.auth ().onAuthStateChanged (user => {
      if (user) {
        console.log ('Current auth state in listerner', user);
      }
    });
  }

  componentWillUnmount () {}

  verifyEmail = () => {
    this.setState ({message: 'Sending code ...'});

    firebase
      .auth ()
      .currentUser.sendEmailVerification ()
      .then (() => {
        this.setState ({emailSent: true, message: 'Email Sent'});
      })
      .catch (() => {
        this.setState ({emailSent: false});
      });
  };

  confirmVerification = () => {
    const currentUser = this.props.currentUser;
    const userLoginData = this.props.userLoginData;
    const credential = firebase.auth.EmailAuthProvider.credential (
      currentUser.email,
      currentUser.pass
    );
    firebase
      .auth ()
      .currentUser.reauthenticateWithCredential (credential)
      .then (data => {
        const newData = data.user.toJSON ();

        currentUser.firebaseData = newData;
        currentUser.emailVerified = newData.emailVerified;

        if (currentUser.emailVerified) {
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
          this.setState ({message: 'Email is confirmed'});
          // this.props.navigation.navigate ('Home', {successEmailVer: true});
          this.props.navigation.state.params.onGoBack ();
          this.props.navigation.navigate ('LimitedAccess', {
            successEmailVer: true,
          });
        } else {
          this.setState ({
            message: 'Email is Not confirmed yet, Please verify email first',
          });
        }
      })
      .catch (err => console.log ('Error Re-authentications', err));
  };

  signOut = () => {
    console.log ('Signout method');
    firebase.auth ().signOut ();
  };

  renderEmailVerifcationBox () {
    return (
      <View style={styles.container}>

        <Text style={styles.text}> Your email is</Text>
        <View style={styles.border}>
          <Text style={styles.email}>{this.props.currentUser.email}</Text>
        </View>

        <Button
          iconLeft
          rounded
          style={styles.button}
          onPress={this.verifyEmail}
        >
          <Icon name="mail" />
          <Text>Verify Email</Text>
        </Button>

      </View>
    );
  }

  renderMessage () {
    const {message} = this.state;

    if (!message.length) return null;

    return (
      <Text style={{padding: 5, backgroundColor: '#EA2141', color: '#ffffff'}}>
        {message}
      </Text>
    );
  }

  renderConfirmationBox () {
    return (
      <View style={styles.container}>

        <Text style={styles.text}> Email has been sent to</Text>
        <View style={styles.border}>
          <Text style={styles.email}>{this.props.currentUser.email}</Text>
        </View>

        <Button
          style={styles.button}
          rounded
          onPress={this.confirmVerification}
        >
          <Text>Confirm Verificiation</Text>
        </Button>

      </View>
    );
  }

  render () {
    console.log ('Current auth state', firebase.auth ().currentUser);
    return (
      <EtsContainer>
        <CustomHeader
          title="Verify Email"
          goback={() => this.props.navigation.goBack ()}
          backButton
        />
        <Content contentContainerStyle={styles.container}>
          <View style={{flex: 1}}>
            {!this.state.emailSent && this.renderEmailVerifcationBox ()}
            {this.state.emailSent && this.renderConfirmationBox ()}
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
    marginTop: 15,
  },
});

const mapStateToProps = state => ({
  currentUser: state.login.currentUser,
  userLoginData: state.login.userLoginData,
});

export default connect (mapStateToProps) (VerifyEmail);
