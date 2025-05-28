import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { ProfileScreenProps } from '../types/navigation';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { user, logout } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(
    'https://randomuser.me/api/portraits/men/1.jpg'
  );

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Profile Header */}
      <View className="items-center bg-white pb-6 pt-8 shadow-sm">
        <View className="relative mb-4">
          <Image
            source={{ uri: profileImage || 'https://randomuser.me/api/portraits/men/1.jpg' }}
            className="h-24 w-24 rounded-full border-4 border-purple-100"
          />
          <TouchableOpacity 
            className="absolute bottom-0 right-0 rounded-full bg-purple-600 p-2"
            onPress={pickImage}
          >
            <MaterialIcons name="edit" size={16} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-2xl font-bold text-gray-900">{user?.name}</Text>
      </View>

      {/* Rest of your existing code... */}
      {/* Account Information */}
      <View className="mx-4 my-6 rounded-xl bg-white p-6 shadow-sm">
        <Text className="mb-4 text-lg font-bold text-gray-900">Account Information</Text>

        <View className="mb-5">
          <Text className="mb-1 text-sm text-gray-500">Full Name</Text>
          <View className="flex-row items-center border-b border-gray-100 pb-2">
            <FontAwesome name="user" size={16} color="#7e22ce" className="mr-3" />
            <Text className="text-base text-gray-900">{user?.name}</Text>
          </View>
        </View>

        <View className="mb-5">
          <Text className="mb-1 text-sm text-gray-500">Email Address</Text>
          <View className="flex-row items-center border-b border-gray-100 pb-2">
            <MaterialIcons name="email" size={16} color="#7e22ce" className="mr-3" />
            <Text className="text-base text-gray-900">{user?.email}</Text>
          </View>
        </View>

        <View className="mb-5">
          <Text className="mb-1 text-sm text-gray-500">Phone Number</Text>
          <View className="flex-row items-center border-b border-gray-100 pb-2">
            <MaterialIcons name="phone" size={16} color="#7e22ce" className="mr-3" />
            <Text className="text-base text-gray-900">{user?.phone || 'Not provided'}</Text>
          </View>
        </View>

        <View>
          <Text className="mb-1 text-sm text-gray-500">Member Since</Text>
          <View className="flex-row items-center">
            <MaterialIcons name="calendar-today" size={16} color="#7e22ce" className="mr-3" />
            <Text className="text-base text-gray-900">
              {user?.createdAt ? formatDate(user.createdAt) : 'Unknown'}
            </Text>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={logout}
        className="mx-4 my-6 items-center rounded-xl bg-red-50 p-4 shadow-sm">
        <Text className="font-bold text-red-600">Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;