import EStyleSheet from 'react-native-extended-stylesheet';
import {myHeight} from '../../utils';

export default EStyleSheet.create ({
  SettingsInput: {
    height: myHeight / 14.2222222222,
    paddingHorizontal: 5,
    width: '100%',
    fontSize: 15,
    marginTop: '8%',
    borderBottomWidth: 1,
  },
  lsInput: {
    height: myHeight / 14.2222222222,
    paddingHorizontal: 5,
    width: '100%',
    fontSize: 15,
    marginTop: '5%',
    color: '#707070',
    alignSelf: 'center',
  },
  smallInput: {
    height: myHeight / 14.2222222222,
    paddingHorizontal: 5,
    width: '50%',
    fontSize: 15,
    marginTop: '5%',
    color: '#707070',
    alignSelf: 'center',
  },
  ContactInput: {
    height: myHeight / 14.2222222222,
    paddingHorizontal: 5,
    width: '100%',
    fontSize: 15,
    borderBottomWidth: 1,
  },
});
