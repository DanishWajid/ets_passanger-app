import React, {Component} from 'react';
import {StyleSheet, Text, Platform} from 'react-native';
import firebase from 'react-native-firebase';
import PropTypes from 'prop-types';
import {View} from 'native-base';
import ImageOverlay from 'react-native-image-overlay';
import {connect} from 'react-redux';
import t from 'tcomb-form-native';
import Toast, {DURATION} from 'react-native-easy-toast';
import {CustomHeader} from '../components/CustomHeader';
import {UpdateButton} from '../components/Buttton';
import {myHeight} from '../utils';
import {EtsContainer} from '../components/Container';
import {ContactReason, IosContactReason} from '../components/RideDetails';

const _ = require ('lodash');

const Form = t.form.Form;

const length = s => s.length <= 250;

const request = t.refinement (t.String, s => length (s));

request.getValidationErrorMessage = function (value) {
  if (!value) {
    return '*Required field';
  }
  if (value.length > 250) {
    return 'Max limit exceed';
  }
};

const stylesheet = _.cloneDeep (t.form.Form.stylesheet);

stylesheet.textbox.normal.borderWidth = 0;
stylesheet.textbox.error.borderWidth = 0;
stylesheet.textboxView.normal.borderWidth = 1;
stylesheet.textboxView.error.borderWidth = 1;
stylesheet.textboxView.normal.borderColor = '#878787';
stylesheet.textboxView.error.borderColor = 'brown';
stylesheet.textbox.normal.height = 150;
stylesheet.textbox.error.height = 150;
stylesheet.textboxView.normal.paddingVertical = 5;
stylesheet.textboxView.error.paddingVertical = 5;
stylesheet.textboxView.normal.marginBottom = 5;
stylesheet.textboxView.error.marginBottom = 5;
stylesheet.textbox.normal.fontSize = 17;
stylesheet.textbox.error.fontSize = 17;
stylesheet.textbox.normal.textAlignVertical = 'top';
stylesheet.textbox.error.textAlignVertical = 'top';

const contact = t.struct ({
  message: request,
});

const options = {
  stylesheet,
  fields: {
    message: {
      auto: 'none',
      placeholder: 'Message',
      multiline: true,
    },
  },
};

class Contact extends Component {
  static propTypes = {
    alertWithType: PropTypes.func,
    navigation: PropTypes.object,
    currentUser: PropTypes.object,
  };

  constructor (props) {
    super (props);
    this.state = {
      reason: 'Complaint',
      toasterMessage: 'Submitting ...',
      toasterColor: 'gray',
    };
  }

  contactReasonCallback = dataFromChild => {
    this.setState ({reason: dataFromChild});
  };

  onChange = value => {
    this.setState ({value});
  };

  submit = () => {
    if (this._form.getValue () !== null) {
      const db = firebase.firestore ();
      const value = this._form.getValue ();
      db
        .collection ('contact')
        .doc ()
        .set ({
          contactReason: this.state.reason,
          message: value.message,
          userId: db.collection ('users').doc (this.props.currentUser.uid),
        })
        .then (() => {
          this.setState ({value: null});
          this.setState ({
            toasterColor: 'gray',
            toasterMessage: 'Request Submitted Sucessfully',
          });
          this.refs.toast.show (
            this.state.toasterMessage,
            DURATION.LENGTH_LONG
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
  };

  render () {
    return (
      <EtsContainer>

        <CustomHeader
          title="Contact Us"
          drawerOpen={() => this.props.navigation.openDrawer ()}
        />

        <ImageOverlay
          source={require ('../assets/contact_us.png')}
          contentPosition="center"
          height={0.21 * myHeight}
          overlayColor="#EA2341"
        >

          <Text style={styles.imageContent}>Get in touch with us</Text>
        </ImageOverlay>

        <View style={styles.content}>

          {Platform.OS === 'android' &&
            <ContactReason callbackFromParent={this.contactReasonCallback} />}
          {Platform.OS === 'ios' &&
            <IosContactReason
              callbackFromParent={this.contactReasonCallback}
            />}

          <Form
            ref={c => (this._form = c)}
            type={contact}
            options={options}
            value={this.state.value}
            onChange={this.onChange}
          />
        </View>
        <UpdateButton
          title="Submit"
          accessibilityLabel="Submit your request"
          onPress={() => this.submit ()}
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
      </EtsContainer>
    );
  }
}
const styles = StyleSheet.create ({
  background: {
    backgroundColor: 'white',
    flex: 0,
    justifyContent: 'center',
  },
  imageContent: {
    color: 'white',
    fontSize: 30,
  },
  content: {
    paddingHorizontal: '5%',
    paddingVertical: '2%',
  },

  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

const mapStateToProps = state => {
  const currentUser = state.login.currentUser;
  return {
    currentUser,
  };
};

export default connect (mapStateToProps) (Contact);
