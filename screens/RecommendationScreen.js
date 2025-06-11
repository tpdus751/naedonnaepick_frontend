import React, { useState } from 'react';
import { Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import Header from '../components/Header';
import axios from 'axios';
import useLocationStore from '../store/locationStore';

const regions = [
  '수정구', '중원구', '분당구',
  '신흥동', '태평동', '수진동', '산성동', '단대동',
  '금광동', '상대원동', '중앙동', '성남동', '하대원동',
  '정자동', '서현동', '이매동', '야탑동', '분당동',
  '구미동', '수내동', '금곡동', '정자1동', '판교동'
];

const RecommendationScreen = ({ navigation }) => {
  const [minPrice, setMinPrice] = useState('5000');
  const [maxPrice, setMaxPrice] = useState('20000');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const { globalLocation, globalDistrict } = useLocationStore();

  const handleSearch = async () => {
  if (parseInt(minPrice) > parseInt(maxPrice)) {
    Alert.alert('입력 오류', '가격 입력이 잘못되었습니다.');
    return;
  }

  try {
    const params = {
      location: useCurrentLocation
        ? globalDistrict?.replace('성남시 ', '')?.split(' ')?.[1] || ''
        : selectedRegion,
      minPrice: parseInt(minPrice),
      maxPrice: parseInt(maxPrice),
    };

    if (useCurrentLocation) {
      if (globalLocation?.latitude && globalLocation?.longitude) {
        params.lat = globalLocation.latitude;
        params.lng = globalLocation.longitude;
      } else {
        Alert.alert('위치 오류', '현재 위치 정보를 가져올 수 없습니다.');
        return;
      }
    }

    console.log('[RecommendationScreen] 요청 파라미터:');
    console.log('location:', params.location);
    console.log('minPrice:', params.minPrice);
    console.log('maxPrice:', params.maxPrice);
    console.log('lat:', params.lat);
    console.log('lng:', params.lng);

    const response = await axios.get('http://172.31.57.17:8080/api/restaurant/recommended', { params });
    const filteredRestaurants = response.data;

    if (filteredRestaurants.length === 0) {
      Alert.alert('검색 결과가 없습니다.');
    } else {
      navigation.navigate('SearchResultScreen', {
        restaurants: filteredRestaurants,
        latitude: globalLocation?.latitude || null,
        longitude: globalLocation?.longitude || null,
        searchText: useCurrentLocation
          ? globalDistrict?.replace('성남시 ', '')?.split(' ')?.[1] || ''
          : selectedRegion,
        isTag: false,
      });
    }
  } catch (error) {
    console.error('검색 오류:', error);
    Alert.alert('검색 오류', '검색 중 문제가 발생했습니다.');
  }
};

  return (
    <Container>
      <Header title="내돈내픽" canGoBack={false} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Title>음식점 추천</Title>

          <SectionTitle>가격대 설정</SectionTitle>
          <PriceInputRow>
            <PriceInput
              keyboardType="numeric"
              value={minPrice}
              placeholder="최소"
              onChangeText={(text) => setMinPrice(text.replace(/[^0-9]/g, ''))}
            />
            <Wave>~</Wave>
            <PriceInput
              keyboardType="numeric"
              value={maxPrice}
              placeholder="최대"
              onChangeText={(text) => setMaxPrice(text.replace(/[^0-9]/g, ''))}
            />
          </PriceInputRow>
          {parseInt(maxPrice) < parseInt(minPrice) && (
            <WarningText>최대 가격은 최소 가격보다 커야 합니다.</WarningText>
          )}

          <SectionTitle>지역 선택</SectionTitle>
          <RegionTagRow>
            <CurrentLocationButton onPress={() => {
              setUseCurrentLocation(true);
              setSelectedRegion('');
            }} selected={useCurrentLocation}>
              <TagText>📍 현재 위치로 검색하기</TagText>
            </CurrentLocationButton>

            {regions.map(region => (
              <TagButton
                key={region}
                onPress={() => {
                  setSelectedRegion(region);
                  setUseCurrentLocation(false);
                }}
                selected={selectedRegion === region}
              >
                <TagText>{region}</TagText>
              </TagButton>
            ))}
          </RegionTagRow>

          {useCurrentLocation && globalDistrict && (
            <SelectedText>📍 선택된 위치: {globalDistrict}</SelectedText>
          )}
          {selectedRegion && !useCurrentLocation && (
            <SelectedText>📍 선택된 지역: {selectedRegion}</SelectedText>
          )}

          <SearchButton onPress={handleSearch}>
            <SearchButtonText>음식점 추천 검색</SearchButtonText>
          </SearchButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default RecommendationScreen;

// ================= 스타일 =================

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const PriceInputRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const PriceInput = styled.TextInput`
  flex: 1;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 8px;
  padding: 10px;
  font-size: 16px;
  text-align: center;
  margin: 0 5px;
`;

const Wave = styled.Text`
  font-size: 20px;
  color: #666;
`;

const WarningText = styled.Text`
  color: red;
  font-size: 13px;
  margin-bottom: 10px;
`;

const RegionTagRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
  justify-content: center;
`;

const TagButton = styled.TouchableOpacity`
  background-color: ${(props) => (props.selected ? '#007AFF' : '#eee')};
  padding: 8px 12px;
  border-radius: 20px;
  margin: 4px;
`;

const CurrentLocationButton = styled(TagButton)`
  background-color: ${(props) => (props.selected ? '#34C759' : '#eee')};
`;

const TagText = styled.Text`
  font-size: 14px;
  color: #333;
`;

const SelectedText = styled.Text`
  margin-top: 10px;
  text-align: center;
  font-size: 15px;
  color: #555;
`;

const SearchButton = styled.TouchableOpacity`
  margin-top: 24px;
  background-color: #007AFF;
  padding: 14px;
  border-radius: 12px;
  align-items: center;
`;

const SearchButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;
