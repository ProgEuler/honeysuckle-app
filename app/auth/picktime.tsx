import Back from '@/assets/svgs/back.svg';
import Calender from '@/assets/svgs/calender.svg';
import TimePick from '@/components/timepick';
import RNButton from '@/components/ui/button';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

const PickTime = () => {
  const { control } = useForm();

  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      bottomOffset={24}
      showsVerticalScrollIndicator={false}
    >
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Back />
        </TouchableOpacity>
        <RNText variant="title" size="xl">
          Notification Setup
        </RNText>
      </View>
      <View style={styles.mainContent}>
        <View style={styles.innerContent}>
          <View style={styles.titleWrap}>
            <RNText variant="header" size="3xl" style={styles.titleText}>
              When would you like us to remind you to check in each day?
            </RNText>
          </View>
          <View>
            <RNText variant="header" size="xl" style={styles.pickLabel}>
              Pick a time
            </RNText>
            <View>
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.fieldGroup}>
                    <View style={styles.dateInputWrap}>
                      <Calender />
                      <TextInput
                        placeholder="Select Date"
                        value={value ? value : ''}
                        editable={false}
                        pointerEvents="none"
                        placeholderTextColor="#999"
                        style={styles.dateInput}
                      />
                    </View>
                    <TimePick onChange={onChange} />
                  </View>
                )}
              />
            </View>
          </View>
        </View>
        <RNButton value={'Continue'} path={'/(tabs)/home'} />
      </View>
    </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default PickTime;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  backButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.brown,
    alignItems: 'flex-start',
    borderRadius: 40,
  },
  mainContent: {
    width: '90%',
    marginHorizontal: 'auto',
    flex: 1,
    justifyContent: 'center',
  },
  innerContent: {
    gap: 100,
    marginBottom: 150,
  },
  titleWrap: {
    width: '90%',
    marginHorizontal: 'auto',
  },
  titleText: {
    textAlign: 'center',
  },
  pickLabel: {
    marginBottom: 20,
  },
  fieldGroup: {
    gap: 50,
  },
  dateInputWrap: {
    flexDirection: 'row',
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderColor: Colors.green,
  },
  dateInput: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 18,
    fontFamily: 'PoppinsRegular',
    backgroundColor: Colors.white,
    color: Colors.brown,
  },
});
