import EStyleSheet from 'react-native-extended-stylesheet';
import {myWidth} from '../../utils';

const BORDER_RADIUS = 4;

export default EStyleSheet.create ({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    borderRadius: BORDER_RADIUS,
  },
  text: {
    color: '$white',
    fontSize: 18,
    fontWeight: '500',
  },
  darktext: {
    color: 'black',
    fontSize: 15,
    fontWeight: '400',
  },
  radioButton: {
    width: myWidth / 3,
    paddingLeft: myWidth / 20,
  },
  updateButton: {
    backgroundColor: '$primary',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 5,
    height: 60,
  },

  textStyle: {
    fontSize: 15,
    textAlign: 'center',
    paddingLeft: 35,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '$primary',
    borderColor: 'transparent',
    width: '50%',
    borderWidth: 0,
    borderRadius: 30,
    height: 50,
    alignSelf: 'flex-end',
    marginBottom:15,
  },
  lsButton: {
    backgroundColor: '$primary',
    borderColor: 'transparent',
    width: '90%',
    borderWidth: 0,
    borderRadius: 30,
    height: 60,
    alignSelf: 'center',
    marginTop: 10,
  },
  fwButton: {
    backgroundColor: '$primary',
    width: 1000,
    height: 60,
  },
});
