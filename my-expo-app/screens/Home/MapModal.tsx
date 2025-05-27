import React, { useEffect, useState, useRef } from 'react';
import { Modal, View, Text, Pressable, Alert, StyleSheet, Platform, Linking } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';

interface MapModalProps {
  modalVisible: boolean;
  onClose: () => void;
  longitude: string;
  latitude: string;
  address?: string;
}

interface RouteCoordinates {
  latitude: number;
  longitude: number;
}

interface RouteOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const MapModal = ({ modalVisible, onClose, longitude, latitude, address }: MapModalProps) => {
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<RouteCoordinates[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [selectedRouteType, setSelectedRouteType] = useState('driving');
  const [isMapInteractive, setIsMapInteractive] = useState(true);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid' | 'terrain'>('standard');

  const routeOptions: RouteOption[] = [
    { id: 'driving', name: 'Drive', icon: 'car', color: '#3b82f6' },
    { id: 'walking', name: 'Walk', icon: 'walking', color: '#10b981' },
    { id: 'cycling', name: 'Bike', icon: 'bicycle', color: '#ef4444' },
    { id: 'transit', name: 'Transit', icon: 'bus', color: '#8b5cf6' },
  ];

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const fetchRoute = async (start: { latitude: number; longitude: number }, end: { latitude: number; longitude: number }) => {
    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/${selectedRouteType}/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`
      );
      
      if (response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const coordinates = route.geometry.coordinates.map((coord: [number, number]) => ({
          longitude: coord[0],
          latitude: coord[1],
        }));
        
        setRouteCoordinates(coordinates);
        setDistance(route.distance / 1000); // Convert to km
        setDuration(formatDuration(route.duration));
        
        // Fit the map to show the entire route
        if (mapRef.current && coordinates.length > 0) {
          setTimeout(() => {
            mapRef.current?.fitToCoordinates(coordinates, {
              edgePadding: { top: 150, right: 50, bottom: 200, left: 50 },
              animated: true,
            });
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      Alert.alert('Error', 'Could not calculate the route');
    }
  };

  const handleShowRoute = async () => {
    if (!locationPermissionGranted) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need your location to show the route and distance',
          [{ text: 'OK' }]
        );
        return;
      }
      setLocationPermissionGranted(true);
    }

    if (userLocation) {
      setShowRoute(true);
      fetchRoute(userLocation, { latitude: lat, longitude: lon });
    }
  };

  const handleNavigation = () => {
    if (!userLocation) return;
    
    const url = Platform.select({
      ios: `maps://app?saddr=${userLocation.latitude},${userLocation.longitude}&daddr=${lat},${lon}&dirflg=${selectedRouteType === 'driving' ? 'd' : selectedRouteType === 'walking' ? 'w' : 'r'}`,
      android: `google.navigation:q=${lat},${lon}&mode=${selectedRouteType}`,
    });

