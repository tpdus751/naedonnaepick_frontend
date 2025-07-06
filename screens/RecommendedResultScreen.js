// screens/RecommendedResultScreen.js
import React from 'react';
import { View, FlatList, Text, ActivityIndicator, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native'

const screenWidth = Dimensions.get('window').width;
const CARD_MARGIN = 12;
const CARD_HORIZONTAL_PADDING = 16;
const cardWidth = (screenWidth - CARD_HORIZONTAL_PADDING * 2 - CARD_MARGIN) / 2;

export default function RecommendedResultScreen({ route }) {
  const { restaurants, searchText } = route.params;
  const navigation = useNavigation();

  if (!restaurants) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#007AFF" />
        <LoadingText>추천 결과를 불러오는 중...</LoadingText>
      </LoadingContainer>
    );
  }

  console.log("🍽️ 추천 결과:", restaurants);

  const renderItem = ({ item }) => {
    if (!item.restaurant) return null;

    const distance = item.distance;
    const formattedDistance =
      distance >= 1000
        ? `${(distance / 1000).toFixed(1)}km`
        : `${Math.round(distance)}m`;

    return (
      <TouchableCard onPress={() =>
        navigation.navigate('RestaurantDetailScreen', {
          restaurant: item.restaurant
        })
      }>
        <Title numberOfLines={1}>{item.restaurant.name}</Title>
        <SubText numberOfLines={2}>{item.restaurant.address}</SubText>
        <DetailBlock>
          <DistanceText>📍 거리: {formattedDistance}</DistanceText>
          <ProbabilityText>🎯 추천 확률: {(item.probability * 100).toFixed(1)}%</ProbabilityText>
        </DetailBlock>
      </TouchableCard>
    );
  };

  return (
    <Container>
      <Header title={`${String(searchText ?? '')} 추천 결과`} canGoBack={true} />
      {restaurants.length === 0 ? (
        <EmptyText>추천 결과가 없습니다.</EmptyText>
      ) : (
        <FlatList
          data={restaurants}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item?.restaurant?.restaurantNo?.toString() ?? `fallback-${index}`
            }
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 60 }}
        />
      )}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled.Text`
  margin-top: 12px;
  font-size: 16px;
  color: #555;
`;

const Card = styled.View`
  width: ${cardWidth}px;
  min-height: 160px;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 18px;
  elevation: 4;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
  justify-content: space-between;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #1c1c1e;
  margin-bottom: 6px;
`;

const SubText = styled.Text`
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
  line-height: 18px;
`;

const DetailBlock = styled.View`
  margin-top: auto;
`;

const DistanceText = styled.Text`
  font-size: 13px;
  color: #444;
  margin-bottom: 4px;
`;

const ProbabilityText = styled.Text`
  font-size: 13px;
  color: #007AFF;
  font-weight: 600;
`;

const EmptyText = styled.Text`
  margin-top: 20px;
  text-align: center;
  color: #666;
  font-size: 16px;
`;

const TouchableCard = styled.TouchableOpacity`
  width: ${cardWidth}px;
  min-height: 160px;
  background-color: #ffffff;
  border-radius: 20px;
  padding: 16px;
  margin-bottom: 18px;
  elevation: 4;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
  justify-content: space-between;
`;
