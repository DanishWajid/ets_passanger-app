import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text} from 'react-native';
import {Icon, View} from 'native-base';
import ImageOverlay from 'react-native-image-overlay';
import {CustomHeader} from '../components/CustomHeader';
import {myWidth, myHeight} from '../utils';
import {Heading} from '../components/Heading';
import { EtsContainer} from '../components/Container';

export default class About extends Component {
  static propTypes = {
    navigation: PropTypes.object,
  };

  render () {
    return (
      <EtsContainer>
        <CustomHeader
          title="About"
          drawerOpen={() => this.props.navigation.openDrawer ()}
        />
        <ImageOverlay
          source={require ('../assets/car.jpg')}
          contentPosition="center"
          height={0.18 * myHeight}
          overlayColor="#EA2341"
        >

          <Text style={styles.imageContent}>
            ABOUT US
          </Text>

        </ImageOverlay>
        <View>
          <View style={styles.bottomRow}>
            <Icon name="thunderstorm" style={styles.icon} />
            <Heading text="Our Mission" />

          </View>

          <Text style={styles.text}>
            We pride ourselves on always looking for new ideas to improve
            our services to our new and longstanding customers. ETS Cars is
            at the forefront in adopting new technology to improve customer services.
          </Text>

        </View>
        <View style={styles.separator} />
        <View>
          <View style={styles.bottomRow}>
            <Icon name="car" style={styles.icon} />
            <Heading text="ETS CARS" />

          </View>

          <Text style={styles.text}>
            ETS Cars is licensed by the Leeds City Council as private car
            hire operator. We as operator and all our drivers strictly
            follow the rules and regulations, required to operator a car
            as private hire.
          </Text>

        </View>
        <View style={styles.separator} />
        <View>
          <View style={styles.bottomRow}>
            <Icon name="help-circle" style={styles.icon} />
            <Heading text="Why Us?" />

          </View>

          <Text style={styles.text}>
            We operate 24/7 every day of the year and available at the distance of one phone call.
            Our range of vehicles include: Saloon Cars, Estate Cars, People
            Carriers (6 & 8 seaters),Wheel Chair Access Cars and Executive Cars
            to cater all your requirements.
          </Text>

        </View>
      </EtsContainer>

    );
  }
}
const styles = StyleSheet.create ({
  imageContent: {
    color: 'white',
    fontSize: myHeight * myWidth / (myWidth * myHeight * 3),
  },
  text: {
    color: '#586176',
    paddingHorizontal: myWidth / (0.05 * myWidth),
  },
  bottomRow: {
    flexDirection: 'row',
  },
  icon: {
    color: '#EA2141',
    fontSize: myHeight / (0.05 * myHeight),
    alignSelf: 'center',
    paddingLeft: myWidth / (0.05 * myWidth),
  },
  separator: {
    backgroundColor: '#EA2141',
    height: 2,
    marginHorizontal: myWidth / (0.05 * myWidth),
    marginTop: myHeight / (0.1 * myHeight),
  },
});
