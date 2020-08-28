import EStyleSheet from 'react-native-extended-stylesheet';
import {myWidth, myHeight} from '../../utils';

const INPUT_HEIGHT = myHeight * (60 / myHeight);
const ICON_WIDTH = myWidth * (35 / myWidth);
const BORDER_RADIUS = 4;

export default EStyleSheet.create ({
  container: {
    backgroundColor: 'transparent',
    height: INPUT_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS,
    marginVertical: myHeight / (myHeight * 0.1),
  },

  viasContainer: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS,
  },
  searchBarDisabled: {
    backgroundColor: 'rgba(215, 219, 221,1)'
  },

  iconDisabled: {
    overflow: 'hidden',
    backgroundColor: 'rgba(215, 219, 221,1)',
    fontSize: ICON_WIDTH,
    height: ICON_WIDTH + 1,
    width: ICON_WIDTH,
    borderRadius: ICON_WIDTH / 2,
    textAlign: 'center',

    color: '$primary',
    marginLeft: 8,
  },

  icon: {
    overflow: 'hidden',
    fontSize: ICON_WIDTH,
    height: ICON_WIDTH + 1,
    width: ICON_WIDTH,
    borderRadius: ICON_WIDTH / 2,
    textAlign: 'center',
    color: '$primary',
    backgroundColor: 'white',
    marginLeft: 8,
  },
  closeIcon: {
    fontSize: 35,
    width: 35,

    textAlign: 'center',
    color: '$primary',
  },

  searchBar: {
    padding: 0,
    height: 40,
    fontSize: 16
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '55%',
    paddingVertical: 0,
    paddingHorizontal: '4%',
  },
  text: {
    color: '$white',
    fontSize: 18,
    fontWeight: '500',
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    width: '21%',
    padding: 0,
    borderWidth: 0,
    margin: 0,
  },
  viasView: {
    flexDirection: 'row',
    paddingVertical: myHeight / (myHeight * 0.1),
    paddingLeft: '2%',
    marginRight: '2%',
  },
  viasText: {
    alignSelf: 'center',
    marginRight: '2%',
  },
});
