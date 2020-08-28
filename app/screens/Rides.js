import React, { Component } from 'react';
import { SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import { createMaterialTopTabNavigator } from 'react-navigation';
import { Icon } from 'native-base';
import { CustomHeader } from '../components/CustomHeader';
import Scheduled from './Scheduled';
import History from './History';

export default class Rides extends Component {
  static propTypes = {
    alertWithType: PropTypes.func,
    navigation: PropTypes.object,
  };

  static navigationOptions = () => ({
    title: 'Your Rides',

    drawerLabel: 'Your Rides',
    drawerIcon: () => <Icon size={150} name="car" style={{ fontSize: 20 }} />,
  });

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          title="Your Rides"
          drawerOpen={() => this.props.navigation.openDrawer()}
        />
        <AppTabNavigator />

      </SafeAreaView>
    );
  }
}

const AppTabNavigator = createMaterialTopTabNavigator(
  {
    Scheduled: {
      screen: Scheduled,
      navigationOptions: {
        tabBarLabel: 'SCHEDULED',
      },
    },
    History: {
      screen: History,
      navigationOptions: {
        tabBarLabel: 'HISTORY',
      },
    },
  },
  {
    initialRouteName: 'History',
    headerTitle: 'Hello rides',
    tabBarOptions: {
      activeTintColor: '#EA2141',
      inactiveTintColor: '#000000',
      labelStyle: {
        fontSize: 13,
        fontWeight: 'bold',
      },
      style: {
        backgroundColor: '#ffffff',
      },
      indicatorStyle: {
        backgroundColor: '#EA2141',
      },
    },
  },
);
