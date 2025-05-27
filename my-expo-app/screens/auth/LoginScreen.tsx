import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, Image, Alert, ImageBackground } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { LoginScreenProps } from '../../types/navigation';

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
    } catch (error) {
      let errorMessage = 'An error occurred during login';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Using a placeholder lottery image from a free service
  const lotteryImage = { uri: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' };

  return (
    <ScrollView 
      className="flex-1 bg-purple-900"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <ImageBackground
        source={lotteryImage}
        className="w-full h-64"
        resizeMode="cover"
      >
        <View className="bg-black/50 w-full h-full flex items-center justify-center">
          <Text className="text-4xl font-bold text-yellow-400">LOTTO WIN</Text>
          <Text className="text-white text-lg mt-2">Your jackpot awaits</Text>
        </View>
      </ImageBackground>

      <View className="p-8 bg-purple-900 rounded-t-3xl -mt-10">
        {/* Email Input */}
        <TextInput
          className="h-14 border-2 border-yellow-400 bg-white rounded-xl px-4 mb-4 text-gray-800 text-lg"
          placeholder="Email address"
          placeholderTextColor="#6B7280"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Password Input */}
        <TextInput
          className="h-14 border-2 border-yellow-400 bg-white rounded-xl px-4 mb-6 text-gray-800 text-lg"
          placeholder="Password"
          placeholderTextColor="#6B7280"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Login Button */}
        <Pressable
          className={`bg-yellow-500 rounded-xl p-4 ${isSubmitting ? 'opacity-50' : ''}`}
          onPress={handleLogin}
          disabled={isSubmitting}
        >
          <Text className="text-purple-900 text-center font-bold text-xl">
            {isSubmitting ? "Checking your luck..." : "TRY YOUR LUCK"}
          </Text>
        </Pressable>

        {/* Navigation Links */}
        <View className="mt-6 flex-row justify-center">
          <Text className="text-white text-lg">No account yet? </Text>
          <Pressable 
            onPress={() => navigation.navigate('Register')}
            disabled={isSubmitting}
          >
            <Text className="text-yellow-400 font-bold text-lg">SIGN UP</Text>
          </Pressable>
        </View>

        <Pressable 
          className="mt-4"
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text className="text-white text-center underline text-lg">
            Forgot password?
          </Text>
        </Pressable>

        {/* Lottery balls decoration at bottom */}
        <View className="flex-row justify-center mt-10 mb-5">
          {['🎰', '💰', '🏆', '💎', '🤑'].map((emoji, index) => (
            <Text key={index} className="text-4xl mx-2">{emoji}</Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;