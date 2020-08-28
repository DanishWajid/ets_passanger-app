import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet} from 'react-native';
import {Button, Icon, Text} from 'native-base';
import {connect} from 'react-redux';
import {EtsContainer} from '../components/Container';
import {CustomHeader} from '../components/CustomHeader';

class LimitedAccess extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    currentUser: PropTypes.object,
  };

  static navigationOptions = () => ({
    title: 'Limited Access',
    drawerLabel: 'Limited Access',
    drawerIcon: () => <Icon name="md-cog" style={{fontSize: 20}} />,
  });

  constructor (props) {
    super (props);
    this.state = {};
  }

  refresh () {
    this.forceUpdate ();
  }

  render () {
    const emailVerified = this.props.currentUser.emailVerified;
    const phoneVerified = this.props.currentUser.phoneVerified;

    return (
      <EtsContainer>
        <CustomHeader
          title="Limited Access"
          drawerOpen={() => this.props.navigation.openDrawer ()}
        />

        <View style={styles.container}>
          <Text style={styles.text}>
            {emailVerified && phoneVerified
              ? 'Your account is Verified'
              : 'Verify your identity'}
            {' '}
          </Text>

          {!emailVerified &&
            <Button
              iconLeft
              rounded
              style={styles.button}
              onPress={() =>
                this.props.navigation.navigate ('VerifyEmail', {
                  onGoBack: () => this.refresh (),
                })}
            >
              <Icon name="mail" />
              <Text>
                Verify Email
              </Text>
            </Button>}

          {emailVerified &&
            !phoneVerified &&
            <Button
              iconLeft
              rounded
              style={styles.button}
              disabled={phoneVerified}
              onPress={() =>
                this.props.navigation.navigate ('VerifyPhone', {
                  onGoBack: () => this.refresh (),
                })}
            >
              <Icon name="call" />
              <Text>
                Verify Phone
              </Text>
            </Button>}

          {emailVerified &&
            phoneVerified &&
            <Button
              iconLeft
              rounded
              style={styles.button}
              disabled={!phoneVerified || !emailVerified}
              onPress={() => this.props.navigation.navigate ('SignedIn')}
            >
              <Icon name="home" />
              <Text>Go To Main App</Text>
            </Button>}

        </View>
      </EtsContainer>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    justifyContent: 'center',
    flex: 1,
  },
  icon: {
    alignSelf: 'center',
  },
  text: {
    alignSelf: 'center',
    color: '#EA2141',
    fontSize: 25,
    fontWeight: 'bold',
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

export default connect (mapStateToProps) (LimitedAccess);
