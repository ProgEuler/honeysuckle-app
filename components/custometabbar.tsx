// import AnalyticsIcon from '@/assets/svgs/chart.svg';
// import ChatIcon from '@/assets/svgs/chat.svg';
// import CheckIcon from '@/assets/svgs/check.svg';
// import HomeIcon from '@/assets/svgs/home.svg';
// import SettingsIcon from '@/assets/svgs/settings.svg';
// import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
// import { StyleSheet, TouchableOpacity, View } from 'react-native';

// export default function CustomTabBar({
//   state,
//   descriptors,
//   navigation,
// }: BottomTabBarProps) {
//   const icons: any = {
//     home: HomeIcon,
//     dailycheck: CheckIcon,
//     chat: ChatIcon,
//     analytics: AnalyticsIcon,
//     settings: SettingsIcon,
//   };
//   const order = ['home', 'dailycheck', 'chat', 'analytics', 'settings'];

//   return (
//     <View style={styles.container}>
//       <View style={styles.tabBar}>
//         {[...state.routes]
//           .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name))
//           .map((route, index) => {
//             const isFocused = state.index === index;
//             const Icon = icons[route.name];
//             console.log(route);

//             const onPress = () => {
//               const event = navigation.emit({
//                 type: 'tabPress',
//                 target: route.key,
//                 canPreventDefault: true,
//               });
//               if (!isFocused && !event.defaultPrevented) {
//                 navigation.navigate(route.name);
//               }
//             };

//             return (
//               <TouchableOpacity
//                 key={route.key}
//                 onPress={onPress}
//                 style={styles.tabItem}
//                 activeOpacity={0.7}
//               >
//                 <Icon width={28} height={28} stroke={'#000000'} />
//               </TouchableOpacity>
//             );
//           })}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     bottom: 10,
//     width: '100%',
//     alignItems: 'center',
//   },
//   tabBar: {
// flexDirection: 'row',
// backgroundColor: 'white',
// width: '100%',
// justifyContent: 'space-around',
// paddingVertical: 20,

// // rounded top
// borderTopLeftRadius: 25,
// borderTopRightRadius: 25,

// // upper shadow
// shadowColor: '#000',
// shadowOffset: { width: 0, height: -5 },
// shadowOpacity: 0.12,
// shadowRadius: 6,
// elevation: 15,
//   },
//   tabItem: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

import { Colors } from '@/constants/color';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AnalyticsIcon from './icons/analyticsicon';
import ChatIcon from './icons/chaticon';
import CheckIcon from './icons/dailycheck';
import HomeIcon from './icons/homeicon';
import SettingsIcon from './icons/settingsicon';

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  // Map route names to SVG components
  const icons: Record<
    string,
    React.FC<{ width: number; height: number; color: string }>
  > = {
    home: HomeIcon,
    dailycheck: CheckIcon,
    chat: ChatIcon,
    analytics: AnalyticsIcon,
    settings: SettingsIcon,
  };

  // Custom order of tabs
  const order = ['home', 'dailycheck', 'chat', 'analytics', 'settings'];

  return (
    <View style={styles.tabBar}>
      {order.map((name, index) => {
        const route = state.routes.find((r) => r.name === name);
        if (!route) return null;

        const isFocused = state.index === state.routes.indexOf(route);
        const Icon = icons[name];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 12,
              backgroundColor: isFocused && '#F7F4F2',
              borderRadius: 50,
            }}
          >
            <Icon
              width={28}
              height={28}
              color={isFocused ? '#4B3425' : '#D5C2B9'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'space-around',
    paddingBottom: 25,
    paddingTop: 20,
    paddingHorizontal: 15,

    // rounded top
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,

    // upper shadow
    shadowColor: Colors.green,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 15,
  },
});
