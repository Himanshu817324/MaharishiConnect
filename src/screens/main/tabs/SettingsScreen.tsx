import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/slices/authSlice';
import CustomStatusBar from '../../../components/atoms/ui/StatusBar';
import { useTheme } from '../../../theme';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            console.log('🚪 User logging out...');
            dispatch(logout());
            // Navigation will be handled by SplashScreen after logout
          },
        },
      ]
    );
  };

  const settingsItems = [
    { title: 'Account', icon: 'person-outline', onPress: () => navigation.navigate('UserInfoScreen' as never) },
    { title: 'Privacy', icon: 'shield-outline', onPress: () => {} },
    { title: 'Notifications', icon: 'notifications-outline', onPress: () => {} },
    { title: 'Storage & Data', icon: 'cloud-outline', onPress: () => {} },
    { title: 'Help', icon: 'help-circle-outline', onPress: () => {} },
    { title: 'About', icon: 'information-circle-outline', onPress: () => {} },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomStatusBar />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      </View>
      
      <View style={styles.settingsList}>
        {settingsItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={item.onPress}
          >
            <View style={styles.settingLeft}>
              <Icon name={item.icon} size={24} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                {item.title}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={colors.subText} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Section */}
      <View style={styles.logoutSection}>
        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: colors.border }]}
          onPress={handleLogout}
        >
          <Icon name="log-out-outline" size={24} color="#FF4444" />
          <Text style={[styles.logoutText, { color: '#FF4444' }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  settingsList: {
    paddingHorizontal: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 16,
  },
  logoutSection: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 68, 68, 0.05)',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});
