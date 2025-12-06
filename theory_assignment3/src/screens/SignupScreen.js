import { useUser } from '../contexts/UserContext';
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      Alert.alert('Error', 'Please agree to terms and conditions');
      return;
    }

    Alert.alert('Success', 'Account created successfully!');
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color="#8E44AD" />
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Join Birthday Reminder family</Text>

            <View style={styles.inputWrapper}>
              <Icon name="person-outline" size={20} color="#8E44AD" style={styles.inputIcon} />
              <TextInput
                placeholder="Full Name"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Icon name="mail-outline" size={20} color="#8E44AD" style={styles.inputIcon} />
              <TextInput
                placeholder="Email Address"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Icon name="lock-closed-outline" size={20} color="#8E44AD" style={styles.inputIcon} />
              <TextInput
                placeholder="Password"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#8E44AD"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <Icon name="lock-closed-outline" size={20} color="#8E44AD" style={styles.inputIcon} />
              <TextInput
                placeholder="Confirm Password"
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#8E44AD"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setAgreeTerms(!agreeTerms)}
            >
              <Icon
                name={agreeTerms ? "checkbox" : "square-outline"}
                size={24}
                color="#8E44AD"
              />
              <Text style={styles.termsText}>
                I agree to the Terms & Conditions and Privacy Policy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupButtonText}>Create Account</Text>
              <Icon name="person-add" size={20} color="#fff" />
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1FF',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8E44AD',
    marginLeft: 20,
  },
  formContainer: {
    padding: 25,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E8DAEF',
  },
  inputIcon: {
    padding: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#2C3E50',
  },
  eyeIcon: {
    padding: 15,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#7F8C8D',
    marginLeft: 10,
  },
  signupButton: {
    backgroundColor: '#8E44AD',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  loginLink: {
    fontSize: 16,
    color: '#8E44AD',
    fontWeight: 'bold',
  },
});