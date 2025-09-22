import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Contacts from 'react-native-contacts';
import Icon from 'react-native-vector-icons/Ionicons';
import MessageTime from '../../../components/atoms/chats/MessageTime';
import CustomStatusBar from '../../../components/atoms/ui/StatusBar';
import { chats } from '../../../constants/MockData';
import { fetchContacts } from '../../../services/contactService';
import { useTheme } from '../../../theme';
import { moderateScale } from '../../../theme/responsive';

export default function ChatScreen() {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPress = async () => {
    try {
      setIsLoading(true);
      console.log("🔄 Starting contacts sync...");
      
      // First, check current permission status
      console.log("🔐 Checking current contacts permission...");
      const currentStatus = await Contacts.checkPermission();
      console.log("📋 Current permission status:", currentStatus);
      
      let permissionStatus = currentStatus;
      
      // If permission is not granted, request it
      if (currentStatus !== 'authorized') {
        console.log("🔐 Requesting contacts permission...");
        const status = await Contacts.requestPermission();
        permissionStatus = status;
        console.log("📋 Permission request result:", status);
      } else {
        // For testing: Force permission request even if already granted
        // Remove this in production
        console.log("🔐 Permission already granted, but requesting again for testing...");
        const status = await Contacts.requestPermission();
        permissionStatus = status;
        console.log("📋 Permission request result (forced):", status);
      }
      
      if (permissionStatus !== 'authorized') {
        console.log("❌ Contacts permission denied");
        Alert.alert(
          "Permission Required",
          "Contacts permission is required to sync your contacts. Please enable it in your device settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Settings", onPress: () => {
              // You can add logic to open device settings here
              console.log("📱 Opening device settings...");
            }}
          ]
        );
        return;
      }
      
      console.log("✅ Contacts permission granted");
      console.log("📱 Fetching contacts...");
      
      const contacts = await fetchContacts();
      
      console.log("📱 Contacts sync completed!");
      console.log("📊 Total contacts found:", contacts?.length || 0);
      console.log("📋 Contacts data:", JSON.stringify(contacts, null, 2));
      
      if (contacts && contacts.length > 0) {
        console.log("✅ Contacts available, navigating to FilteredContacts");
        navigation.navigate('FilteredContacts' as never, { data: JSON.stringify(contacts) });
      } else {
        console.log("❌ No contacts found or sync failed");
        Alert.alert(
          "No Contacts",
          "No contacts were found on your device or sync failed. Please try again.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("❌ Error during contacts sync:", error);
      Alert.alert(
        "Sync Error",
        "An error occurred while syncing contacts. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomStatusBar />
      
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const lastMessage =
            item.messages[item.messages.length - 1] || undefined;

          return (
            <TouchableOpacity
              style={[styles.chatItem, { backgroundColor: colors.background }]}
              onPress={() =>
                navigation.navigate('ConversationScreen' as never, { id: item.id.toString() })
              }
            >
              {/* Avatar */}
              <Image source={{ uri: item.user.avatar }} style={styles.avatar} />

              {/* Chat Info */}
              <View style={styles.chatInfo}>
                <View style={styles.row}>
                  <Text style={[styles.chatName, { color: colors.text }]}>
                    {item.user.name}
                  </Text>
                  <View style={styles.rightSection}>
                    {lastMessage && (
                      <MessageTime
                        timestamp={lastMessage.timestamp}
                        variant="list"
                      />
                    )}
                    {item.unreadCount > 0 && (
                      <View
                        style={[styles.badge, { backgroundColor: colors.primary }]}
                      >
                        <Text style={[styles.badgeText, { color: colors.textOnPrimary }]}>
                          {item.unreadCount}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <Text
                  style={[styles.lastMessage, { color: colors.subText }]}
                  numberOfLines={1}
                >
                  {lastMessage?.content}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => (
          <View
            style={[styles.separator, { backgroundColor: colors.border }]}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      {/* Floating Plus Button */}
      <TouchableOpacity
        style={[
          styles.fab, 
          { 
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
          },
          isLoading && { opacity: 0.7 }
        ]}
        onPress={handleAddPress}
        activeOpacity={0.7}
        disabled={isLoading}
      >
        <Icon 
          name={isLoading ? "sync" : "add"} 
          size={32} 
          color={colors.textOnPrimary} 
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  listContent: {
    paddingBottom: 80, // Space for FAB
  },
  chatItem: {
    flexDirection: "row",
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    alignItems: "center",
  },
  avatar: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    marginRight: moderateScale(12),
  },
  chatInfo: { 
    flex: 1, 
    justifyContent: "center" 
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: moderateScale(4),
  },
  chatName: { 
    fontSize: moderateScale(16), 
    fontWeight: "600",
    flex: 1,
    marginRight: moderateScale(8),
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8),
    minWidth: moderateScale(80),
    flexShrink: 0,
  },
  lastMessage: { 
    fontSize: moderateScale(14),
    flex: 1,
    flexShrink: 1,
  },
  badge: {
    minWidth: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: moderateScale(12),
    fontWeight: "600",
  },
  separator: { 
    height: StyleSheet.hairlineWidth,
    marginLeft: moderateScale(78), // Align with text content
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
