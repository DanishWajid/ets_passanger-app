import EStyleSheet from 'react-native-extended-stylesheet';
import {myHeight} from '../../utils';

export default EStyleSheet.create ({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  details: {
    flexDirection: 'column',
    alignSelf: 'center',
  },
  icon: {
    fontSize: 25,
    alignSelf: 'center',
    width: 25,
    textAlign: 'center',
    color: '#272f41',
  },
  container: {
    marginBottom: myHeight * 0.02,
  },
});
