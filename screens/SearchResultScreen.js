import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, Alert, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

const screenWidth = Dimensions.get('window').width;
const CARD_MARGIN = 12;
const CARD_HORIZONTAL_PADDING = 16;
const cardWidth = (screenWidth - CARD_HORIZONTAL_PADDING * 2 - CARD_MARGIN) / 2;
const cardHeight = 160;

export default function SearchResultScreen() {
  const route = useRoute();
  const { searchText, isTag, latitude, longitude, district, restaurants: routeRestaurants } = route.params;
  const navigation = useNavigation();

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  

 useEffect(() => {
  if (routeRestaurants) {
    setRestaurants(routeRestaurants);
    setLoading(false);
    setIsEnd(true); // 페이지네이션 X
  } else {
    fetchRestaurants();
  }
}, [page]);

  const fetchRestaurants = async () => {
    if (isEnd) return;

    try {
      const endpoint = isTag
        ? `/api/restaurant/tag?tag=${searchText}&district=${district}&lat=${latitude}&lng=${longitude}&page=${page}&size=10`
        : `/api/restaurant/general?keyword=${searchText}&lat=${latitude}&lng=${longitude}&page=${page}&size=10`;

      const res = await fetch(`http:/192.168.40.14:8080${endpoint}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (!data.content || data.content.length === 0) {
        setIsEnd(true);
      } else {
        setRestaurants((prev) => {
          const newItems = data.content.filter(
            (newItem) => !prev.some((existing) => existing.restaurantNo === newItem.restaurantNo)
          );
          return [...prev, ...newItems];
        });
      }
    } catch (err) {
      console.error('검색 오류:', err);
      Alert.alert('오류', '음식점 데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
  <Card onPress={() => navigation.navigate('RestaurantDetailScreen', { restaurant: item })}>
    <CardContent>
      <CardTitle>{item.name}</CardTitle>
      <CardSub>{item.address}</CardSub>
      <CardDistance>
        거리:{' '}
        {item.distance == null || item.distance >= 999999999999
          ? '정보 없음'
          : item.distance >= 1000
            ? `${(item.distance / 1000).toFixed(1)}km`
            : `${Math.round(item.distance)}m`}
      </CardDistance>
    </CardContent>
  </Card>
);


  const handleEndReached = () => {
    if (!loading && !isEnd) {
      setLoading(true);
      setPage((prev) => prev + 1);
    }
  };

  const getScreenTitle = () => {
    return isTag ? `태그: ${searchText}` : `검색: ${searchText}`;
  };

  return (
    <Container>
      <Header title={getScreenTitle()} canGoBack onBackPress={() => navigation.goBack()} />

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.restaurantNo.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          paddingHorizontal: CARD_HORIZONTAL_PADDING,
        }}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.8}
        ListFooterComponent={
          loading && !isEnd ? (
            <ActivityIndicator size="small" style={{ marginVertical: 20 }} color="#007AFF" />
          ) : null
        }
        ListEmptyComponent={
          !loading && restaurants.length === 0 ? (
            <EmptyText>"{searchText}"(으)로 검색된 결과가 없습니다.</EmptyText>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const Card = styled.TouchableOpacity`
  width: ${cardWidth}px;
  height: ${cardHeight}px;
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
  elevation: 3;
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

const CardSub = styled.Text`
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
