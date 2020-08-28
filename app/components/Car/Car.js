import React, {Component} from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import {ListItem, Text, Radio, Left, Body, Icon} from 'native-base';
import { isEqual } from 'lodash';
import styles from './styles';
import {applyPercentage} from '../../utils';

class Car extends Component {
  constructor (props) {
    super (props);
    this.state = {};
  }

  shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<>, nextContext: any): boolean {
    const { item, fare, selectedCarIndex } = nextProps;
    const { item: oldItem, fare: oldFare, selectedCarIndex: oldIndex } = this.props;
    return (fare !== oldFare || oldIndex !== selectedCarIndex || !isEqual(item, oldItem));
  }

  render () {
    const { fare, item = {} } = this.props;
    const {
      carType, passengerSupported, percentageIncrease, luggageSupported
    } = item;
    const fareText = fare ? `£${applyPercentage(fare, percentageIncrease)}` : '_ _ _';
    return (
      <ListItem onPress={this.props.onPress}>
        <Left>
          <View style={styles.carName}>
            <Radio
              onPress={this.props.onPress}
              selected={this.props.selectedCarIndex === this.props.index}
              selectedColor="#EA2141"
            />
            <Text style={styles.text}>{carType}</Text>
          </View>
        </Left>
        <Body>
          <View style={styles.carName}>
            <Icon name="people" style={styles.icon} />
            <Text style={styles.text}>{`x ${passengerSupported}`}</Text>
            <Icon name="briefcase" style={styles.icon} />
            <Text style={styles.text}>{`x ${luggageSupported}`}</Text>
          </View>
        </Body>
        <Text>{fareText}</Text>
      </ListItem>
    );
  }
}
Car.propTypes = {
  fare: PropTypes.number,
  onPress: PropTypes.func,
  selected: PropTypes.bool,
  index: PropTypes.number,
  selectedCarIndex: PropTypes.number,
  item: PropTypes.object,
};
export default Car;
