import React, {Component} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Content, View} from 'native-base';
import PropTypes from 'prop-types';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import Toast, {DURATION} from 'react-native-easy-toast';
import t from 'tcomb-form-native';
import {SettingsDescription} from '../components/Heading';
import {UpdateButton} from '../components/Buttton';
import {CustomHeader} from '../components/CustomHeader';
import {EtsContainer} from '../components/Container';
import {updateUser} from '../actions/login';

const _ = require ('lodash');
const V = require ('tcomb-validation');

const validate = V.validate;
const Form = t.form.Form;
const reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const emailValidator = t.refinement (t.String, email => reg.test (email));
let Ref = '';

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
    email: {
      auto: 'none',
      placeholder: 'Enter your new email address',
      keyboardType: 'email-address',
    },
  },
};

class Email extends Component {
  static propTypes = {
    alertWithType: PropTypes.func,
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
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

  handleUpdateEmail = () => {
    if (
      this._form.getValue () !== null &&
      validate (this._form.getValue ().email, emailValidator)
    ) {
      const value = this._form.getValue ();
      const emailValue = value.email;
      const db = firebase.firestore ();
      const batch = db.batch ();

      firebase.auth ().onAuthStateChanged (user => {
        if (user) {
          Ref = db.collection ('users').doc (user.uid);

          user
            .updateEmail (emailValue)
            .then (() => {
              this.props.currentUser.email = emailValue;
              const currentUser = this.props.currentUser;
              batch.update (Ref, {email: emailValue});
              batch.commit ();

              this.setState ({
                toasterColor: 'gray',
                toasterMessage: 'Email Updated Sucessfully',
              });
              this.refs.toast.show (
                this.state.toasterMessage,
                DURATION.LENGTH_LONG,
                () => {
                  this.props.dispatch (updateUser (currentUser));

                  if (currentUser.compVerified === true) {
                    this.props.navigation.state.params.onGoBack ();
                    this.props.navigation.navigate ('Settings');
                  } else {
                    this.props.navigation.navigate ('Home');
                  }
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

  render () {
    return (
      <EtsContainer>
        <View style={styles.background}>
          {this.props.currentUser.compVerified &&
            <CustomHeader
              title="Update Your Email"
              goback={() => this.props.navigation.goBack ()}
              backButton
            />}

          {!this.props.currentUser.compVerified &&
            <CustomHeader
              title="Update Your Email"
              drawerOpen={() => this.props.navigation.openDrawer ()}
            />}

          <Content style={styles.content}>

            <SettingsDescription text="Receive info about new updates and awesome promos in your inbox" />
            <Form
              ref={c => (this._form = c)}
              type={emailUpdate}
              options={options}
              value={this.state.value}
              onChange={this.onChange}
            />

          </Content>
          <UpdateButton
            title="Update"
            accessibilityLabel="Update your email address"
            onPress={this.handleUpdateEmail}
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
      </EtsContainer>
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

export default connect (mapStateToProps) (Email);
