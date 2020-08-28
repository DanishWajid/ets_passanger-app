import React, {Component} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {Text, Content, List} from 'native-base';
import styles from './styles';

class ViasDropdown extends Component {
  render () {
    return (
      <Content style={styles.dropContainer}>
        <View style={styles.dateTimeContainer}>
          <View>
            <List
              dataArray={this.props.vias}
              renderRow={data => (
                <Text style={styles.dateTimeText}>{data}</Text>
              )}
            />

          </View>

        </View>

      </Content>
    );
  }
}
ViasDropdown.propTypes = {
  vias: PropTypes.array,
};

export default ViasDropdown;
