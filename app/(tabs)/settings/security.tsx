import Back from '@/assets/svgs/back.svg';
import Next from "@/assets/svgs/next.svg";
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Security = () => {
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

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
          Security
        </RNText>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/(tabs)/settings/changepassword')}>
            <View style={styles.settingItemLeft}>
              <RNText variant="header" size="md" style={styles.settingItemTitle}>
                Change Password
              </RNText>
            </View>
            <Next />
          </TouchableOpacity>

          {/* <View style={[styles.settingItem, styles.noBorder]}>
            <View style={styles.settingItemLeft}>
              <RNText variant="header" size="md" style={styles.settingItemTitle}>
                Biometric Authentication
              </RNText>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: "#E0E0E0", true: Colors.green }}
              thumbColor={Colors.white}
              ios_backgroundColor="#E0E0E0"
            />
          </View> */}
        </View>
      </View>
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
  content: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    overflow: "hidden",
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingItemTitle: {
    color: Colors.brown,
  },
});

export default Security;
