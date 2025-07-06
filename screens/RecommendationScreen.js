// ✅ RecommendationScreen.js
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView,
         SafeAreaView, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import Header from '../components/Header';
import axios from 'axios';
import useLocationStore from '../store/locationStore';
import useUserStore from '../store/userStore';
import TagPreferenceSection from '../components/TagPreferenceSection';
import RotatingLoader from '../components/LoadingIndicator'; // ✅ 로딩 인디케이터 컴포넌트
import { API_BASE_URL } from '../services/config'; // ✅ 주소 import

const regions = [
  '수정구', '중원구', '분당구',
  '신흥동', '태평동', '수진동', '산성동', '단대동',
  '금광동', '상대원동', '중앙동', '성남동', '하대원동',
  '정자동', '서현동', '이매동', '야탑동', '분당동',
  '구미동', '수내동', '금곡동', '정자1동', '판교동',
];

const RecommendationScreen = ({ navigation }) => {
  const [minPrice, setMinPrice] = useState('5000');
  const [maxPrice, setMaxPrice] = useState('20000');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);       // ✅ 추가

  const { globalLocation, globalDistrict, globalDistrictName } = useLocationStore();
  const { user } = useUserStore();
  const [tagScores, setTagScores] = useState(user?.tagScores || {});

  const handleSearch = async () => {
    if (parseInt(minPrice) > parseInt(maxPrice)) {
      Alert.alert('입력 오류', '가격 입력이 잘못되었습니다.');
      return;
    }

    const baseParams = {
      tagScores,
      minPrice: parseInt(minPrice),
      maxPrice: parseInt(maxPrice),
    };

    const params = useCurrentLocation
      ? { ...baseParams, lat: globalLocation?.latitude, lng: globalLocation?.longitude,
          region: globalDistrictName }
      : { ...baseParams, lat: globalLocation?.latitude, lng: globalLocation?.longitude,
          region: selectedRegion };

    try {
      setIsLoading(true);                                   // ✅ 시작
      const endpoint = API_BASE_URL + 'api/restaurant/recommended/location';
      const response = await axios.post(endpoint, params);

      navigation.navigate('RecommendedResultScreen', {
        restaurants: response.data,
        latitude: globalLocation?.latitude || null,
        longitude: globalLocation?.longitude || null,
        searchText: useCurrentLocation ? globalDistrict : selectedRegion,
      });
    } catch (error) {
      console.error('검색 오류:', error);
      Alert.alert('검색 오류', '검색 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);                                  // ✅ 종료
    }
  };

  return (
      <Container>
      <Header title="내돈내픽" canGoBack={false} />
      <KeyboardAvoidingView style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Title>음식점 추천</Title>

          <SectionTitle>가격대 설정</SectionTitle>
          <PriceInputRow>
            <PriceInput value={minPrice} keyboardType="numeric" onChangeText={(t) => setMinPrice(t.replace(/[^0-9]/g, ''))} placeholder="최소 가격" />
            <Wave>
              {'~'}
            </Wave>
            <PriceInput value={maxPrice} keyboardType="numeric" onChangeText={(t) => setMaxPrice(t.replace(/[^0-9]/g, ''))} placeholder="최대 가격" />
          </PriceInputRow>

          <SectionTitle>지역 선택</SectionTitle>
          <RegionTagRow>
            <CurrentLocationButton onPress={() => { setUseCurrentLocation(true); setSelectedRegion(''); }} selected={useCurrentLocation}>
              <TagText>📍 현재 위치로 검색하기</TagText>
            </CurrentLocationButton>

            {regions.map((region) => (
              <TagButton key={region} onPress={() => { setSelectedRegion(region); setUseCurrentLocation(false); }} selected={selectedRegion === region}>
                <TagText>{region}</TagText>
              </TagButton>
            ))}
          </RegionTagRow>
          <TagPreferenceSection tagScores={tagScores} setTagScores={setTagScores} />

          <SearchButton onPress={handleSearch}>
            <SearchButtonText>음식점 추천 검색</SearchButtonText>
          </SearchButton>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ✅ 로딩 오버레이 */}
      {isLoading && (
        <LoadingOverlay>
          <LoadingBox>
            <RotatingLoader />
          </LoadingBox>
        </LoadingOverlay>
      )}
    </Container>
  );
};

export default RecommendationScreen;

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
  margin-top: 24px;
  margin-bottom: 8px;
`;

const Description = styled.Text`
  font-size: 14px;
  color: #777;
  margin-bottom: 12px;
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

const SearchButton = styled.TouchableOpacity`
  margin-top: 32px;
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

// ✅ 로딩 오버레이 컴포넌트들 추가

const LoadingOverlay = styled.View`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  justify-content: center;
  align-items: center;
`;

const LoadingBox = styled.View`
  width: 80%;
  max-width: 280px;
  padding: 24px 20px;
  background-color: #fff;
  border-radius: 20px;
  elevation: 4;
  shadow-opacity: 0.15;
  shadow-radius: 10px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  align-items: center;
`;

const LoadingText = styled.Text`
  margin-top: 16px;
  text-align: center;
  font-size: 15px;
  line-height: 22px;
  color: #333;
`;