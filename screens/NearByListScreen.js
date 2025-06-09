// NearbyListScreen.js
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

export default function NearbyListScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { latitude, longitude } = route.params;

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // ✅ 새로고침 상태

  useEffect(() => {
    fetchNearbyRestaurants();
  }, []);

  const fetchNearbyRestaurants = async () => {
    try {
      const res = await fetch(
        `http://192.168.25.6:8080/api/restaurant/nearby?lat=${latitude}&lng=${longitude}`
      );
      const data = await res.json();
      setRestaurants(data);
    } catch (err) {
      console.error('🍽️ 전체 거리 리스트 오류:', err);
      Alert.alert('오류', '전체 음식점을 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
      setRefreshing(false); // ✅ 새로고침 종료
    }
  };

  // ✅ 아래로 당겼을 때
  const handleRefresh = () => {
    setRefreshing(true);
    fetchNearbyRestaurants();
  };

  const renderItem = ({ item }) => (
    <Card onPress={() => navigation.navigate('RestaurantDetailScreen', { restaurant: item })}>
      <Name>{item.name}</Name>
      <Address>{item.address}</Address>
      <Distance>거리: {item.distance?.toFixed(1)}km</Distance>
    </Card>
  );

  return (
    <Container>
      <Header title="내 주변 음식점" canGoBack onBackPress={() => navigation.goBack()} />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 30 }} color="#007AFF" />
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.restaurantNo.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
          onRefresh={handleRefresh}      // ✅ 새로고침 이벤트 등록
          refreshing={refreshing}        // ✅ 새로고침 상태 연동
        />
      )}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const Card = styled.TouchableOpacity`
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 10px;
  background-color: #f9f9f9;
  elevation: 2;
`;

const Name = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const Address = styled.Text`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
`;

const Distance = styled.Text`
  font-size: 13px;
  color: #999;
  margin-top: 4px;
`;
