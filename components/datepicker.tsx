import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface DatePickerProps {
  onChange: (date: Date) => void;
}

export interface DatePickerRef {
  showDatePicker: () => void;
}

const DatePicker = forwardRef<DatePickerRef, DatePickerProps>(({ onChange }, ref) => {
  useImperativeHandle(ref, () => {
    return {
      showDatePicker,
    };
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    hideDatePicker();
    onChange(date);
  };

  return (
    <View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        pickerStyleIOS={{
          width: '100%',
          marginHorizontal: 'auto',
          alignItems: 'center',
        }}
      />
    </View>
  );
});

export default DatePicker;
