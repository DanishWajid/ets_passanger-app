import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Content} from 'native-base';
import {
  ImageBackground,
  ScrollView,
  View,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import firebase from 'react-native-firebase';
import {isEmpty, union} from 'lodash';
import {NavigationActions} from 'react-navigation';
import {SubmitButton} from '../components/Buttton';
import {Car} from '../components/Car';
import {CustomHeader} from '../components/CustomHeader';
import {calculateFare, getDistance, myHeight} from '../utils';
import {EtsContainer} from '../components/Container';

const db = firebase.firestore ();
const BORDER_RADIUS = 20;
let plots = [];
const plotTariffs = [];

class QuoteSelection extends Component {
  static propTypes = {
    title: PropTypes.string,
    drawerOpen: PropTypes.func,
    alertWithType: PropTypes.func,
    navigation: PropTypes.object,
  };

  constructor (props) {
    super (props);
    this.state = {
      fare: 0,
      carId: '',
      carDetails: [],
      meetGreet: false,
      returnDiscount: 0,
      selectedCarIndex: 0,
      setCarName: 'Wheelchair Accessible',
    };
  }

  componentDidMount () {
    this.setState ({
      loader: true,
    });

    this.getCars ();
  }

  confirmQuote = () => {
    const {setCarName: car, fare, carId} = this.state;
    const {navObject = {}} = this.props.navigation.state.params || {};
    const {pickup = {}, drop = {}, viaLocations} = navObject;

    this.props.navigation.navigate ('RideDetails', {
      navObject: {
        ...navObject,
        fare,
        car,
        carId,
        drop: drop.description,
        pickup: pickup.description,
        viaLocations: viaLocations.map (item => item.description),
      },
    });
  };

  getPlotName = (code = '') => {
    const index = plots.findIndex (
      ({areaCode = []}) => areaCode.findIndex (c => code === c) !== -1
    );
    const {name = ''} = plots[index];
    return name;
  };

  getTariffsList = async (p1, p2) => {
    const {tariffs: tArray = []} = plotTariffs[0] || {};
    const ind = tArray.findIndex (({toPlot}) => toPlot === p2);
    const {tariffRef: tariffList = {}} = tArray[ind] || {};
    const data = await tariffList.get ();
    return data._data;
  };

  navigateToHome = () => {
    this.props.navigation.reset (
      [NavigationActions.navigate ({routeName: 'Home'})],
      0
    );
  };

  getTotalFare = async () => {
    const {navObject = {}} = this.props.navigation.state.params || {};
    const {pickup = {}, drop = {}, viaLocations: stops = []} = navObject;
    const locations = union ([pickup], stops, [drop]);

    let allowed = true;
    for (let i = 0; i < plots.length; i++) {
      if (plots[i].enabled !== true) {
        allowed = false;
      }
    }

    if (locations.length === plots.length && allowed) {
      this.setState ({
        loader: true,
      });

      await this.getTotalDistance ();
    } else {
      Alert.alert (
        'No Service',
        'We do not offer services in this area',
        [{text: 'OK', onPress: () => this.navigateToHome ()}],
        {cancelable: false}
      );
    }
  };

  getTotalDistance = async () => {
    const {meetGreet, returnDiscount} = this.state;
    const {navObject = {}} = this.props.navigation.state.params || {};
    const {
      pickup = {},
      drop = {},
      viaLocations: stops,
      return: returnAlso,
    } = navObject;
    const locations = union (stops, [drop]);
    let fare = 0;
    let firstLoc = pickup;
    if (!isEmpty (locations)) {
      locations.forEach (async (item, index) => {
        const {lat, lng, code} = firstLoc;
        const firstP = this.getPlotName (code);
        const secondP = this.getPlotName (item.code);
        const tariffList = await this.getTariffsList (firstP, secondP);
        const dist = getDistance (lat, lng, item.lat, item.lng);
        fare += calculateFare (tariffList.prices, dist);
        firstLoc = item;
        if (index === locations.length - 1) {
          if (returnAlso) {
            fare *= 2;
            fare -= fare * returnDiscount / 100;
          }
          this.setState ({
            loader: false,
            fare: meetGreet ? fare + meetGreet : fare,
          });
        }
      });
    }
  };

  getAllPlots = async () => {
    plots = [];
    const {navObject = {}} = this.props.navigation.state.params || {};
    const {pickup = {}, drop = {}, viaLocations: stops = []} = navObject;
    const locations = union ([pickup], stops, [drop]);
    locations.forEach (async (loc, index) => {
      await this.getPlots (loc);
      if (index === locations.length - 1) {
        setTimeout (this.getPlotTariffs, 2000);
      }
    });
  };

  setSelectedCar = (selectedCarIndex, {carType, id: carId}) => {
    this.setState ({
      carId,
      selectedCarIndex,
      setCarName: carType,
    });
  };

  getPlots = async ({code}) => {
    db
      .collection ('plots')
      .where ('areaCode', 'array-contains', code)
      .get ()
      .then (QuerySnapshot => {
        QuerySnapshot.forEach (async doc => {
          await plots.push (doc.data ());
        });
      });
  };

  getPlotTariffs = async () => {
    const {navObject = {}} = this.props.navigation.state.params || {};
    const {meetGreet = false, return: returnAlso = false} = navObject;
    const name = plots[0] ? plots[0].name : '';

    db
      .collection ('plotTariffs')
      .where ('fromPlot', '==', name)
      .get ()
      .then (QuerySnapshot => {
        let i = 0;
        QuerySnapshot.forEach (doc => {
          plotTariffs[i] = doc.data ();
          i += 1;
        });
      })
      .then (() => {
        if (meetGreet || returnAlso) {
          if (meetGreet) {
            this.getMeeGreet ();
          }
          if (returnAlso) {
            this.getReturnDiscount ();
          }
        } else {
          this.setState ({loader: false});
        }
      });
  };

  getMeeGreet = () => {
    let meetGreet = null;
    db.collection ('meetAndGreet').get ().then (QuerySnapshot => {
      QuerySnapshot.forEach (doc => {
        const {increament = 0} = doc.data ();
        meetGreet = increament;
      });
      this.setState ({
        loader: false,
        meetGreet,
      });
    });
  };

  getReturnDiscount = () => {
    let returnDiscount = null;
    db.collection ('returnDiscount').get ().then (QuerySnapshot => {
      QuerySnapshot.forEach (doc => {
        const {discount = 0} = doc.data ();
        returnDiscount = discount;
      });
      this.setState ({
        returnDiscount,
        loader: false,
      });
    });
  };

  getCars = () => {
    const {navObject = {}} = this.props.navigation.state.params || {};
    const {luggage = 0, passanger = 0} = navObject;
    const carDetails = [];
    db
      .collection ('cars')
      .orderBy ('orderNumber')
      .get ()
      .then (QuerySnapshot => {
        let i = 0;
        QuerySnapshot.forEach (doc => {
          const car = doc.data ();
          const {luggageSupported = 0, passengerSupported = 0} = car;
          if (
            !isEmpty (car) &&
            luggage <= luggageSupported &&
            passanger <= passengerSupported
          ) {
            carDetails[i] = {...car, id: doc.id};
            i += 1;
          }
        });

        this.setSelectedCar (0, carDetails[0]);
        this.setState ({carDetails}, this.getAllPlots);
      });
  };

  render () {
    const {carDetails, fare, loader} = this.state;
    return (
      <EtsContainer>
        <ImageBackground
          source={require ('../assets/caroverlay.jpg')}
          style={styles.background}
        >
          <CustomHeader
            title="Select Quote"
            goback={() => this.props.navigation.goBack ()}
            primaryHeader={false}
            transparent
            backButton
          />
          <ScrollView>
            <Content style={styles.content}>
              <View style={styles.carContainer}>
                {isEmpty (carDetails)
                  ? <View style={styles.loaderView}>
                      <ActivityIndicator
                        color="#EA2141"
                        animating
                        size="large"
                      />
                    </View>
                  : <FlatList
                      data={carDetails}
                      renderItem={({item, index}) => (
                        <Car
                          item={item}
                          fare={fare}
                          index={index}
                          selectedCarIndex={this.state.selectedCarIndex}
                          onPress={() => this.setSelectedCar (index, item)}
                        />
                      )}
                      extraData={this.state}
                    />}
              </View>
            </Content>
            <SubmitButton
              loading={loader}
              disabled={loader}
              title={
                loader ? 'Processing...' : fare ? 'Confirm' : 'Calculate Fare'
              }
              onPress={fare ? this.confirmQuote : this.getTotalFare}
            />
          </ScrollView>
        </ImageBackground>
      </EtsContainer>
    );
  }
}

const styles = EStyleSheet.create ({
  background: {
    width: '100%',
    height: '100%',
  },
  carContainer: {
    backgroundColor: 'white',
    height: myHeight / 1.5,
    borderRadius: BORDER_RADIUS,
    marginVertical: 9,
    paddingBottom: 9,
  },
  content: {
    paddingHorizontal: '5%',
  },
  loaderView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

QuoteSelection.propTypes = {
  itemId: PropTypes.number,
};

export default QuoteSelection;
