import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Alert, RefreshControl, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { API_BASE_URL } from '../services/config'; // ✅ 주소 import

const windowWidth = Dimensions.get('window').width;
const OUTER_MARGIN = 16;      // 화면 양쪽 여백
const BETWEEN_MARGIN = 12;    // 카드 사이 간격
const CARD_WIDTH = (windowWidth - OUTER_MARGIN * 2 - BETWEEN_MARGIN) / 2;
const CARD_HEIGHT = 160;      // 고정 높이

export default function NearbyListScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { latitude, longitude } = route.params;

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    setRestaurants([]);
    setPage(0);
    setIsEnd(false);
    fetchNearbyRestaurants();
  }, []);

  useEffect(() => {
    if (page > 0 && !loading && !isEnd) {
      fetchNearbyRestaurants();
    }
  }, [page, isEnd]);

  const fetchNearbyRestaurants = async () => {
    if (isEnd) return;
    setLoading(true);

    try {
      const res = await fetch(
        API_BASE_URL + `api/restaurant/nearby?lat=${latitude}&lng=${longitude}&page=${page}&size=10`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.content && data.content.length > 0) {
        setRestaurants((prev) => {
          const newItems = data.content.filter(
            (newItem) => !prev.some((existingItem) => existingItem.restaurantNo === newItem.restaurantNo)
          );
          return [...prev, ...newItems];
        });
        if (data.last) {
          setIsEnd(true);
        }
      } else {
        setIsEnd(true);
      }
    } catch (err) {
      console.error('🍽️ 가까운 음식점 가져오기 오류:', err);
      Alert.alert('오류', '가까운 음식점을 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setRestaurants([]);
    setPage(0);
    setIsEnd(false);
  };

  const handleEndReached = () => {
    if (!loading && !isEnd) {
      setPage((prev) => prev + 1);
    }
  };

  const renderItem = ({ item }) => (
  <Card onPress={() => navigation.navigate('RestaurantDetailScreen', { restaurant: item })}>
    <CardContent>
      <CardTitle>{item.name}</CardTitle>
      <CardAddress>{item.address}</CardAddress>
      <CardDistance>
        거리: {
          item.distance == null || item.distance >= 999999999999
            ? '정보 없음'
            : item.distance >= 1000
              ? `${(item.distance / 1000).toFixed(1)}km`
              : `${Math.round(item.distance)}m`
        }
      </CardDistance>
    </CardContent>
  </Card>
);


  return (
    <Container>
      <Header title="내 주변 음식점" canGoBack onBackPress={() => navigation.goBack()} />

      {loading && restaurants.length === 0 ? (
        <Loader>
          <ActivityIndicator size="large" color="#007AFF" />
        </Loader>
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.restaurantNo.toString()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
          contentContainerStyle={{ paddingHorizontal: OUTER_MARGIN, paddingTop: 12 }}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.8}
          ListEmptyComponent={
            !loading && restaurants.length === 0 ? (
              <EmptyText>주변에 검색된 음식점이 없습니다.</EmptyText>
            ) : null
          }
          ListFooterComponent={
            loading && restaurants.length > 0 && !isEnd ? (
              <ActivityIndicator size="small" style={{ marginVertical: 20 }} color="#007AFF" />
            ) : null
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

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Card = styled.TouchableOpacity`
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT}px;
  background-color: #f9f9f9;
  border-radius: 12px;
  elevation: 2;
  padding: 12px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const CardContent = styled.View`
  flex: 1;
  justify-content: space-between;
`;

const CardTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const CardAddress = styled.Text`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`;

const CardDistance = styled.Text`
  font-size: 12px;
  color: #888;
  align-self: flex-end;
`;

const EmptyText = styled.Text`
  text-align: center;
  margin-top: 32px;
  font-size: 16px;
  color: #888;
`;
