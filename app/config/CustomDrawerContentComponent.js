import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DrawerItems} from 'react-navigation';
import EStyleSheet from 'react-native-extended-stylesheet';
import {connect} from 'react-redux';
import {Image, StatusBar, View} from 'react-native';
import {
  Container,
  Header,
  Body,
  Content,
  Text,
  StyleProvider,
} from 'native-base';

import getTheme from '../../native-base-theme/components';
import commonColor from '../../native-base-theme/variables/commonColor';

class CustomDrawerContentComponent extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    loggedIn: PropTypes.bool,
    dispatch: PropTypes.func,
    userLoggedIn: PropTypes.bool,
    currentUser: PropTypes.any,
  };

  render () {
    return (
      <StyleProvider style={getTheme (commonColor)}>
        <Container style={styles.container}>
          <Header style={styles.drawerHeader}>
            <Body>
              <View style={styles.box}>
                <Image
                  style={styles.profilePic}
                  source={require ('../assets/contactIcon.png')}
                />
                {this.props.currentUser &&
                  <Text style={styles.text}>

                    {`${this.props.currentUser.firstName} ${this.props.currentUser.lastName}`}

                  </Text>}

              </View>
            </Body>
          </Header>
          <Content>
            <View style={styles.separator} />
            <DrawerItems
              {...this.props}
              activeTintColor="#EA2141"
              inactiveTintColor="#111111"
              inactiveBackgroundColor="transparent"
              style={{backgroundColor: '#000000'}}
              labelStyle={{fontSize: 16, fontWeight: '400'}}
            />
            <View style={styles.separator} />
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

const styles = EStyleSheet.create ({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  drawerHeader: {
    height: 180,
    backgroundColor: 'white',
  },
  box: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    paddingTop: 70,
  },
  profilePic: {
    height: 60,
    width: 60,
    borderRadius: 30,
    alignSelf: 'center',
  },

  text: {
    color: '#000',
    fontSize: 22.5,
    fontWeight: 'bold',
    paddingTop: 17,
    paddingBottom: 70,
  },
  separator: {
    backgroundColor: '#e2e0e0',
    height: 1.05,
  },
});

const mapStateToProps = state => {
  const userLoggedIn = state.login.userLoggedIn;
  const currentUser = state.login.currentUser;

  return {
    ...state,
    userLoggedIn,
    currentUser,
  };
};

export default connect (mapStateToProps) (CustomDrawerContentComponent);
