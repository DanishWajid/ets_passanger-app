import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles';

import getTheme from '../../../native-base-theme/components';
import commonColor from '../../../native-base-theme/variables/commonColor';
import { Container, StyleProvider } from 'native-base';


const EtsContainer = ({ children }) => {
  const containerStyles = [styles.container];

  return (

    <StyleProvider style={getTheme(commonColor)}>
      <Container style={containerStyles}>
        {children}
      </Container>
    </StyleProvider>
  );
};

Container.propTypes = {
  children: PropTypes.any,
};

export default EtsContainer;