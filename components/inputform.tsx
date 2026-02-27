import { Colors } from '@/constants/color';
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { RNText } from './ui/input';

type Props<T> = {
  title: keyof T;
  label: string;
  placeHolder: string;
  control: Control<T>;
  errors: FieldErrors<T>;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'number-pad';
};

const InputForm = ({
  title,
  label,
  placeHolder,
  control,
  errors,
  keyboardType = 'default',
  Icon,
}: Props) => {
  return (
    <View style={{ marginBottom: 10, width: '100%' }}>
      <RNText
        variant="header"
        size="sm"
        style={{ fontSize: 20, marginBottom: 12 }}
      >
        {label}
      </RNText>
      <Controller
        control={control}
        name={title}
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <Icon />
            <TextInput
              placeholder={placeHolder}
              value={value}
              onChangeText={onChange}
              placeholderTextColor={Colors.primaryText}
              autoCorrect={false}
              autoCapitalize="words"
              spellCheck={false}
              keyboardType={keyboardType}
              style={styles.input}
            />
            {errors[title] && (
              <Text style={{ color: 'red' }}>{errors[title].message}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default InputForm;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.green,
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 18,
    fontFamily: 'PoppinsRegular',
    backgroundColor: Colors.white,
    color: Colors.brown,
  },
  error: {
    color: 'red',
    marginTop: -8,
    marginBottom: 12,
  },
});
