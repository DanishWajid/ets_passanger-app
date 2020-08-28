import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  Heading: {
    color: '$primary',
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontWeight: '500',
    fontSize: 16,
  },
  Subheading: {
    color: '$primaryDark',
    paddingHorizontal: 20,

    fontWeight: '400',
    fontSize: 16,
  },
  Description: {
    color: '$primaryLight',
    paddingHorizontal: 20,

    fontWeight: '400',
    fontSize: 16,
  },
  SettingsHeading: {
    color: 'black',
    paddingVertical: 10,
    fontWeight: '400',
    fontSize: 22,
  },
  SettingsDescription: {
    color: 'grey',

    fontWeight: '100',
    fontSize: 14,
  },
});
