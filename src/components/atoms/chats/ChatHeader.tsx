import { chats } from "../../../constants/MockData";
import { useTheme } from "../../../theme";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { moderateScale } from "../../../theme/responsive";

const ChatHeader = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as { id: string };
  const { colors } = useTheme();
  const chat = chats.find((c) => c.id.toString() === id);
  if (!chat) return null;
  const user = chat.user;

  return (
    <View style={[styles.header, { backgroundColor: colors.primary }]}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Icon name="arrow-back" size={moderateScale(24)} color={colors.textOnPrimary} />
      </TouchableOpacity>
      
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: colors.textOnPrimary }]}>
          {user.name}
        </Text>
        <Text style={[styles.userStatus, { color: colors.textOnPrimary }]}>
          {user.isOnline ? "Online" : "Last seen recently"}
        </Text>
      </View>
      
      <TouchableOpacity style={styles.actionButton}>
        <Icon name="call" size={moderateScale(22)} color={colors.textOnPrimary} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionButton}>
        <Icon name="videocam" size={moderateScale(22)} color={colors.textOnPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: moderateScale(4),
    marginRight: moderateScale(8),
  },
  avatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    marginRight: moderateScale(12),
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: moderateScale(18),
    fontWeight: "600",
  },
  userStatus: {
    fontSize: moderateScale(12),
    opacity: 0.8,
  },
  actionButton: {
    padding: moderateScale(8),
    marginLeft: moderateScale(8),
  },
});

export default ChatHeader;
