import { View, Text, Image, ScrollView, TouchableOpacity, Modal, TextInput, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const HomeScreen = () => {
  const [walletBalance, setWalletBalance] = useState(12500);
  const [selectedItem, setSelectedItem] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Enhanced material prizes data
  const [materialPrizes, setMaterialPrizes] = useState([]);
  const fechData = async () => {
    // Fetch data from API or database
    try {
      const response = await fetch('http://192.168.3.72:5000/api/posts');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMaterialPrizes(data);
      
    } catch (error) {
      
      console.error('Failed to fetch material prizes:', error);
    }
  }
  useEffect(() => {
    fechData();
  }, []);
  const materialPrizes1 = [
    {
      id: 1,
      name: 'Beachfront Villa',
      value: '$2.5 Million',
      ticketsLeft: 87,
      ticketPrice: 250,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      endDate: '2023-12-25',
      category: 'Real Estate',
      featured: true
    },
    {
      id: 2,
      name: 'Luxury Sports Car',
      value: '$350,000',
      ticketsLeft: 124,
      ticketPrice: 150,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      endDate: '2023-12-18',
      category: 'Automotive',
      featured: true
    },
    {
      id: 3,
      name: 'Designer Wardrobe Collection',
      value: '$75,000',
      ticketsLeft: 215,
      ticketPrice: 50,
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      endDate: '2023-12-20',
      category: 'Fashion',
      featured: true
    },
    {
      id: 4,
      name: 'Tech Package',
      value: '$25,000',
      ticketsLeft: 342,
      ticketPrice: 25,
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      endDate: '2023-12-15',
      category: 'Electronics'
    },
    {
      id: 5,
      name: 'Exotic Vacation',
      value: '$15,000',
      ticketsLeft: 189,
      ticketPrice: 30,
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      endDate: '2023-12-22',
      category: 'Travel'
    },
    {
      id: 6,
      name: 'Jewelry Set',
      value: '$8,500',
      ticketsLeft: 276,
      ticketPrice: 15,
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      endDate: '2023-12-12',
      category: 'Luxury'
    },
  ];

  // Get featured prizes
  const featuredPrizes = materialPrizes.filter(prize => prize.featured);
  const regularPrizes = materialPrizes.filter(prize => !prize.featured);

  // Auto-rotate featured prizes
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start(() => {
        setActiveFeaturedIndex((prev) => 
          (prev + 1) % featuredPrizes.length
        );
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }).start();
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredPrizes.length]);

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
      useNativeDriver: true
    }).start(() => {
      setWalletBalance(walletBalance - totalCost);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    });
    
    alert(`Successfully purchased ${ticketQuantity} tickets for ${selectedItem.name}!`);
    
    // Close modal
    setShowModal(false);
    setTicketQuantity(1);
  };

  const openPurchaseModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const formatBalance = (amount) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView 
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Header with Wallet */}
        <View className="flex-row justify-between items-center pt-2">
          <View>
            <Text className="text-gray-500 text-sm">Welcome to</Text>
            <Text className="text-3xl font-bold text-purple-900">LuxuryLotto</Text>
          </View>
          <TouchableOpacity className="bg-white p-3 rounded-xl shadow-sm flex-row items-center">
            <View className="bg-purple-100 p-2 rounded-full mr-2">
              <MaterialIcons name="account-balance-wallet" size={20} color="#7e22ce" />
            </View>
            <View>
              <Text className="text-gray-500 text-xs">Your Balance</Text>
              <Text className="font-bold text-purple-900">{formatBalance(walletBalance)}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Featured Prizes Carousel */}
        <Text className="text-2xl font-bold mt-6 mb-4 text-gray-800">Featured Prizes</Text>
        <View className="mb-8 h-80">
          {featuredPrizes.map((prize, index) => (
            <Animated.View 
              key={prize.id}
              style={[{
                display: index === activeFeaturedIndex ? 'flex' : 'none',
                opacity: fadeAnim
              }]}
            >
              <TouchableOpacity 
                className="bg-white rounded-2xl overflow-hidden shadow-xl h-72"
                onPress={() => openPurchaseModal(prize)}
              >
                <Image
                  source={{ uri: prize.image }}
                  className="w-full h-36"
                  resizeMode="cover"
                />
                <View className="p-5">
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="font-bold text-xl text-gray-900">{prize.name}</Text>
                    <View className="bg-purple-100 px-2 py-1 rounded-full">
                      <Text className="text-purple-800 text-xs font-semibold">{prize.category}</Text>
                    </View>
                  </View>
                  <Text className="text-purple-600 font-semibold text-lg mb-3">{prize.value}</Text>
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <MaterialIcons name="confirmation-number" size={18} color="#9ca3af" />
                      <Text className="text-gray-500 ml-1">{prize.ticketsLeft} left</Text>
                    </View>
                    <View className="bg-purple-600 px-4 py-2 rounded-full">
                      <Text className="text-white font-bold">${prize.ticketPrice}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <View className="flex-row justify-center mt-3">
                {featuredPrizes.map((_, i) => (
                  <View 
                    key={i}
                    className={`w-2 h-2 rounded-full mx-1 ${i === activeFeaturedIndex ? 'bg-purple-600' : 'bg-gray-300'}`}
                  />
                ))}
              </View>
            </Animated.View>
          ))}
        </View>

        {/* All Prizes Grid */}
        <Text className="text-2xl font-bold mb-4 text-gray-800">Available Prizes</Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          {regularPrizes.map((prize) => (
            <TouchableOpacity
              key={prize.id}
              className="w-[48%] bg-white rounded-2xl overflow-hidden shadow-md mb-4"
              onPress={() => openPurchaseModal(prize)}
            >
              <Image
                source={{ uri: prize.image }}
                className="w-full h-36"
                resizeMode="cover"
              />
              <View className="p-3">
                <Text className="font-bold text-gray-900">{prize.name}</Text>
                <Text className="text-purple-600 text-sm font-semibold mb-2">{prize.value}</Text>
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <MaterialIcons name="confirmation-number" size={14} color="#9ca3af" />
                    <Text className="text-gray-500 text-xs ml-1">{prize.ticketsLeft}</Text>
                  </View>
                  <Text className="font-bold text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    ${prize.ticketPrice}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* How It Works Section */}
        <View className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
          <Text className="text-xl font-bold mb-4 text-gray-800">How It Works</Text>
          <View className="flex-row items-start mb-3">
            <View className="bg-purple-100 w-8 h-8 rounded-full items-center justify-center mr-3">
              <Text className="text-purple-800 font-bold">1</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-900">Choose a Prize</Text>
              <Text className="text-gray-500 text-sm">Browse our collection of luxury items</Text>
            </View>
          </View>
          <View className="flex-row items-start mb-3">
            <View className="bg-purple-100 w-8 h-8 rounded-full items-center justify-center mr-3">
              <Text className="text-purple-800 font-bold">2</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-900">Buy Tickets</Text>
              <Text className="text-gray-500 text-sm">Purchase tickets for your chance to win</Text>
            </View>
          </View>
          <View className="flex-row items-start">
            <View className="bg-purple-100 w-8 h-8 rounded-full items-center justify-center mr-3">
              <Text className="text-purple-800 font-bold">3</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-900">Win & Claim</Text>
              <Text className="text-gray-500 text-sm">If you win, we'll deliver your prize!</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Purchase Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 w-11/12">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900">Buy Tickets</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <MaterialIcons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            {selectedItem && (
              <>
                <View className="flex-row items-center mb-4">
                  <Image
                    source={{ uri: selectedItem.image }}
                    className="w-16 h-16 rounded-lg mr-3"
                    resizeMode="cover"
                  />
                  <View>
                    <Text className="font-bold text-gray-900">{selectedItem.name}</Text>
                    <Text className="text-purple-600 font-semibold">{selectedItem.value}</Text>
                    <Text className="text-gray-500 text-sm">${selectedItem.ticketPrice} per ticket</Text>
                  </View>
                </View>
                
                <View className="mb-6">
                  <Text className="text-gray-700 mb-2">Quantity</Text>
                  <View className="flex-row items-center justify-between border border-gray-200 rounded-lg p-2">
                    <TouchableOpacity 
                      className="bg-gray-100 p-2 rounded-lg"
                      onPress={() => setTicketQuantity(prev => Math.max(1, prev - 1))}
                    >
                      <MaterialIcons name="remove" size={20} color="#6b7280" />
                    </TouchableOpacity>
                    <Text className="font-bold text-lg mx-4">{ticketQuantity}</Text>
                    <TouchableOpacity 
                      className="bg-gray-100 p-2 rounded-lg"
                      onPress={() => setTicketQuantity(prev => prev + 1)}
                    >
                      <MaterialIcons name="add" size={20} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View className="flex-row justify-between items-center mb-6">
                  <Text className="text-gray-700">Total Cost</Text>
                  <Text className="font-bold text-lg text-purple-600">
                    ${selectedItem.ticketPrice * ticketQuantity}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  className="bg-purple-600 py-4 rounded-xl items-center"
                  onPress={handleBuyTickets}
                >
                  <Text className="text-white font-bold">Confirm Purchase</Text>
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