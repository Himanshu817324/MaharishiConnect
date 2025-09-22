import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../theme';
import CustomStatusBar from '../../../../components/atoms/ui/StatusBar';

export default function FilteredContactsScreen() {
  const route = useRoute();
  const { data } = route.params as { data: string };
  const { colors } = useTheme();
  
  const contacts = JSON.parse(data || '[]');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const toggleContact = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const renderContact = ({ item }: { item: any }) => {
    const isSelected = selectedContacts.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.contactItem,
          { backgroundColor: colors.card },
          isSelected && { backgroundColor: colors.primary + '20' }
        ]}
        onPress={() => toggleContact(item.id)}
      >
        <Image
          source={{ uri: item.thumbnailPath || 'https://via.placeholder.com/50' }}
          style={styles.avatar}
        />
        <View style={styles.contactInfo}>
          <Text style={[styles.contactName, { color: colors.text }]}>
            {item.displayName}
          </Text>
          {item.phoneNumbers && item.phoneNumbers.length > 0 && (
            <Text style={[styles.phoneNumber, { color: colors.subText }]}>
              {item.phoneNumbers[0].number}
            </Text>
          )}
        </View>
        {isSelected && (
          <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Select Contacts ({selectedContacts.length} selected)
        </Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>
          Choose contacts to invite to Maharishi Connect
        </Text>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
        style={styles.contactsList}
        showsVerticalScrollIndicator={false}
      />

      {selectedContacts.length > 0 && (
        <View style={[styles.bottomBar, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[styles.inviteButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              // Handle invite logic here
              console.log('Inviting contacts:', selectedContacts);
            }}
          >
            <Text style={[styles.inviteButtonText, { color: colors.textOnPrimary }]}>
              Invite {selectedContacts.length} Contact{selectedContacts.length > 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  contactsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 14,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inviteButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  inviteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