    Linking.canOpenURL(url!).then(supported => {
      if (supported) {
        Linking.openURL(url!);
      } else {
        Alert.alert('Error', 'Could not open navigation app');
      }
    });
  };

  const handleRouteTypeChange = (type: string) => {
    setSelectedRouteType(type);
    if (showRoute && userLocation) {
      fetchRoute(userLocation, { latitude: lat, longitude: lon });
    }
  };

  const toggleMapType = () => {
    setMapType(prev => {
      if (prev === 'standard') return 'satellite';
      if (prev === 'satellite') return 'hybrid';
      if (prev === 'hybrid') return 'terrain';
      return 'standard';
    });
  };

  useEffect(() => {
    const fetchUserLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermissionGranted(true);
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        // Fit map to show both locations when modal opens
        if (mapRef.current) {
          setTimeout(() => {
            mapRef.current?.fitToCoordinates(
              [
                { latitude: location.coords.latitude, longitude: location.coords.longitude },
                { latitude: lat, longitude: lon }
              ],
              {
                edgePadding: { top: 150, right: 50, bottom: 200, left: 50 },
                animated: true,
              }
            );
          }, 500);
        }
      }
    };

    if (modalVisible) {
      fetchUserLocation();
      setShowRoute(false);
      setRouteCoordinates([]);
      setDistance(null);
      setDuration(null);
    }
  }, [modalVisible]);

  const handleMapReady = () => {
    setMapReady(true);
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsBuildings={true}
          showsTraffic={selectedRouteType === 'driving'}
          showsIndoors={true}
          mapType={mapType}
          onMapReady={handleMapReady}
          loadingEnabled={!mapReady}
          loadingIndicatorColor="#666666"
          loadingBackgroundColor="#f8f8f8"
          scrollEnabled={isMapInteractive}
          zoomEnabled={isMapInteractive}
          rotateEnabled={isMapInteractive}
          pitchEnabled={isMapInteractive}
        >
          <Marker
            coordinate={{ latitude: lat, longitude: lon }}
            title={address || "Selected Location"}
            description={`Lat: ${lat.toFixed(6)}, Lon: ${lon.toFixed(6)}`}
            pinColor="red"
          />
          {userLocation && (
            <Marker
              coordinate={userLocation}
              title="Your Location"
              pinColor="blue"
              description={`Lat: ${userLocation.latitude.toFixed(6)}, Lon: ${userLocation.longitude.toFixed(6)}`}
            />
          )}
          {showRoute && routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor={routeOptions.find(o => o.id === selectedRouteType)?.color || '#3b82f6'}
              strokeWidth={5}
            />
          )}
        </MapView>

        {/* Header with back button and title */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text style={styles.headerText} numberOfLines={1} ellipsizeMode="tail">
            {address || "Location Details"}
          </Text>
        </View>

        {/* Map controls */}
        <View style={styles.mapControls}>
          <Pressable 
            style={styles.mapControlButton}
            onPress={toggleMapType}
          >
            <MaterialIcons name="layers" size={24} color="#3b82f6" />
          </Pressable>
          <Pressable 
            style={styles.mapControlButton}
            onPress={() => setIsMapInteractive(!isMapInteractive)}
          >
            <MaterialIcons 
              name={isMapInteractive ? 'touch-app' : 'do-not-touch'} 
              size={24} 
              color="#3b82f6" 
            />
          </Pressable>
          {userLocation && (
            <Pressable 
              style={styles.mapControlButton}
              onPress={() => {
                mapRef.current?.animateToRegion({
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }, 500);
              }}
            >
              <MaterialIcons name="my-location" size={24} color="#3b82f6" />
            </Pressable>
          )}
        </View>

        {/* Route options */}
        {showRoute && (
          <View style={styles.routeOptionsContainer}>
            {routeOptions.map(option => (
              <Pressable
                key={option.id}
                style={[
                  styles.routeOptionButton,
                  { 
                    backgroundColor: selectedRouteType === option.id ? option.color : 'white',
                    borderColor: option.color,
                  }
                ]}
                onPress={() => handleRouteTypeChange(option.id)}
              >
                <FontAwesome5 
                  name={option.icon} 
                  size={16} 
                  color={selectedRouteType === option.id ? 'white' : option.color} 
                />
                <Text style={[
                  styles.routeOptionText,
                  { color: selectedRouteType === option.id ? 'white' : option.color }
                ]}>
                  {option.name}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Bottom info panel */}
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialIcons name="place" size={20} color="#ef4444" />
              <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
                {address || `Selected: ${lat.toFixed(6)}, ${lon.toFixed(6)}`}
              </Text>
            </View>
            
            {userLocation && (
              <>
                <View style={styles.infoRow}>
                  <MaterialIcons name="person-pin-circle" size={20} color="#3b82f6" />
                  <Text style={styles.infoText}>
                    Your location
                  </Text>
                </View>
                {distance && duration && (
                  <View style={styles.infoRow}>
                    <MaterialIcons 
                      name={selectedRouteType === 'driving' ? 'directions-car' : 
                            selectedRouteType === 'walking' ? 'directions-walk' : 
                            selectedRouteType === 'cycling' ? 'directions-bike' : 'directions-bus'} 
                      size={20} 
                      color={routeOptions.find(o => o.id === selectedRouteType)?.color || '#10b981'} 
                    />
                    <Text style={styles.infoText}>
                      {distance.toFixed(2)} km ({duration})
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>

          <View style={styles.buttonRow}>
            {userLocation && (
              <>
                <Pressable
                  style={[styles.actionButton, styles.routeButton]}
                  onPress={handleShowRoute}
                  android_ripple={{ color: '#d1d5db' }}
                >
                  <MaterialIcons 
                    name={showRoute ? 'refresh' : 'directions'} 
                    size={20} 
                    color="white" 
                  />
                  <Text style={styles.actionButtonText}>
                    {showRoute ? 'Update' : 'Directions'}
                  </Text>
                </Pressable>
                {showRoute && (
                  <Pressable
                    style={[styles.actionButton, styles.navigateButton]}
                    onPress={handleNavigation}
                    android_ripple={{ color: '#d1d5db' }}
                  >
                    <MaterialIcons name="navigation" size={20} color="white" />
                    <Text style={styles.actionButtonText}>Start</Text>
                  </Pressable>
                )}
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 60,
  },
  closeButton: {
    position: 'absolute',
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  mapControls: {
    position: 'absolute',
    top: 110,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  mapControlButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeOptionsContainer: {
    position: 'absolute',
    top: 110,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  routeOptionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  routeOptionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    marginHorizontal: 4,
  },
  routeButton: {
    backgroundColor: '#3b82f6',
  },
  navigateButton: {
    backgroundColor: '#10b981',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default MapModal;