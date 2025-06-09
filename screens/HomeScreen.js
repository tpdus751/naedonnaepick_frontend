// screens/HomeScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import TagList from '../components/TagList';
import RestaurantCard from '../components/RestaurantCard';
import { getDistrictName } from '../utils/locationUtils';

export default function HomeScreen() {
  const navigation = useNavigation();

  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 📍 위치 가져오기
  const fetchLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('위치 권한 거부됨', '앱 사용을 위해 위치 권한이 필요합니다.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      const [addr] = await Location.reverseGeocodeAsync(loc.coords);
      const district = getDistrictName(addr);
      setAddress(district);
    } catch (error) {
      console.error('위치 정보 오류:', error);
      Alert.alert('오류', '위치 정보를 가져오는 중 문제가 발생했습니다.');
    }
  }, []);

  // 🍽️ 음식점 가져오기
  const fetchNearbyRestaurants = useCallback(async () => {
    if (!location) return;

    try {
      const res = await fetch(
        `http://192.168.25.6:8080/api/restaurant/nearby?lat=${location.latitude}&lng=${location.longitude}`
      );
      const data = await res.json();
      setRestaurants(data);
    } catch (err) {
      console.error('🍽️ 가까운 음식점 가져오기 오류:', err);
      Alert.alert('오류', '음식점을 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [location]);

  // 🔁 새로고침
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLocation();
    await fetchNearbyRestaurants();
  };

  useEffect(() => {
    (async () => {
      await fetchLocation();
    })();
  }, []);

  useEffect(() => {
    if (location) {
      fetchNearbyRestaurants();
    }
  }, [location]);

  // 태그 클릭 시
  const handleTagPress = (tag) => {
    if (!location) return;
    navigation.navigate('SearchResultScreen', {
      searchText: tag,
      isTag: true,
      lat: location.latitude,
      lng: location.longitude,
      district: address,
    });
  };

  const renderItem = ({ item }) => (
    <RestaurantCard restaurant={item} onPress={() => navigation.navigate('RestaurantDetailScreen', { restaurant: item })} />
  );

  return (
    <Container>
      <Header title="내돈내픽 🍽️" />
      <LocationText>{address && `${address} 근처 맛집`}</LocationText>
      <TagList onTagPress={handleTagPress} />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} color="#007AFF" />
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.restaurantNo.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const LocationText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  margin: 12px 20px 4px;
  color: #333;
`;
