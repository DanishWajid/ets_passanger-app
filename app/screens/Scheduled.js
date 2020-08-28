import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableHighlight,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import firebase from 'react-native-firebase';
import {ListItem} from '../components/List';
import {EtsContainer} from '../components/Container';

const rideDetails = [];
const Height = Dimensions.get ('window').height;
class Scheduled extends Component {
  static propTypes = {
    alertWithType: PropTypes.func,
    navigation: PropTypes.object,
    currentUser: PropTypes.object,
  };

  constructor (props) {
    super (props);
    this.state = {
      isLoaded: false,
      haveRides: false,
    };
  }

  componentWillMount () {
    this.getCurrentRides ();
  }

  dateConversion (date) {
    const day = date.toString ().slice (5, 7);
    const month = date.toString ().slice (1, 4);
    const year = date.toString ().slice (8, 12);

    return `${`${day.toString ()} `}${`${month.toString ()},`} ${year.toString ()}`;
  }

  getCurrentRides () {
    const db = firebase.firestore ();
    db
      .collection ('ride')
      .where (
        'customerId',
        '==',
        db.collection ('users').doc (this.props.currentUser.uid)
      )
      .where ('rideStatus', '<', 5)
      .get ()
      .then (QuerySnapshot => {
        let i = 0;
        QuerySnapshot.forEach (doc => {
          rideDetails[i] = doc.data ();

          i += 1;
        });
      })
      .catch (error => {
        alert (error.message);
      })
      .finally (() => {
        this.setState ({
          isLoaded: true,
        });
        if (rideDetails.length > 0) {
          this.setState ({
            haveRides: true,
          });
        }
      });
  }

  render () {
    return (
      this.state.isLoaded &&
      <EtsContainer>
        <View style={styles.container}>
          {!this.state.haveRides &&
            <View style={styles.container}>
              <Image
                style={styles.calender}
                source={require ('../assets/ets-icon-7.png')}
              />
              <View>
                <Text style={styles.upperText}>
                  You don't have any rides planned.
                </Text>
                <Text style={styles.lowerText}>
                  Let's do something about that.
                </Text>
                <TouchableHighlight
                  onPress={() => this.props.navigation.navigate ('Home')}
                  underlayColor="rgba(215, 219, 221,1)"
                >
                  <Text style={styles.buttonText}>
                    BOOK A RIDE
                  </Text>
                </TouchableHighlight>
              </View>
            </View>}

          {this.state.haveRides &&
            <View style={styles.container}>
              <FlatList
                data={rideDetails}
                renderItem={({item}) => (
                  <ListItem
                    date={this.dateConversion (
                      item.dateTime.toString ().slice (3, 15)
                    )}
                    fare={`£ ${item.fare}`}
                    pickup={item.pickup}
                    destination={item.dropof}
                    // onPress={() => this.handlePress (item)}
                  />
                )}
                keyExtractor={item => item.toString ()}
              />
            </View>}
        </View>
      </EtsContainer>
    );
  }
}
const styles = StyleSheet.create ({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  calender: {
    height: 150,
    width: 150,
    alignSelf: 'center',
    marginVertical: Height * 0.1,
  },
  upperText: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: '500',
    marginBottom: Height * 0.07,
    color: 'black',
  },
  lowerText: {
    alignSelf: 'center',
    marginBottom: Height * 0.01,
    color: 'black',
  },
  buttonText: {
    color: '#EA2141',
    alignSelf: 'center',
    fontWeight: '500',
  },
});

const mapStateToProps = state => {
  const currentUser = state.login.currentUser;
  return {
    currentUser,
  };
};

export default connect (mapStateToProps) (Scheduled);
