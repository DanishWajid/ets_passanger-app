import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Header, Body, Title, Left, Icon, Right} from 'native-base';
import {TouchableHighlight, Platform} from 'react-native';
import styles from './styles';

class CustomHeader extends Component {
  static propTypes = {
    title: PropTypes.string,
    drawerOpen: PropTypes.func,
    goback: PropTypes.func,
    backButton: PropTypes.bool,
    primaryHeader: PropTypes.bool,
    transparent: PropTypes.bool,
  };

  render () {
    if (Platform.OS === 'android') {
      const headerStyles = [styles.primaryHeader];
      const TitleStyles = [null];
      const BodyStyles = [styles.body];
      if (this.props.primaryHeader === false) {
        headerStyles.push (styles.transparentHeader);
        BodyStyles.push (styles.body);
        TitleStyles.push (styles.heading);
      }
      if (this.props.backButton === true) {
        BodyStyles.push (styles.body);
      }
      return (
        <Header style={headerStyles} androidStatusBarColor="#c3122e">
          <Left>
            {this.props.backButton &&
              <TouchableHighlight
                underlayColor="rgba(253, 254, 254,0)"
                onPress={() => this.props.goback ()}
              >
                <Icon style={styles.icon} name="arrow-back" />
              </TouchableHighlight>}

            {!this.props.backButton &&
              <TouchableHighlight
                underlayColor="rgba(253, 254, 254,0)"
                onPress={() => this.props.drawerOpen ()}
              >
                <Icon style={styles.icon} name="ios-menu" />
              </TouchableHighlight>}
          </Left>
          {this.props.backButton &&
            <Body style={BodyStyles}>
              <Title style={TitleStyles}>{this.props.title}</Title>
            </Body>}

          {!this.props.backButton &&
            <Body style={BodyStyles}>
              <Title style={TitleStyles}>{this.props.title}</Title>
            </Body>}

          <Right />
        </Header>
      );
    }
    if (Platform.OS === 'ios') {
      const headerStyles = [styles.primaryHeader];
      const TitleStyles = [styles.iosSmallHeading];
      const BodyStyles = [styles.body];
      if (this.props.primaryHeader === false) {
        headerStyles.push (styles.transparentHeader);
        BodyStyles.push (styles.iosBody);
        TitleStyles.push (styles.iosHeading);
      }
      if (this.props.backButton === true) {
        BodyStyles.push (styles.iosBody);
      }
      return (
        <Header
          style={headerStyles}
          transparent={this.props.transparent}
          androidStatusBarColor="#c3122e"
        >
          <Left>
            {this.props.backButton &&
              <TouchableHighlight
                underlayColor="rgba(253, 254, 254,0)"
                onPress={() => this.props.goback ()}
              >
                <Icon style={styles.icon} name="ios-arrow-back" />
              </TouchableHighlight>}

            {!this.props.backButton &&
              <TouchableHighlight
                underlayColor="rgba(253, 254, 254,0)"
                onPress={() => this.props.drawerOpen ()}
              >
                <Icon style={styles.icon} name="ios-menu" />
              </TouchableHighlight>}
          </Left>
          {this.props.backButton &&
            <Body style={BodyStyles}>
              <Title style={TitleStyles}>{this.props.title}</Title>
            </Body>}

          {!this.props.backButton &&
            <Body style={BodyStyles}>
              <Title style={TitleStyles}>{this.props.title}</Title>
            </Body>}

          <Right />
        </Header>
      );
    }
  }
}

export default CustomHeader;
