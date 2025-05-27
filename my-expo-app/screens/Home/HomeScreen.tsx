import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Animated,
  RefreshControl,
  Alert,
  PanResponder,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = () => {
  const isFocused = useIsFocused();
  const [walletBalance, setWalletBalance] = useState(12500);
  const [selectedItem, setSelectedItem] = useState<Prize | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  const alpUrl = 'http://192.168.42.246:5000';

  // Enhanced material prizes data
  type Prize = {
    id: number;
    name: string;
    value: string;
    image: string;
    category: string;
    ticketsLeft: number;
    ticketPrice: number;
    featured?: boolean;
  };

  const [materialPrizes, setMaterialPrizes] = useState<Prize[]>([]);

  // Mock winners data
  const [recentWinners, setRecentWinners] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      prize: 'Rolex Submariner',
      value: '$12,500',
      date: '2 hours ago',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 2,
      name: 'Sarah Williams',
      prize: 'Gucci Handbag',
      value: '$3,200',
      date: '5 hours ago',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: 3,
      name: 'Michael Chen',
      prize: 'Apple MacBook Pro',
      value: '$2,499',
      date: '1 day ago',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      prize: 'Sony PlayStation 5',
      value: '$1,200',
      date: '2 days ago',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    },
  ]);

  const featuredScrollViewRef = useRef<ScrollView>(null);
  const winnersScrollViewRef = useRef<ScrollView>(null);

  // PanResponder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) > 50) {
          // Minimum swipe distance
          if (gestureState.dx > 0) {
            // Swipe right - previous item
            setActiveFeaturedIndex((prev) => (prev === 0 ? featuredPrizes.length - 1 : prev - 1));
          } else {
            // Swipe left - next item
            setActiveFeaturedIndex((prev) => (prev === featuredPrizes.length - 1 ? 0 : prev + 1));
          }
        }
      },
    })
  ).current;

  const fechData = async () => {
    try {
      const response = await fetch(`${alpUrl}/api/posts`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMaterialPrizes(data);
    } catch (error) {
      console.error('Failed to fetch material prizes:', error);
    } finally {
      setRefreshing(false);
    }
  };

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

  // Refresh data when screen comes into focus
  useEffect(() => {
    if (isFocused) {
      fechData();
      fetchBalance();
    }
  }, [isFocused]);

  // Initial data load
  useEffect(() => {
    fechData();
    fetchBalance();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fechData();
    fetchBalance();
  };

  // Get featured prizes
  const featuredPrizes = materialPrizes.filter((prize) => prize.featured);
  const regularPrizes = materialPrizes.filter((prize) => !prize.featured);

  // Auto-rotate featured prizes
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setActiveFeaturedIndex((prev) => (prev + 1) % featuredPrizes.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredPrizes.length]);

  // Scroll to active featured index when it changes
  useEffect(() => {
    if (featuredScrollViewRef.current && featuredPrizes.length > 0) {
      featuredScrollViewRef.current.scrollTo({
        x: activeFeaturedIndex * screenWidth,
        animated: true,
      });
    }
  }, [activeFeaturedIndex, featuredPrizes.length]);

  const handleBuyTickets = () => {
    if (!selectedItem) return;

    const totalCost = selectedItem.ticketPrice * ticketQuantity;

    if (totalCost > walletBalance) {
      alert('Insufficient balance! Please add funds to your wallet.');
      return;
    }

    // Deduct from balance with animation
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setWalletBalance(walletBalance - totalCost);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    alert(`Successfully purchased ${ticketQuantity} tickets for ${selectedItem.name}!`);

    // Close modal
    setShowModal(false);
    setTicketQuantity(1);
  };

  const openPurchaseModal = (item: Prize) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const formatBalance = (amount: number) => {
    return amount.toLocaleString('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Enhanced Header with Wallet */}
        <View className="flex-row items-center justify-between pt-2">
          <View>
            <Text className="text-sm text-gray-500">Welcome to</Text>
            <Text className="text-3xl font-bold text-purple-900">LuxuryLotto</Text>
          </View>
          <TouchableOpacity className="flex-row items-center rounded-xl bg-white p-3 shadow-sm">
            <View className="mr-2 rounded-full bg-purple-100 p-2">
              <MaterialIcons name="account-balance-wallet" size={20} color="#7e22ce" />
            </View>
            <View>
              <Text className="text-xs text-gray-500">Your Balance</Text>
              <Text className="font-bold text-purple-900">{formatBalance(walletBalance)}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Featured Prizes Carousel */}
        <Text className="mb-4 mt-6 text-2xl font-bold text-gray-800">Featured Prizes</Text>
        <View className="mb-8 h-80" {...panResponder.panHandlers}>
          <ScrollView
            ref={featuredScrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
              useNativeDriver: false,
            })}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
              setActiveFeaturedIndex(newIndex);
            }}>
            {featuredPrizes.map((prize) => (
              <View key={prize.id} style={{ width: screenWidth - 32 }}>
                <TouchableOpacity
                  className="h-72 overflow-hidden rounded-2xl bg-white shadow-xl"
                  onPress={() => openPurchaseModal(prize)}>
                  <Image
                    source={{ uri: `${alpUrl}${prize.image}` }}
                    className="h-36 w-full"
                    resizeMode="cover"
                  />
                  <View className="p-5">
                    <View className="mb-2 flex-row items-start justify-between">
                      <Text className="text-xl font-bold text-gray-900">{prize.name}</Text>
                      <View className="rounded-full bg-purple-100 px-2 py-1">
                        <Text className="text-xs font-semibold text-purple-800">
                          {prize.category}
                        </Text>
                      </View>
                    </View>
                    <Text className="mb-3 text-lg font-semibold text-purple-600">
                      {prize.value}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <MaterialIcons name="confirmation-number" size={18} color="#9ca3af" />
                        <Text className="ml-1 text-gray-500">{prize.ticketsLeft} left</Text>
                      </View>
                      <View className="rounded-full bg-purple-600 px-4 py-2">
                        <Text className="font-bold text-white">ETB {prize.ticketPrice}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <View className="mt-3 flex-row justify-center">
            {featuredPrizes.map((_, i) => (
              <View
                key={i}
                className={`mx-1 h-2 w-2 rounded-full ${i === activeFeaturedIndex ? 'bg-purple-600' : 'bg-gray-300'}`}
              />
            ))}
          </View>
        </View>

        {/* Recent Winners Section */}
        <Text className="mb-4 text-2xl font-bold text-gray-800">Recent Winners</Text>
        <ScrollView
          ref={winnersScrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6">
          <View className="flex-row">
            {recentWinners.map((winner) => (
              <View key={winner.id} className="mr-4 w-64 rounded-2xl bg-white p-5 shadow-sm">
                <View className="flex-row items-center">
                  <Image source={{ uri: winner.avatar }} className="h-12 w-12 rounded-full" />
                  <View className="ml-3 flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-bold text-gray-900">{winner.name}</Text>
                      <Text className="text-xs text-gray-500">{winner.date}</Text>
                    </View>
                    <Text className="text-purple-600">{winner.prize}</Text>
                    <Text className="text-sm text-gray-500">Won {winner.value}</Text>
                  </View>
                  <MaterialIcons name="verified" size={20} color="#7e22ce" />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity className="mb-6 items-center">
          <Text className="font-bold text-purple-600">View All Winners</Text>
        </TouchableOpacity>

        {/* All Prizes Grid */}
        <Text className="mb-4 text-2xl font-bold text-gray-800">Available Prizes</Text>
        <View className="mb-6 flex-row flex-wrap justify-between">
          {regularPrizes.map((prize) => (
            <TouchableOpacity
              key={prize.id}
              className="mb-4 w-[48%] overflow-hidden rounded-2xl bg-white shadow-md"
              onPress={() => openPurchaseModal(prize)}>
              <Image
                source={{ uri: `${alpUrl}${prize.image}` }}
                className="h-36 w-full"
                resizeMode="cover"
              />
              <View className="p-3">
                <Text className="font-bold text-gray-900">{prize.name}</Text>
                <Text className="mb-2 text-sm font-semibold text-purple-600">{prize.value}</Text>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <MaterialIcons name="confirmation-number" size={14} color="#9ca3af" />
                    <Text className="ml-1 text-xs text-gray-500">{prize.ticketsLeft}</Text>
                  </View>
                  <Text className="rounded-full bg-purple-100 px-2 py-1 text-xs font-bold text-purple-800">
                    ETB {prize.ticketPrice}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* How It Works Section */}
        <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <Text className="mb-4 text-xl font-bold text-gray-800">How It Works</Text>
          <View className="mb-3 flex-row items-start">
            <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-purple-100">
              <Text className="font-bold text-purple-800">1</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-900">Choose a Prize</Text>
              <Text className="text-sm text-gray-500">Browse our collection of luxury items</Text>
            </View>
          </View>
          <View className="mb-3 flex-row items-start">
            <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-purple-100">
              <Text className="font-bold text-purple-800">2</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-900">Buy Tickets</Text>
              <Text className="text-sm text-gray-500">Purchase tickets for your chance to win</Text>
            </View>
          </View>
          <View className="flex-row items-start">
            <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-purple-100">
              <Text className="font-bold text-purple-800">3</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-900">Win & Claim</Text>
              <Text className="text-sm text-gray-500">If you win, we'll deliver your prize!</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Purchase Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}>
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-11/12 rounded-2xl bg-white p-6">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-900">Buy Tickets</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <MaterialIcons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {selectedItem && (
              <>
                <View className="mb-4 flex-row items-center">
                  <Image
                    source={{ uri: `${alpUrl}${selectedItem.image}` }}
                    className="mr-3 h-16 w-16 rounded-lg"
                    resizeMode="cover"
                  />
                  <View>
                    <Text className="font-bold text-gray-900">{selectedItem.name}</Text>
                    <Text className="font-semibold text-purple-600">{selectedItem.value}</Text>
                    <Text className="text-sm text-gray-500">
                      ETB {selectedItem.ticketPrice} per ticket
                    </Text>
                  </View>
                </View>

                <View className="mb-6">
                  <Text className="mb-2 text-gray-700">Quantity</Text>
                  <View className="flex-row items-center justify-between rounded-lg border border-gray-200 p-2">
                    <TouchableOpacity
                      className="rounded-lg bg-gray-100 p-2"
                      onPress={() => setTicketQuantity((prev) => Math.max(1, prev - 1))}>
                      <MaterialIcons name="remove" size={20} color="#6b7280" />
                    </TouchableOpacity>
                    <Text className="mx-4 text-lg font-bold">{ticketQuantity}</Text>
                    <TouchableOpacity
                      className="rounded-lg bg-gray-100 p-2"
                      onPress={() => setTicketQuantity((prev) => prev + 1)}>
                      <MaterialIcons name="add" size={20} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="mb-6 flex-row items-center justify-between">
                  <Text className="text-gray-700">Total Cost</Text>
                  <Text className="text-lg font-bold text-purple-600">
                    ETB {selectedItem.ticketPrice * ticketQuantity}
                  </Text>
                </View>
                <TouchableOpacity
                  className="items-center rounded-xl bg-purple-600 py-4"
                  onPress={handleBuyTickets}>
                  <Text className="font-bold text-white">Confirm Purchase</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;
