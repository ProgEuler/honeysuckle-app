import Next from '@/assets/svgs/next.svg';
import { Layout } from '@/components/layout/Layout';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { useMeQuery } from '@/hooks/useMeQuery';
import { router } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Security = () => {
  const { bottom } = useSafeAreaInsets();
  const { data: me } = useMeQuery();
  // Google/Apple accounts have no password. Older servers don't send the
  // flag, so only hide the option when it's explicitly false.
  const hasPassword = me?.has_password !== false;

  return (
    <Layout edges={['top']} style={[styles.container, { paddingBottom: bottom }]}>
        <View style={styles.card}>
          {hasPassword ? (
            <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/settings-sub-screens/changepassword')}>
              <View style={styles.settingItemLeft}>
                <RNText variant="header" size="md" style={styles.settingItemTitle}>
                  Change Password
                </RNText>
              </View>
              <Next />
            </TouchableOpacity>
          ) : (
            <View style={styles.notice}>
              <RNText variant="header" size="md" style={styles.settingItemTitle}>
                You sign in with Google or Apple
              </RNText>
              <RNText variant="medium" size="sm" style={{ color: Colors.primaryText, lineHeight: 20 }}>
                Your account doesn't have a password, so there's nothing to change here. Your
                sign-in is secured by your Google or Apple account.
              </RNText>
            </View>
          )}
        </View>
        </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 64,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginLeft: 20,
    marginTop: 12,
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
    paddingHorizontal: 20,
    marginTop: 30,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    overflow: 'hidden',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  notice: {
    gap: 6,
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingItemTitle: {
    color: Colors.brown,
  },
});

export default Security;
