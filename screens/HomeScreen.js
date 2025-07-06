import React, { useEffect, useState } from 'react';
import { FlatList, Alert, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

import Header from '../components/Header';
import SideMenuDrawer from '../components/SideMenuDrawer';
import TagList from '../components/TagList';
import RestaurantSearchBar from '../components/RestaurantSearchBar';
import useLocationStore from '../store/locationStore';
import { API_BASE_URL } from '../services/config';
import { getRegionFromKakao } from '../utils/kakaoGeo';

const screenWidth = Dimensions.get('window').width;
const CARD_MARGIN = 12;
const CARD_HORIZONTAL_PADDING = 16;
const cardWidth = (screenWidth - CARD_HORIZONTAL_PADDING * 2 - CARD_MARGIN) / 2;
const cardHeight = 140;

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [district, setDistrict] = useState('');
  const [regionForSearch, setRegionForSearch] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);

  const navigation = useNavigation();
  const { setGlobalLocation, setGlobalDistrict, setGlobalDistrictName } = useLocationStore();

  useEffect(() => {
    fetchLocationAndData();
  }, []);

  const fetchLocationAndData = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('위치 권한이 필요합니다', '앱을 사용하려면 위치 권한을 허용해주세요.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(loc.coords);
      setGlobalLocation(loc.coords);

      const addr = await Location.reverseGeocodeAsync(loc.coords);
      console.log('📍 주소 정보:', addr);

      const { dongName, roadAddress } = await getRegionFromKakao(loc.coords.latitude, loc.coords.longitude);
      console.log('🏷️ Kakao 행정동:', dongName);
      console.log('📍 Kakao 도로명주소:', roadAddress);

      setDistrict(roadAddress || ''); // 현재 위치 표시용
      setRegionForSearch(dongName || ''); // 검색용 행정동
      setGlobalDistrictName(dongName || '');
      setGlobalDistrict(`${addr[0]?.city || ''} ${addr[0]?.district || ''} ${dongName || ''}`);

      fetchRestaurants(loc.coords);
    } catch (err) {
      console.error('📍 위치 또는 음식점 로드 실패:', err);
      Alert.alert('오류', '위치 또는 음식점 데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchRestaurants = async ({ latitude, longitude }) => {
    try {
      const res = await fetch(
        API_BASE_URL + `api/restaurant/nearby?lat=${latitude}&lng=${longitude}&page=0&size=4`
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setRestaurants(data.content ? data.content.slice(0, 4) : []);
    } catch (err) {
      console.error('🍽️ 가까운 음식점 가져오기 오류:', err);
    }
  };

  const handleTagPress = (tag) => {
    navigation.navigate('SearchResultScreen', {
      searchText: tag,
      isTag: true,
      latitude: location?.latitude,
      longitude: location?.longitude,
      district: regionForSearch,
    });
  };

  const handleMore = () => {
    navigation.navigate('NearbyListScreen', {
      latitude: location?.latitude,
      longitude: location?.longitude,
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLocationAndData();
  };

  const renderRestaurant = ({ item }) => (
    <Card onPress={() => navigation.navigate('RestaurantDetailScreen', { restaurant: item })}>
      <CardContent>
        <CardTitle>{item.name}</CardTitle>
        <CardSub>{item.address}</CardSub>
        <CardDistance>
          거리:{' '}
          {item.distance == null || item.distance >= 999999999999
            ? '정보 없음'
            : `${Math.round(item.distance)}m`}
        </CardDistance>
      </CardContent>
    </Card>
  );

  return (
    <Container>
      <Header
        title="내돈내픽"
        canGoBack={false}
        onMenuPress={() => setMenuVisible(true)}
      />
      <SideMenuDrawer
        isVisible={isMenuVisible}
        onClose={() => setMenuVisible(false)}
        onLoginPress={() => navigation.navigate('LoginMain')}
      />

      <FlatList
        ListHeaderComponent={
          <>
            <LocationBox>
              <LocationLabel>📍 현재 위치 :</LocationLabel>
              <LocationText>{district || '위치 불러오는 중...'}</LocationText>
            </LocationBox>

            <RestaurantSearchBar
              onSearch={(text) =>
                navigation.navigate('SearchResultScreen', {
                  searchText: text,
                  isTag: false,
                  latitude: location?.latitude,
                  longitude: location?.longitude,
                })
              }
            />

            <SectionTitle>{regionForSearch ? `${regionForSearch} 추천 태그` : '추천 태그'}</SectionTitle>
            <TagList onTagPress={handleTagPress} />

            <SectionTitle>
              <HighlightText>{regionForSearch}</HighlightText> 가까운 음식점
            </SectionTitle>
          </>
        }
        data={restaurants}
        keyExtractor={(item) => item.restaurantNo.toString()}
        renderItem={renderRestaurant}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          paddingHorizontal: CARD_HORIZONTAL_PADDING,
        }}
        ListFooterComponent={
          restaurants.length > 0 && (
            <MoreButton onPress={handleMore}>
              <MoreText>더보기</MoreText>
            </MoreButton>
          )
        }
      />

      {loading && (
        <LoadingWrapper>
          <ActivityIndicator size="large" color="#007AFF" />
        </LoadingWrapper>
      )}
    </Container>
  );
}

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const LocationBox = styled.View`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

const LocationLabel = styled.Text`
  font-size: 16px;
  color: #444;
  font-weight: bold;
  margin-right: 6px;
`;

const LocationText = styled.Text`
  font-size: 16px;
  color: #007AFF;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin: 20px 16px 10px;
`;

const Card = styled.TouchableOpacity`
  width: ${cardWidth}px;
  height: ${cardHeight}px;
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
  elevation: 2;
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

const MoreButton = styled.TouchableOpacity`
  padding: 14px;
  align-items: center;
  justify-content: center;
  background-color: #eee;
  margin: 10px 16px 30px;
  border-radius: 10px;
`;

const MoreText = styled.Text`
  font-size: 16px;
  color: #007AFF;
  font-weight: bold;
`;

const LoadingWrapper = styled.View`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
`;

const HighlightText = styled.Text`
  color: #34C759;
  font-weight: bold;
`;
