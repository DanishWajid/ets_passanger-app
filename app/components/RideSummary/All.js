import React, {Component} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {Text, Right, Icon, Content} from 'native-base';
import styles from './styles';
import {Separator} from '../List';

class All extends Component {
  render () {
    return (
      <Content>
        <View style={styles.outerContainer}>
          <View>

            <Text style={styles.mainText}>{this.props.leftText}</Text>

          </View>
          <Right>
            {this.props.address
              && <Text style={styles.allText}>
                {this.props.rightText}
              </Text>}
            {this.props.people
              && <View style={styles.container}>
                <Text style={styles.iconText}>{this.props.rightText}</Text>
                <Icon name={this.props.iconName} style={styles.icon} />
              </View>}
          </Right>

        </View>
        <Separator />
      </Content>
    );
  }
}
All.propTypes = {
  address: PropTypes.bool,
  people: PropTypes.bool,
  rightText: PropTypes.string,
  leftText: PropTypes.string,
  iconName: PropTypes.string,
};

export default All;
