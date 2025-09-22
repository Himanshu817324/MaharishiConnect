import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { apiService } from '../../services/apiService';
import { locationsService } from '../../services/locationsService';
import { RootState } from '../../store';
import { login } from '../../store/slices/authSlice';
import { LightColors } from '../../theme/colors';
import { RootStackParamList } from '../../types/navigation';
import ModernDropdown from '../../components/atoms/ui/ModernDropdown';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AuthStack'>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  console.log("🎯 ProfileScreen loaded!");
  console.log("User data:", user);
  console.log("Is logged in:", useSelector((state: RootState) => state.auth.isLoggedIn));

  // Prefill fields if user data exists
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [selectedCountry, setSelectedCountry] = useState(user?.country || "");
  const [selectedState, setSelectedState] = useState(user?.state || "");
  const [selectedStatus, setSelectedStatus] = useState(user?.status || "");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Dynamic location data
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login' as never);
    }
  }, [user, navigation]);

  // Load countries and states from API
  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoadingLocations(true);
        
        // Load countries
        const countriesData = await locationsService.getCountries();
        setCountries(countriesData);
        
        // If user has a pre-selected country, load its states
        if (user?.country) {
          const statesData = await locationsService.getStates(user.country);
          setStates(statesData);
        }
      } catch (error) {
        console.error('Error loading locations:', error);
        // Don't show error toast for fallback data, just log it
        console.log('Using fallback location data');
      } finally {
        setLoadingLocations(false);
      }
    };

    loadLocations();
  }, [user?.country]);

  if (!user) {
    return null; 
  }

  const { firebaseUid, phone, isVerified } = user;

  // Save Profile Logic
  const onSubmit = async () => {
    if (loadingLocations) {
      Toast.show({ type: "error", text1: "Please wait while locations are loading" });
      return;
    }
    
    if (!fullName || !selectedCountry || !selectedState || !selectedStatus) {
      Toast.show({ type: "error", text1: "Please fill all fields" });
      return;
    }

    const payload = {
      firebaseUid,
      profilePicture: "https://picsum.photos/200", // Backend expects profilePicture, not avatar
      fullName,
      mobileNo: phone,
      location: {
        country: selectedCountry,
        state: selectedState
      }, // Backend expects location as object with country and state
      status: selectedStatus,
      isVerified,
      isActive: true,
    };

    try {
      setLoading(true);
      console.log("=== PROFILE SAVE DEBUG ===");
      console.log("Saving profile with payload:", JSON.stringify(payload, null, 2));
      console.log("Firebase UID:", firebaseUid);
      console.log("Phone:", phone);
      console.log("Full Name:", fullName);
      console.log("Country:", selectedCountry);
      console.log("State:", selectedState);
      console.log("Status:", selectedStatus);

      const response = await apiService.signup(payload as any);

      console.log("✅ Profile save response:", JSON.stringify(response, null, 2));

      // Update Redux with latest user info from backend
      if (response && response.user) {
        // Handle location object structure
        const location = response.user.location || { country: selectedCountry, state: selectedState };
        const country = location.country || selectedCountry;
        const state = location.state || selectedState;
        
        dispatch(
          login({
            firebaseUid: response.user.firebaseUid,
            phone: response.user.mobileNo,
            isVerified: response.user.isVerified,
            fullName: response.user.fullName,
            avatar: response.user.profilePicture || "https://picsum.photos/200",
            country: country,
            state: state,
            status: response.user.status,
          })
        );
      }

      Toast.show({ type: "success", text1: "Profile saved successfully!" });
      navigation.navigate('MainStack' as never);
    } catch (err: unknown) {
      console.error("❌ Profile save error:", err);
      console.error("Error type:", typeof err);
      console.error("Error details:", JSON.stringify(err, null, 2));

      let errorMessage = "Failed to save profile";

      if (err instanceof Error) {
        errorMessage = err.message;
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);

        if (err.message.includes("Network request failed")) {
          errorMessage = "Network error: Please check your internet connection";
        } else if (err.message.includes("timeout")) {
          errorMessage = "Request timeout: Please try again";
        } else if (err.message.includes("CORS")) {
          errorMessage = "Server configuration error: Please contact support";
        } else if (err.message.includes("User not found")) {
          errorMessage = "User not found. Please try logging in again.";
        } else if (err.message.includes("Validation")) {
          errorMessage = "Please check all fields are filled correctly";
        }
      }

      Toast.show({ type: "error", text1: "Profile Save Failed", text2: errorMessage });
    } finally {
      setLoading(false);
    }
  };


  const getCountryEmoji = (country: string) => {
    switch(country) {
      case 'India': return '🇮🇳';
      case 'UK': return '🇬🇧';
      case 'USA': return '🇺🇸';
      default: return '🌍';
    }
  };

  const getStateEmoji = (_state: string) => {
    // You can add specific state emojis if needed
    return '📍';
  };

  // Reset state when country changes and load new states
  const handleCountryChange = async (country: string) => {
    setSelectedCountry(country);
    setSelectedState(""); // Reset state when country changes
    
    // Load states for the selected country
    try {
      const statesData = await locationsService.getStates(country);
      setStates(statesData);
    } catch (error) {
      console.error(`Error loading states for ${country}:`, error);
      // Don't show error toast for fallback data, just log it
      console.log(`Using fallback states for ${country}`);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Let&apos;s set up your account to get started
          </Text>
        </View>

        {/* Profile Image Section */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: "https://picsum.photos/200" }}
              style={styles.profileImage}
            />
            <View style={styles.imageOverlay}>
              <Text style={styles.imageOverlayText}>📷</Text>
            </View>
          </View>
          <Text style={styles.imageText}>Profile Picture</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Full Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>👤 Full Name</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'fullName' && styles.inputFocused
              ]}
              placeholder="Enter your full name"
              placeholderTextColor={LightColors.subText}
              value={fullName}
              onChangeText={setFullName}
              onFocus={() => setFocusedField('fullName')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Country Picker */}
          <ModernDropdown
            label="Country"
            emoji="🌍"
            options={countries.map(country => ({
              label: country,
              value: country,
              emoji: getCountryEmoji(country)
            }))}
            selectedValue={selectedCountry}
            onValueChange={handleCountryChange}
            placeholder="Select your country"
            loading={loadingLocations}
            disabled={loadingLocations}
          />

          {/* State Picker */}
          <ModernDropdown
            label="State/Region"
            emoji="📍"
            options={states.map(state => ({
              label: state,
              value: state,
              emoji: getStateEmoji(state)
            }))}
            selectedValue={selectedState}
            onValueChange={(value) => setSelectedState(value)}
            placeholder={
              loadingLocations 
                ? "Loading states..." 
                : selectedCountry 
                  ? "Select your state/region" 
                  : "Select country first"
            }
            loading={loadingLocations}
            disabled={!selectedCountry || loadingLocations}
          />

          {/* Status Picker */}
          <ModernDropdown
            label="Status"
            emoji="📊"
            options={[
              { label: "Available", value: "Available", emoji: "🟢" },
              { label: "Working", value: "Working", emoji: "💼" },
              { label: "Busy", value: "Busy", emoji: "🔴" },
              { label: "Away", value: "Away", emoji: "⏰" },
            ]}
            selectedValue={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value)}
            placeholder="Select your status"
          />
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.saveButton, (loading || loadingLocations) && styles.saveButtonDisabled]}
          onPress={onSubmit}
          disabled={loading || loadingLocations}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {loadingLocations 
              ? "Loading locations..." 
              : loading 
                ? "Setting up your profile..." 
                : "Complete Setup"
            }
          </Text>
          {!loading && !loadingLocations && <Text style={styles.buttonArrow}>✨</Text>}
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by</Text>
          <Text style={styles.brandText}>Maharishi Connect</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightColors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: LightColors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: LightColors.subText,
    textAlign: 'center',
    lineHeight: 24,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: LightColors.primary,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: LightColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: LightColors.background,
  },
  imageOverlayText: {
    fontSize: 16,
  },
  imageText: {
    fontSize: 14,
    color: LightColors.subText,
    fontWeight: '600',
  },
  formSection: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: LightColors.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: LightColors.card,
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    color: LightColors.text,
    borderWidth: 2,
    borderColor: LightColors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  inputFocused: {
    borderColor: LightColors.primary,
    shadowColor: LightColors.primary,
    shadowOpacity: 0.1,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    paddingTop: 20,
    backgroundColor: LightColors.background,
  },
  saveButton: {
    backgroundColor: LightColors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: LightColors.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: 24,
  },
  saveButtonDisabled: {
    backgroundColor: LightColors.subText,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: LightColors.textOnPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  buttonArrow: {
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: LightColors.subText,
    marginBottom: 4,
  },
  brandText: {
    fontSize: 16,
    fontWeight: '700',
    color: LightColors.primary,
  },
});
