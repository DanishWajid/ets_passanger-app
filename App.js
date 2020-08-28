import React, {Component} from 'react';
import {YellowBox, BackHandler, Platform} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import App from './app/index';
import { MenuProvider } from 'react-native-popup-menu'

export default class MainApp extends Component {
  componentDidMount () {
    YellowBox.ignoreWarnings (['Require cycle:']);
    SplashScreen.hide ();
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener ('hardwareBackPress');
    }
  }

  render () {
    return <MenuProvider><App /></MenuProvider>;
  }
}
