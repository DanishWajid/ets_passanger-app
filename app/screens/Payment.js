import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Icon, Content} from 'native-base';
import {ImageBackground, ScrollView, View, Alert} from 'react-native';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import {SubmitButton, PaymentRadio} from '../components/Buttton';
import {CustomHeader} from '../components/CustomHeader';
import {myHeight} from '../utils';
import {EtsContainer} from '../components/Container';
import {Stripe} from '../components/Stripe';

const BORDER_RADIUS = 20;

class Payment extends Component {
  static propTypes = {
    title: PropTypes.string,
    drawerOpen: PropTypes.func,
    goback: PropTypes.func,
    alertWithType: PropTypes.func,
    navigation: PropTypes.object,
    currentUser: PropTypes.object,
  };

  constructor (props) {
    super (props);
    this.state = {
      charged: false,
      payedOnline: false,
    };
  }

  onSelect (index, value) {
    if (index === 0 && value === 'Cash') {
      this.setState ({payedOnline: false, charged: true});
    } else {
      this.setState ({payedOnline: true, charged: false});
    }
  }

  onPaymentSuccess = () => {
    this.setState ({
      charged: true,
    });
  };

  navigateToHome = () => {
    this.props.navigation.reset (
      [NavigationActions.navigate ({routeName: 'Home'})],
      0
    );
  };

  confirmQuote = () => {
    const {navObject = {}} = this.props.navigation.state.params || {};
    const db = firebase.firestore ();
    db
      .collection ('ride')
      .doc ()
      .set ({
        ...navObject,
        customerId: db.collection ('users').doc (this.props.currentUser.uid),
        payedOnline: this.state.payedOnline,
      })
      .then (() => {
        Alert.alert (
          'Confirmation',
          'Your ride booked successfully.',
          [{text: 'OK', onPress: () => this.navigateToHome ()}],
          {cancelable: false}
        );
      })
      .catch (error => {
        alert (error.message);
      });
  };

  static navigationOptions = () => ({
    title: 'Home',

    drawerLabel: 'Home',
    drawerIcon: () => <Icon name="home" style={{fontSize: 20}} />,
  });

  render () {
    const {charged, payedOnline} = this.state;
    const {navObject = {}} = this.props.navigation.state.params || {};
    const {fare} = navObject;
    return (
      <EtsContainer>
        <ImageBackground
          source={require ('../assets/caroverlay.jpg')}
          style={styles.background}
        >
          <CustomHeader
            title="Payment"
            goback={() => this.props.navigation.goBack ()}
            primaryHeader={false}
            transparent
            backButton
          />
          <ScrollView>
            <Content style={styles.content}>
              <View style={styles.carContainer}>
                {charged}
                <PaymentRadio
                  text1="Cash"
                  text2="Credit Card"
                  disabled={charged}
                  onSelect={(index, value) => this.onSelect (index, value)}
                />
              </View>
            </Content>
            <SubmitButton
              title="Confirm"
              disabled={payedOnline && !charged}
              onPress={this.confirmQuote}
            />
          </ScrollView>
          {this.state.payedOnline &&
            <Stripe fare={fare} onPayment={this.onPaymentSuccess} />}
        </ImageBackground>
      </EtsContainer>
    );
  }
}

const styles = EStyleSheet.create ({
  background: {
    width: '100%',
    height: '100%',
  },
  carContainer: {
    backgroundColor: 'white',
    height: myHeight / 1.5,
    borderRadius: BORDER_RADIUS,
    marginVertical: 9,
    paddingBottom: 9,
  },
  content: {
    paddingHorizontal: '5%',
  },
});

Payment.propTypes = {
  itemId: PropTypes.number,
};

const mapStateToProps = state => {
  const currentUser = state.login.currentUser;
  return {
    currentUser,
  };
};

export default connect (mapStateToProps) (Payment);
