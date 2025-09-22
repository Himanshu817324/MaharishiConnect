import { useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatHeader from '../../../../components/atoms/chats/ChatHeader';
import ChatInput from '../../../../components/atoms/chats/ChatInput';
import DateHeader from '../../../../components/atoms/chats/DateHeader';
import MessageBubble from '../../../../components/atoms/chats/MessageBubble';
import CustomStatusBar from '../../../../components/atoms/ui/StatusBar';
import { chats } from '../../../../constants/MockData';
import { useTheme } from '../../../../theme';

export default function ConversationScreen() {
  const route = useRoute();
  const { id } = route.params as { id: string };
  const chat = chats.find((c) => c.id.toString() === id);
  const { colors, isDark } = useTheme();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState(chat ? [...chat.messages] : []);

  // Group messages by date and create a combined list with date headers
  const getGroupedMessages = () => {
    if (messages.length === 0) return [];
    
    const grouped: { type: 'date' | 'message'; data: any; id: string }[] = [];
    let currentDate = '';
    
    messages.forEach((message, index) => {
      try {
        const date = new Date(message.timestamp);
        
        // Check if the date is valid
        if (isNaN(date.getTime())) {
          console.warn('Invalid timestamp in message:', message.timestamp);
          return; // Skip this message
        }
        
        const messageDate = date.toDateString();
        
        // Add date header if it's a new date
        if (messageDate !== currentDate) {
          grouped.push({
            type: 'date',
            data: message.timestamp,
            id: `date-${messageDate}`,
          });
          currentDate = messageDate;
        }
      } catch (error) {
        console.warn('Error processing message timestamp:', error, message.timestamp);
        return; // Skip this message
      }
      
      // Add the message
      grouped.push({
        type: 'message',
        data: message,
        id: message.id.toString(),
      });
    });
    
    return grouped;
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const newMessage = {
      id: Date.now(),
      content: content.trim(),
      timestamp: new Date().toISOString(),
      sender: 'me',
      type: 'text' as const,
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const renderItem = ({ item }: { item: { type: 'date' | 'message'; data: any; id: string } }) => {
    if (item.type === 'date') {
      return <DateHeader date={item.data} />;
    }

    const message = item.data;
    const isMe = message.sender === 'me';
    const showTime = true; // You can add logic to show/hide time based on message grouping

    return (
      <MessageBubble
        message={message}
        isMe={isMe}
        showTime={showTime}
        onPress={() => {}}
      />
    );
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  if (!chat) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomStatusBar />
      
      <ChatHeader
        user={chat.user}
        onBackPress={() => {}}
        onMorePress={() => {}}
      />

      <FlatList
        ref={flatListRef}
        data={getGroupedMessages()}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ChatInput onSendMessage={handleSendMessage} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
});
