import React, {Component} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/es/integration/react';
import {AlertProvider} from './components/Alert';
import {SplashScreenPage} from './components/SplashScreenPage';

import MainApp from './config/routes';
import configureStore from './config/store';

EStyleSheet.build ({
  $white: '#fff',
  $gray: '#444',
  $lightGray: '#C0C0C0',
  $primary: '#EA2141',
  $darkGreen: '#28a745',
  $border: '#979797',
  $inputText: '#aaaaaa',
  $primaryBlue: 'blue',
  $darkgrey: '#A9A9A9',
  $primaryDark: '#000000',
  $primaryLight: '#586176',
});

class Root extends Component {
  constructor (props) {
    super (props);
    const {store, persistor} = configureStore ();
    this.state = {
      store,
      persistor,
    };
  }

  componentWillMount () {
    console.ignoredYellowBox = ['Setting a timer'];
  }

  render () {
    return (
      <Provider store={this.state.store}>
        <PersistGate
          loading={<SplashScreenPage />}
          persistor={this.state.persistor}
        >
          <AlertProvider>
            <MainApp />
          </AlertProvider>
        </PersistGate>
      </Provider>
    );
  }
}

export default Root;
