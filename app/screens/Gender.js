import React, {Component} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Content, View} from 'native-base';
import PropTypes from 'prop-types';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import Toast, {DURATION} from 'react-native-easy-toast';
import {GenderRadio, UpdateButton} from '../components/Buttton';
import {CustomHeader} from '../components/CustomHeader';
import {EtsContainer} from '../components/Container';
import {updateUser} from '../actions/login';

let Ref = '';
class Gender extends Component {
  static propTypes = {
    alertWithType: PropTypes.func,
    navigation: PropTypes.object,
    currentUser: PropTypes.object,
    dispatch: PropTypes.func,
  };

  constructor (props) {
    super (props);
    this.state = {
      gender: 'Female',
      toasterMessage: 'Updating ...',
      toasterColor: 'gray',
    };
  }

  onGenderSelect = (index, value) => {
    if (index === 0 && value === 'Female') {
      this.setState ({gender: 'Female'});
    } else if (index === 1 && value === 'Male') {
      this.setState ({gender: 'Male'});
    } else if (index === 2 && value === 'Prefer not to specify') {
      this.setState ({gender: 'Prefer not to specify'});
    }
  };

  handleUpdateName = () => {
    const db = firebase.firestore ();
    const batch = db.batch ();
    firebase.auth ().onAuthStateChanged (user => {
      if (user) {
        Ref = db.collection ('users').doc (firebase.auth ().currentUser.uid);

        batch.update (Ref, {gender: this.state.gender});
        this.props.currentUser.gender = this.state.gender;
        const currentUser = this.props.currentUser;

        batch.commit ();
        this.setState ({
          toasterColor: 'gray',
        });
        this.setState ({
          toasterMessage: 'Gender Updated Sucessfully',
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
      }
    });
  };

  render () {
    return (
      <EtsContainer>
        <View style={styles.background}>
          <CustomHeader
            title="Select Your Gender"
            goback={() => this.props.navigation.goBack ()}
            backButton
          />

          <Content style={styles.content}>

            <GenderRadio
              text1="Female"
              text2="Male"
              text3="Prefer not to specify"
              onSelect={(index, value) => this.onGenderSelect (index, value)}
            />
          </Content>
          <UpdateButton
            title="Submit"
            accessibilityLabel="Update your name"
            onPress={this.handleUpdateName}
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

export default connect (mapStateToProps) (Gender);
