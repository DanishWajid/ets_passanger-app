import EStyleSheet from 'react-native-extended-stylesheet';

const INPUT_HEIGHT = 60;
const BORDER_RADIUS = 4;

export default EStyleSheet.create ({
  container: {
    backgroundColor: '$white',
    height: INPUT_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS,
    marginVertical: 9,
    borderColor: '#d6d7',
  },

  icon: {
    fontSize: 20,
    width: 40,
    textAlign: 'center',
    color: '$primary',
  },

  input: {
    flex: 1,
    height: INPUT_HEIGHT,
    borderTopRightRadius: BORDER_RADIUS,
    paddingVertical: 0,
    paddingRight: 10,
    fontSize: 18,
    fontWeight: '400',
  },
});
