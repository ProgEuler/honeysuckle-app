import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DatePicker = forwardRef(({ onChange }, ref) => {
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

  const handleConfirm = (date) => {
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

// import React, { useState } from 'react';
// import { Button, TouchableOpacity, View } from 'react-native';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';

// const DatePicker = () => {
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

//   const showDatePicker = () => {
//     setDatePickerVisibility(true);
//   };

//   const hideDatePicker = () => {
//     setDatePickerVisibility(false);
//   };

//   const handleConfirm = (date) => {
//     hideDatePicker();
//   };

//   return (
//     <View>
//       <Button title="Show Date Picker" onPress={showDatePicker} />
//       <DateTimePickerModal
//         isVisible={isDatePickerVisible}
//         mode="date"
//         onConfirm={handleConfirm}
//         onCancel={hideDatePicker}
//         modalStyleIOS={{
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}
//         pickerContainerStyleIOS={{
//           backgroundColor: 'white',
//           borderRadius: 20,
//           width: 500, // make it wider
//         }}
//         pickerStyleIOS={{
//           width: '100%',
//           paddingHorizontal: 85,
//         }}
//         confirmTextIOS="OK"
//         cancelTextIOS="Cancel"
//         buttonTextColorIOS="#007AFF"
//         customCancelButtonIOS={() => <TouchableOpacity></TouchableOpacity>}
//       />
//     </View>
//   );
// };

export default DatePicker;
