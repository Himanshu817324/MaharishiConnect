import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme';
import { moderateScale } from '../../../theme/responsive';
import { TabStackParamList } from '../../../types/navigation';
import ChatScreen from './ChatScreen';
import CallsScreen from './CallsScreen';
import UpdatesScreen from './UpdatesScreen';
import SettingsScreen from './SettingsScreen';

// Import screens


const Tab = createBottomTabNavigator<TabStackParamList>();

const TabBarIcon = ({ route, color, focused }: { route: any; color: string; focused: boolean }) => {
  let iconName: string;

  switch (route.name) {
    case 'Chat':
      iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
      break;
    case 'Calls':
      iconName = focused ? 'call' : 'call-outline';
      break;
    case 'Updates':
      iconName = focused ? 'newspaper' : 'newspaper-outline';
      break;
    case 'Settings':
      iconName = focused ? 'settings' : 'settings-outline';
      break;
    default:
      iconName = 'help-circle-outline';
  }

  return (
    <Icon 
      name={iconName} 
      size={moderateScale(focused ? 26 : 24)} 
      color={color} 
    />
  );
};


export default function TabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator  
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textOnPrimary,
          tabBarStyle: {
            backgroundColor: colors.primary,
            borderTopColor: colors.primary,
            borderTopWidth: 0,
            height: Platform.OS === 'ios' ? moderateScale(90) : moderateScale(70),
            paddingBottom: Platform.OS === 'ios' ? moderateScale(25) : moderateScale(10),
            paddingTop: moderateScale(10),
            elevation: 8,
            shadowColor: colors.primary,
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          tabBarLabelStyle: {
            fontSize: moderateScale(12),
            fontWeight: '600',
            marginTop: moderateScale(4),
          },
          tabBarIcon: function TabIcon({ color, focused }) {
            return <TabBarIcon route={route} color={color} focused={focused} />;
          },
        })}
      >
        <Tab.Screen 
          name="Chat" 
          component={ChatScreen}
          options={{
            tabBarLabel: 'Chats',
          }}
        />
        <Tab.Screen 
          name="Calls" 
          component={CallsScreen}
          options={{
            tabBarLabel: 'Calls',
          }}
        />
        <Tab.Screen 
          name="Updates" 
          component={UpdatesScreen}
          options={{
            tabBarLabel: 'Updates',
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
          }}
        />
      </Tab.Navigator>
  );
}
