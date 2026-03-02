import AI from '@/assets/svgs/ai.svg';
import Back from '@/assets/svgs/back.svg';
import Check from '@/assets/svgs/check.svg';
import Clock from '@/assets/svgs/clock.svg';
import Fire from '@/assets/svgs/fire.svg';
import { RNText } from '@/components/ui/input';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NOTIFICATIONS = [
  {
    id: '1',
    category: 'Today',
    items: [
      {
        id: '101',
        title: 'Daily Check-in Reminder',
        description: 'How are you feeling today? Take a moment to check in.',
        time: '1h ago',
        icon: <Clock />,
        backgroundColor: '#F2F5EB',
        read: false,
      },
      {
        id: '102',
        title: 'New AI Insight Available',
        description: 'Your mood patterns from the last 7 days are ready to view.',
        time: '3h ago',
        icon: <AI />,
        backgroundColor: '#EDEBFF',
        read: false,
      },
    ],
  },
  {
    id: '2',
    category: 'Yesterday',
    items: [
      {
        id: '103',
        title: 'Weekly Streak! 🔥',
        description: "You've successfully completed 7 days of check-ins. Keep it up!",
        time: '1d ago',
        icon: <Fire />,
        backgroundColor: '#FFF0EB',
        read: true,
      },
      {
        id: '104',
        title: 'Resource Recommendation',
        description: 'We found a new meditation exercise you might like.',
        time: '1d ago',
        icon: <Check />,
        backgroundColor: '#FDF7E7',
        read: true,
      },
    ],
  },
];

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Back />
        </TouchableOpacity>
        <RNText variant="title" size="xl" style={styles.headerTitle}>
          Notifications
        </RNText>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {NOTIFICATIONS.map((section) => (
          <View key={section.id} style={styles.section}>
            <RNText variant="header" size="md" style={styles.sectionTitle}>
              {section.category}
            </RNText>

            <View style={styles.notificationList}>
              {section.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.notificationItem,
                    !item.read && styles.unreadItem
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: item.backgroundColor }]}>
                    {item.icon}
                  </View>

                  <View style={styles.textContainer}>
                    <View style={styles.row}>
                      <RNText variant="header" size="md" style={styles.itemTitle}>
                        {item.title}
                      </RNText>
                      {!item.read && <View style={styles.unreadDot} />}
                    </View>

                    <RNText
                      variant="medium"
                      size="sm"
                      numberOfLines={2}
                      style={styles.itemDescription}
                    >
                      {item.description}
                    </RNText>

                    <RNText variant="base" size="xs" style={styles.itemTime}>
                      {item.time}
                    </RNText>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#E8DDD9',
    padding: 10,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    color: Colors.brown,
  },
  headerRightPlaceholder: {
    width: 44, // Matches back button width to center title
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    color: '#6D6661',
    marginBottom: 12,
    marginLeft: 4,
  },
  notificationList: {
    gap: 12,
  },
  notificationItem: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  unreadItem: {
    borderColor: Colors.green + '40',
    borderWidth: 1,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    color: Colors.brown,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.green,
    marginLeft: 8,
  },
  itemDescription: {
    color: '#6D6661',
    marginBottom: 6,
    lineHeight: 18,
  },
  itemTime: {
    color: '#A09791',
  },
});
