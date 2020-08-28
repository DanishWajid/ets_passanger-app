import React, {Component} from 'react';
import {View, Text, TextInput} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import PropTypes from 'prop-types';
import styles from './styles';

class IosContactReason extends Component {
  static propTypes = {
    callbackFromParent: PropTypes.func,
  };

  constructor (props) {
    super (props);

    this.state = {
      ReasonValue: 'Complaint',
    };
  }

  Reason = data => {
    this.props.callbackFromParent (data);
  };

  render () {
    const Data = [
      {section: true, label: 'Why you want to Contact?'},
      {key: 'Complaint', label: 'Complaint'},
      {key: 'Lost Item', label: 'Lost Item'},
      {key: 'Enquiry', label: 'Enquiry'},
    ];

    return (
      <View style={styles.passangerContainer}>
        <View style={styles.passangerInnercontainer}>
          <View style={styles.dateContainer}>

            <Text style={styles.text}>Contact Reason</Text>

            <ModalSelector
              data={Data}
              initValue="Complaint"
              accessible
              scrollViewAccessibilityLabel="Scrollable options"
              cancelButtonAccessibilityLabel="Cancel Button"
              onChange={option => {
                this.setState ({ReasonValue: option.label});
                this.Reason (option.key);
              }}
            >

              <TextInput
                style={{
                  backgroundColor: 'white',
                  paddingHorizontal: '20%',
                  alignSelf: 'center',
                  alignItems: 'center',
                  width: '75%',
                  height: '86%',
                  marginLeft: '9%',
                  borderRadius: 20,
                  justifyContent: 'center',
                  shadowColor: 'grey',
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.5,
                  shadowRadius: 1,

                  elevation: 1,
                }}
                editable={false}
                placeholder="1 Person"
                placeholderTextColor="black"
                value={this.state.ReasonValue}
              />

            </ModalSelector>
          </View>
        </View>

      </View>
    );
  }
}
export default IosContactReason;
