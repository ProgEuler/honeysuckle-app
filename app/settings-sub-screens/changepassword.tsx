import Back from '@/assets/svgs/back.svg';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import { AlertCircle, CheckCircle } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ChangePassword = () => {
  const { bottom } = useSafeAreaInsets();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);

    Animated.timing(toastOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (type === 'success') {
          router.back();
        }
      });
    }, 2500);
  };

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast('Please fill all fields', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (newPassword === oldPassword) {
      showToast('New password must not match old password', 'error');
      return;
    }

    showToast('Password changed successfully!', 'success');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Back />
        </TouchableOpacity>
        <RNText variant="title" size="xl" style={styles.headerTitle}>
          Change Password
        </RNText>
      </View>

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
        bottomOffset={24}
      >
        <View style={styles.inputContainer}>
          <RNText variant="medium" size="sm" style={styles.label}>Old Password</RNText>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter old password"
              placeholderTextColor={Colors.primaryText}
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <RNText variant="medium" size="sm" style={styles.label}>New Password</RNText>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter new password"
              placeholderTextColor={Colors.primaryText}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <RNText variant="medium" size="sm" style={styles.label}>Confirm New Password</RNText>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Confirm new password"
              placeholderTextColor={Colors.primaryText}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleChangePassword}
        >
          <RNText variant="title" size="lg" style={styles.submitText}>
            Update Password
          </RNText>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      <Animated.View
        style={[
          styles.toastContainer,
          {
            opacity: toastOpacity,
            backgroundColor: toastType === 'success' ? '#4CAF50' : '#F44336'
          }
        ]}
        pointerEvents="none"
      >
        {toastType === 'success' ? (
          <CheckCircle size={20} color={Colors.white} />
        ) : (
          <AlertCircle size={20} color={Colors.white} />
        )}
        <RNText variant="medium" size="sm" style={styles.toastText}>
          {toastMessage}
        </RNText>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
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
  headerTitle: {
    color: Colors.brown,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    color: Colors.brown,
    marginLeft: 4,
  },
  inputWrapper: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.white,
    borderColor: Colors.green,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.brown,
    fontFamily: 'PoppinsRegular',
  },
  submitButton: {
    width: '100%',
    height: 64,
    backgroundColor: Colors.brown,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitText: {
    color: Colors.white,
    marginTop: 2,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    minWidth: width * 0.8,
  },
  toastText: {
    color: Colors.white,
    flex: 1,
  }
});

export default ChangePassword;
