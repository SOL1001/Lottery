// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeScreen from '../screens/HomeScreen';
// import BookScreen from '../screens/BookScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import { MaterialIcons } from '@expo/vector-icons';
// import { TabParamList } from '../types/navigation';

// const Tab = createBottomTabNavigator<TabParamList>();

// const TabNavigator: React.FC = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName: keyof typeof MaterialIcons.glyphMap = 'home';

//           if (route.name === 'Home') {
//             iconName = focused ? 'home' : 'home';
//           } else if (route.name === 'Book') {
//             iconName = focused ? 'book' : 'book';
//           } else if (route.name === 'Profile') {
//             iconName = focused ? 'person' : 'person-outline';
//           }

//           return <MaterialIcons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: 'tomato',
//         tabBarInactiveTintColor: 'gray',
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Book" component={BookScreen} />
//       <Tab.Screen name="Profile" component={ProfileScreen} />
//     </Tab.Navigator>
//   );
// };

// export default TabNavigator;
// src/navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import BookScreen from '../screens/BookScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { TabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return <MaterialIcons name="home" size={size} color={color} />;
          } else if (route.name === 'Wallet') {
            return <MaterialIcons name="account-balance-wallet" size={size} color={color} />;
            // return <MaterialIcons name="bookmark" size={size} color={color} />;
          } else if (route.name === 'Profile') {
            return <FontAwesome name="user" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: 'purple', // Brown color
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          //   height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Wallet" component={BookScreen} options={{ headerShown: false }} />
      {/* <Tab.Screen name="Book" component={BookScreen} /> */}
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
