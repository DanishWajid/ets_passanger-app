import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create ({
  row: {
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomRow: {
    flexDirection: 'row',
  },
  icon: {
    color: '$primary',
    fontSize: 15,
    width: 15,
    marginRight: 5,
    alignSelf: 'center',
    textAlign: 'center',
  },
  heading: {
    fontSize: 17,
    fontWeight: '600',
    color: '#272f41',
  },
  stops: {
    color: '$primaryLight',
    fontWeight: '400',
  },
  separator: {
    backgroundColor: '$lightGray',
    height: 1,
    flex: 1,
  },
  anotherSeparator: {
    backgroundColor: '$lightGray',
    height: 0.5,
    flex: 1,
  },
});
