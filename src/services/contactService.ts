import Contacts from "react-native-contacts";
import { Alert, PermissionsAndroid, Platform } from "react-native";

export async function fetchContacts() {
  try {
    // Request permissions
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts Permission',
          message: 'This app needs access to your contacts to find friends.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Permission Denied ❌", "Contacts permission is required.");
        return [];
      }
    }

    // Get contacts
    const contacts = await Contacts.getAll();
    
    if (!contacts || contacts.length === 0) {
      Alert.alert("No Contacts Found", "Your contact list is empty.");
      return [];
    }

    // Filter contacts that have phone numbers
    const contactsWithPhones = contacts.filter(contact => 
      contact.phoneNumbers && contact.phoneNumbers.length > 0
    );

    console.log("📱 Found contacts with phone numbers:", contactsWithPhones.length);
    
    return contactsWithPhones; // return contacts that have phone numbers
  } catch (error) {
    console.error("Error fetching contacts:", error);
    Alert.alert("Error", "Something went wrong while fetching contacts.");
    return [];
  }
}
