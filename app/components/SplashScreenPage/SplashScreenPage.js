import PropTypes from 'prop-types';
import React from 'react';

import {Content, Spinner} from 'native-base';
import styles from './styles';

const SplashScreenPage = () => (
  <Content contentContainerStyle={styles.container}>
    <Spinner color="white" />
  </Content>
);

SplashScreenPage.propTypes = {
  children: PropTypes.any,
};

export default SplashScreenPage;
