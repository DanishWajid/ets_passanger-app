import EStyleSheet from 'react-native-extended-stylesheet';
import {StatusBar, Platform} from 'react-native';
import {myWidth} from '../../utils';

export default EStyleSheet.create ({
  primaryHeader: {
    // marginTop: StatusBar.currentHeight,
    backgroundColor: '$primary',
    justifyContent: 'center',
    alignItems: 'center',
  },

  transparentHeader: {
    // marginTop: StatusBar.currentHeight,
    backgroundColor: 'transparent',
  },

  icon: {
    width: myWidth / (myWidth * 0.005),
    marginTop: Platform.OS === 'ios' ? 12.5 : StatusBar.currentHeight,
    height: '90%',
    paddingLeft: myWidth / (myWidth * 0.1),
    color: '#ffffff',

    alignSelf: 'center',
  },

  heading: {
    color: 'white',
    fontSize: 30,
    fontWeight: '500',
    alignSelf: 'center',
  },
  body: {
    paddingLeft: 20,
    flex: 3,
  },
  iosHeading: {
    color: 'white',
    fontSize: 30,
    alignSelf: 'center',
  },
  iosSmallHeading: {
    color: 'white',
    fontSize: 23,
    fontWeight: '500',
    alignSelf: 'center',
  },
  iosBody: {
    flex: 7,
  },
});
