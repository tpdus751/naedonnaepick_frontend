// SearchResultScreen.js
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

export default function SearchResultScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    searchText = '',
    isTag = false,
    latitude = 0.0,
    longitude = 0.0,
  } = route.params ?? {};

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    fetchSearchResults(true);
  }, [searchText]);

  const fetchSearchResults = async (initial = false) => {
    if (initial) {
      setLoading(true);
      setPage(0);
      setIsEnd(false);
    }
    try {
      const url = isTag
        ? `http://192.168.25.6:8080/api/restaurant/search/tag?tag=${searchText}&lat=${latitude}&lng=${longitude}&page=${initial ? 0 : page}&size=10`
        : `http://192.168.25.6:8080/api/restaurant/search/keyword?keyword=${searchText}&lat=${latitude}&lng=${longitude}&page=${initial ? 0 : page}&size=10`;

      const res = await fetch(url);
      const data = await res.json();

      if (initial) {
        setRestaurants(data);
      } else {
        setRestaurants((prev) => [...prev, ...data]);
      }

      if (data.length < 10) setIsEnd(true);
    } catch (err) {
      console.error('🔍 검색 오류:', err);
      Alert.alert('오류', '검색 결과를 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSearchResults(true);
  };

  const handleLoadMore = () => {
    if (!isEnd && !loading) {
      setPage((prev) => prev + 1);
      fetchSearchResults();
    }
  };

  const renderItem = ({ item }) => (
    <Card onPress={() => navigation.navigate('RestaurantDetailScreen', { restaurant: item })}>
      <Name>{item.name}</Name>
      <Address>{item.address}</Address>
    </Card>
  );

  return (
    <Container>
      <Header
        title={isTag ? `${searchText} 근처 음식점` : `"${searchText}" 검색결과`}
        canGoBack
        onBackPress={() => navigation.goBack()}
      />

      {loading && page === 0 ? (
        <ActivityIndicator size="large" style={{ marginTop: 30 }} color="#007AFF" />
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.restaurantNo.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
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