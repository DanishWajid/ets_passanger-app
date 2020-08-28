import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import {ListItem, Text, Left, View, Body, List} from 'native-base';
import PropTypes from 'prop-types';
import styles from './styles';
import {timeConversion} from '../../utils/index';

class RideSummary extends Component {
  renderListItem = (label, value) => (
    <ListItem>
      <Left style={styles.left}>
        <View style={styles.labelBox}>
          <Text>{label}</Text>
        </View>
        <Body>
          <Text>{value}</Text>
        </Body>
      </Left>
    </ListItem>
  );

  render () {
    const {
      pickup = {},
      drop = {},
      viaLocations = [],
      via,
      rideTime,
      rideDate,
      fare,
      passanger,
      car,
      extraInfo,
      rideReturnDate,
      rideReturnTime,
      luggage,
      rideType,
    } = this.props;

    return (
      <ScrollView style={styles.RideSummaryContainer}>
        {this.renderListItem ('From', pickup)}
        {this.renderListItem ('To', drop)}
        {!!via &&
          viaLocations.length !== 0 &&
          <ListItem>
            <Left style={styles.left}>
              <View style={styles.labelBox}>
                <Text>Vias</Text>
              </View>
              <Body>
                <List
                  dataArray={viaLocations}
                  renderRow={data => <Text style={styles.text}>{data}</Text>}
                />
              </Body>
            </Left>
          </ListItem>}
        {this.renderListItem (
          'Timing',
          `${rideDate}\n${timeConversion (rideTime)}`
        )}
        {!!passanger &&
          this.renderListItem ('Passengers', `${passanger} Persons`)}
        {!!luggage && this.renderListItem ('Luggage', `${luggage} Items`)}
        {!!rideType && this.renderListItem ('Ride Type', rideType)}
        {this.props.return &&
          this.renderListItem ('Return Date', rideReturnDate)}
        {this.props.return &&
          this.renderListItem ('Return Time', timeConversion (rideReturnTime))}
        {!!car && this.renderListItem ('Car', car)}
        {extraInfo.message !== '' &&
          extraInfo.length !== 0 &&
          this.renderListItem ('Extra Info', extraInfo.message)}
        {!!fare && this.renderListItem ('Fare', `£${fare}`)}
      </ScrollView>
    );
  }
}

RideSummary.propTypes = {
  pickup: PropTypes.string,
  drop: PropTypes.string,
  via: PropTypes.bool,
  return: PropTypes.bool,
  ASAP: PropTypes.bool,
  viaLocations: PropTypes.array,
  rideTiming: PropTypes.string,
  rideDate: PropTypes.string,
  rideTime: PropTypes.string,
  passanger: PropTypes.number,
  luggage: PropTypes.number,
  rideType: PropTypes.string,
  car: PropTypes.string,
  fare: PropTypes.number,
  extraInfo: PropTypes.any,
  rideReturnDate: PropTypes.string,
  rideReturnTime: PropTypes.string,
};

export default RideSummary;
