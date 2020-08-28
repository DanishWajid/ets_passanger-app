import EStyleSheet from 'react-native-extended-stylesheet';
import {myWidth, myHeight} from '../../utils';

const BORDER_RADIUS = 4;

export default EStyleSheet.create ({
  passangerInnercontainer: {
    backgroundColor: 'white',
    height: myHeight / 16,
    borderRadius: BORDER_RADIUS,
    marginTop: 9,
  },
  passangerContainer: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS,
    marginVertical: myHeight / 80 + 1,
  },

  dateContainer: {
    flexDirection: 'row',
  },
  dateBar: {
    backgroundColor: '$white',
    width: myWidth / 4.5,
    alignItems: 'center',
    marginLeft: '4%',
    borderRadius: 20,
    justifyContent: 'center',
    shadowColor: 'grey',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
  },
  LuggageBar: {
    backgroundColor: '$white',
    alignItems: 'center',
    paddingHorizontal: '3%',
    marginLeft: '17.5%',
    borderRadius: 20,
    justifyContent: 'center',
    shadowColor: 'grey',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
  },
  PassengerBar: {
    backgroundColor: '$white',
    paddingHorizontal: '3%',
    alignItems: 'center',
    marginLeft: '9.5%',
    borderRadius: 20,
    justifyContent: 'center',
    shadowColor: 'grey',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
  },
  passangerDropdown: {
    flex: 1,
    width: myWidth * 0.355,
    height: myHeight / 16 - 20,
  },
  contactDropdown: {
    width: myWidth * 0.39,
    height: myHeight / 16 - 20,
  },
  luggageDropdown: {
    width: myWidth * 0.355,
    height: myHeight / 16 - 20,
  },
  text: {
    color: '$inputText',
    fontSize: 18,
    fontWeight: '500',
    marginLeft: '1%',
  },
  icon: {
    fontSize: 20,
    width: myWidth / 18,
    textAlign: 'center',
    alignSelf: 'center',
    color: '$primary',
    marginLeft: 8,
  },
  iosIcon: {
    fontSize: 18,
    width: myWidth / 18,
    textAlign: 'center',
    color: '$primary',
    marginLeft: 8,
  },
  time: {
    color: '$primary',
    backgroundColor: '$primary',
  },
  pickerText:{
    color:'black',
  }
});
