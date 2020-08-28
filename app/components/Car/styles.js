import EStyleSheet from 'react-native-extended-stylesheet';
import {myWidth} from '../../utils';

export default EStyleSheet.create ({
  carName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    marginLeft: myWidth / 72,
    alignSelf: 'center',
  },
  icon: {
    fontSize: 20,
    width: myWidth / 18,
    textAlign: 'center',
    alignSelf: 'center',
    color: '$primary',
  },
});
