import { Colors } from '@/constants/color';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { RNText } from './ui/input';

const TimePick = ({ onChange }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const formatTo12HourTime = (isoString) => {
    const date = new Date(isoString);

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn('A date has been picked: ', date);
    hideDatePicker();
    const time = formatTo12HourTime(date);
    console.log(time);
    onChange(time);
  };

  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderColor: Colors.green,
        paddingVertical: 10,
        backgroundColor: Colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
      }}
      onPress={showDatePicker}
    >
      <RNText
        variant="header"
        size="lg"
        style={{
          color: Colors.white,
        }}
      >
        Pick the time
      </RNText>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        pickerStyleIOS={{
          alignItems: 'center',
        }}
      />
    </TouchableOpacity>
  );
};

export default TimePick;
