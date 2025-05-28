import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Wallet() {
  const alpUrl = 'http://192.168.3.72:5000';
  const [balance, setWalletBalance] = useState<number>(0);
  const [addFundsModalVisible, setAddFundsModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBalance = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${alpUrl}/api/wallet/balance`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch balance: ${response.status}`);
      }

      const data = await response.json();
      const balanceValue = parseFloat(data.balance);

      if (isNaN(balanceValue)) {
        throw new Error('Invalid balance value received');
      }

      setWalletBalance(balanceValue);
    } catch (error) {
      console.error('Wallet balance error:', error);
      Alert.alert('Error', 'Failed to load wallet balance');
      setWalletBalance(0);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBalance();
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleAddFunds = async () => {
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive amount');
      return;
    }

    setIsProcessing(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${alpUrl}/api/wallet/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: amountValue }),
      });

      if (!response.ok) {
        throw new Error(response.status === 401 ? 'Unauthorized' : 'Failed to add funds');
      }

      await fetchBalance();
      Alert.alert('Success', `Added ${amountValue.toFixed(2)} ETB to your wallet`);
      setAddFundsModalVisible(false);
      setAmount('');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to add funds');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive amount');
      return;
    }

    if (amountValue > balance) {
      Alert.alert('Insufficient Funds', 'You cannot withdraw more than your current balance');
      return;
    }

    setIsProcessing(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${alpUrl}/api/wallet/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: amountValue }),
      });

      if (!response.ok) {
        throw new Error(response.status === 401 ? 'Unauthorized' : 'Failed to withdraw funds');
      }

      await fetchBalance();
      Alert.alert('Success', `Withdrew ${amountValue.toFixed(2)} ETB from your wallet`);
      setWithdrawModalVisible(false);
      setAmount('');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to withdraw funds');
    } finally {
      setIsProcessing(false);
    }
  };

  const transactions = [
    { id: '1', type: 'Deposit', amount: 100.0, date: 'May 26, 2025', status: 'Completed' },
    { id: '2', type: 'Ticket Purchase', amount: -25.0, date: 'May 25, 2025', status: 'Completed' },
    { id: '3', type: 'Withdrawal', amount: -50.0, date: 'May 24, 2025', status: 'Pending' },
  ];

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="light-content" />

      {/* Header Section */}
      <LinearGradient colors={['#6B46C1', '#9F7AEA']} className="rounded-b-3xl p-5 pt-16">
        <Text className="mb-6 text-3xl font-bold tracking-wide text-white">My Wallet</Text>
        <View className="rounded-2xl bg-white p-5 shadow-lg shadow-black/10">
          <Text className="mb-2 text-base text-gray-500">Current Balance</Text>
          <Text className="text-4xl font-bold text-purple-800">{balance.toFixed(2)} ETB</Text>
        </View>
      </LinearGradient>

      {/* Action Buttons */}
      <View className="flex-row justify-between p-4">
        <TouchableOpacity
          className="mr-2 flex-1 flex-row items-center justify-center rounded-xl bg-purple-800 py-4 shadow-md shadow-black/10"
          activeOpacity={0.7}
          onPress={() => setAddFundsModalVisible(true)}
          disabled={isProcessing}>
          <Feather name="plus-circle" size={20} color="#fff" />
          <Text className="ml-2 text-base font-semibold text-white">Add Funds</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="ml-2 flex-1 flex-row items-center justify-center rounded-xl bg-gray-200 py-4"
          activeOpacity={0.7}
          onPress={() => setWithdrawModalVisible(true)}
          disabled={isProcessing}>
          <Feather name="minus-circle" size={20} color="#4B5563" />
          <Text className="ml-2 text-base font-semibold text-gray-700">Withdraw</Text>
        </TouchableOpacity>
      </View>

      {/* Add Funds Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addFundsModalVisible}
        onRequestClose={() => !isProcessing && setAddFundsModalVisible(false)}>
        <View className="flex-1 justify-center bg-black/50 p-5">
          <View className="rounded-2xl bg-white p-5">
            <Text className="mb-4 text-xl font-bold text-gray-800">Add Funds</Text>

            <TextInput
              className="mb-4 rounded-xl border border-gray-300 p-4"
              placeholder="Enter amount (ETB)"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              editable={!isProcessing}
            />

            <View className="flex-row justify-between">
              <TouchableOpacity
                className="rounded-xl bg-gray-200 px-6 py-3"
                onPress={() => !isProcessing && setAddFundsModalVisible(false)}
                disabled={isProcessing}>
                <Text className="font-semibold text-gray-700">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="rounded-xl bg-purple-800 px-6 py-3"
                onPress={handleAddFunds}
                disabled={isProcessing}>
                <Text className="font-semibold text-white">
                  {isProcessing ? 'Processing...' : 'Add Funds'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={withdrawModalVisible}
        onRequestClose={() => !isProcessing && setWithdrawModalVisible(false)}>
        <View className="flex-1 justify-center bg-black/50 p-5">
          <View className="rounded-2xl bg-white p-5">
            <Text className="mb-4 text-xl font-bold text-gray-800">Withdraw Funds</Text>

            <TextInput
              className="mb-4 rounded-xl border border-gray-300 p-4"
              placeholder="Enter amount (ETB)"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              editable={!isProcessing}
            />

            <View className="flex-row justify-between">
              <TouchableOpacity
                className="rounded-xl bg-gray-200 px-6 py-3"
                onPress={() => !isProcessing && setWithdrawModalVisible(false)}
                disabled={isProcessing}>
                <Text className="font-semibold text-gray-700">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="rounded-xl bg-purple-800 px-6 py-3"
                onPress={handleWithdraw}
                disabled={isProcessing}>
                <Text className="font-semibold text-white">
                  {isProcessing ? 'Processing...' : 'Withdraw'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Transaction History */}
      <Text className="mb-3 mt-4 px-4 text-xl font-bold text-gray-800">Transaction History</Text>
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6B46C1']}
            tintColor="#6B46C1"
          />
        }>
        {transactions.map((transaction) => (
          <View
            key={transaction.id}
            className="mb-3 flex-row items-center justify-between rounded-xl bg-white p-4 shadow-sm shadow-black/5">
            <View className="flex-1">
              <Text className="mb-1 text-base font-semibold text-gray-800">{transaction.type}</Text>
              <Text className="text-sm text-gray-500">
                {transaction.date} • {transaction.status}
              </Text>
            </View>
            <Text
              className={`text-base font-semibold ${
                transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
              {transaction.amount > 0 ? '+' : '-'} {Math.abs(transaction.amount).toFixed(2)} ETB
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
