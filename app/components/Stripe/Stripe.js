import React, {Component} from 'react';
import {View, Alert} from 'react-native';
import stripe from 'tipsi-stripe';
import PropTypes from 'prop-types';

stripe.setOptions ({
  publishableKey: 'pk_live_B30ePjrRTH8Vat2j0kOjsQeq',
});

const theme = {
  primaryBackgroundColor: '#22a231',
  secondaryBackgroundColor: '#f602ae',
  primaryForegroundColor: '#ad2356',
  secondaryForegroundColor: '#f123ae',
  accentColor: '#99fa02',
  errorColor: '#0027ff',
};
const FIREBASE_FUNCTION =
  'https://us-central1-etscars-app.cloudfunctions.net/charge/stripe';
class Stripe extends Component {
  componentDidMount () {
    const {fare, onPayment} = this.props;
    const options = {
      smsAutofillDisabled: true,
      requiredBillingAddressFields: 'zip', // or 'full'
      theme,
    };
    stripe
      .paymentRequestWithCardForm (options)
      .then (async response => {
        const res = await this.charge (response.tokenId, fare);

        if (!res.paid) {
          Alert.alert ('Payment', res.message, [{text: 'OK'}], {
            cancelable: false,
          });
        } else {
          Alert.alert (
            'Payment',
            'The card has been Successfully charged',
            [{text: 'OK'}],
            {
              cancelable: false,
            }
          );
          onPayment ();
        }
      })
      .catch (error => {
        Alert.alert (error.message);
      });
  }

  charge = async (id, amount) => {
    try {
      const res = await fetch (FIREBASE_FUNCTION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify ({
          id,
          amount: amount * 100,
        }),
      });
      const data = await res.json ();

      return data;
    } catch (e) {
      Alert.alert ({Error: e.message});
      return {};
    }
  };

  render () {
    return <View />;
  }
}

Stripe.propTypes = {
  fare: PropTypes.number,
  currency: PropTypes.string,
  onPayment: PropTypes.func,
};

export default Stripe;
