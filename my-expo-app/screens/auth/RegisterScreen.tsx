import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView, ImageBackground, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { RegisterScreenProps } from '../../types/navigation';

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await register(name, email, password, phone);
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
          style={styles.headerImage}
        >
          <View style={styles.imageOverlay}>
            <Text style={styles.headerTitle}>LOTTO WIN</Text>
            <Text style={styles.headerSubtitle}>Register to play</Text>
          </View>
        </ImageBackground>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Create Account</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            returnKeyType="next"
          />

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number (e.g. +1234567890)"
            placeholderTextColor="#999"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            returnKeyType="next"
          />

          <TextInput
            style={styles.input}
            placeholder="Password (min 6 characters)"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
          />

          <Pressable
            style={({ pressed }) => [
              styles.registerButton,
              pressed && styles.buttonPressed,
              isSubmitting && styles.buttonDisabled
            ]}
            onPress={handleRegister}
            disabled={isSubmitting}
          >
            <Text style={styles.registerButtonText}>
              {isSubmitting ? "CREATING ACCOUNT..." : "JOIN & PLAY"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
            disabled={isSubmitting}
          >
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLinkText}>Sign In</Text>
            </Text>
          </Pressable>

          <View style={styles.lotteryBallsContainer}>
            {['🎰', '💰', '🏆', '💎', '🤑'].map((emoji, index) => (
              <Text key={index} style={styles.lotteryBall}>{emoji}</Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6a0dad',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  headerSubtitle: {
    fontSize: 18,
    color: 'white',
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 30,
    minHeight: 550, // Ensures form is tall enough to scroll
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6a0dad',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  registerButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#6a0dad',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginLink: {
    marginTop: 15,
  },
  loginText: {
    textAlign: 'center',
    color: '#666',
  },
  loginLinkText: {
    color: '#6a0dad',
    fontWeight: 'bold',
  },
  lotteryBallsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  lotteryBall: {
    fontSize: 30,
    marginHorizontal: 8,
  },
});

export default RegisterScreen;