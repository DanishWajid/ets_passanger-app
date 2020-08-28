import EStyleSheet from 'react-native-extended-stylesheet';
import {myHeight, myWidth} from '../../utils';

const BORDER_RADIUS = 20;

export default EStyleSheet.create ({
  RideSummaryContainer: {
    backgroundColor: 'white',
    height: myHeight / 1.5,
    borderRadius: BORDER_RADIUS,
    marginVertical: 9,
  },
  body: {
    marginHorizontal: 20,
  },
  labelBox: {
    width: 100,
  },
  text: {
    fontWeight: 'bold',
  },
  vias: {
    flexDirection: 'row',
  },
  outerContainer: {
    flex: 1,
    paddingHorizontal: '5%',
    flexDirection: 'row',
    paddingVertical: 15,
  },

  allText: {
    fontSize: 18,
  },
  container: {
    flexDirection: 'row',
  },
  iconText: {
    marginRight: 5,
    fontSize: 18,
  },
  icon: {
    fontSize: 20,
    width: myWidth / 18,
    textAlign: 'center',
    alignSelf: 'center',
    color: '$primary',
  },
  mainText: {
    marginRight: 25,
    fontWeight: '500',
    fontSize: 18,
  },
  dropContainer: {
    backgroundColor: '#F3F6F8',
    paddingHorizontal: '5%',
    paddingVertical: 15,
  },
  dateContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  timeContainer: {
    flexDirection: 'row',
  },
  dateTimeText: {
    fontSize: 16,
  },
  dropIcon: {
    fontSize: 20,
    height: 18,
    width: myWidth / 18,
    textAlign: 'center',
    alignSelf: 'center',
    color: '#707070',
  },
  mainCont: {
    flex: 1,
  },
});
