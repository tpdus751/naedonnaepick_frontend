import React, { useState, useEffect } from 'react';
import { Alert, ActivityIndicator, FlatList } from 'react-native';
import styled from 'styled-components/native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import SideMenuDrawer from '../components/SideMenuDrawer';
import RestaurantSearchBar from '../components/RestaurantSearchBar';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('위치 확인 중...');
  const navigation = useNavigation();

  // 📍 실시간 위치 추적
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAddress('위치 권한 거부됨');
        return;
      }

      const locationSubscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // 5초마다 업데이트
          distanceInterval: 10, // 10m 이동 시마다 업데이트
        },
        async (loc) => {
          try {
            const [addr] = await Location.reverseGeocodeAsync(loc.coords);
            if (addr.region && addr.district) {
              setAddress(`${addr.region} ${addr.city} ${addr.district} ${addr.name}`);
            } else {
              setAddress('주소 변환 실패');
            }
          } catch (err) {
            setAddress('주소 가져오기 실패');
            console.error('📍 역지오코딩 오류:', err);
          }
        }
      );

      return () => {
        locationSubscriber.remove(); // 컴포넌트 언마운트 시 정리
      };
    })();
  }, []);

  const fetchRestaurants = async (reset = false) => {
    if (loading || (isEnd && !reset)) return;

    const currentPage = reset ? 0 : page;
    setLoading(true);

    try {
      const response = await fetch(
        `http://172.31.57.17:8080/api/restaurant/search?searchText=${searchText}&page=${currentPage}&size=10`
      );
      const data = await response.json();

      if (reset) {
        setRestaurants(data);
      } else {
        setRestaurants((prev) => [...prev, ...data]);
      }

      setIsEnd(data.length < 10);
      setPage(currentPage + 1);
    } catch (error) {
      console.error('🍗 Fetch Error:', error);
      Alert.alert('오류', '음식점 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    setIsEnd(false);
    setPage(0);
    fetchRestaurants(true);
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="#007AFF" style={{ margin: 16 }} />;
  };

  const renderItem = ({ item }) => (
    <RestaurantCard onPress={() => navigation.navigate('RestaurantDetailScreen', { restaurant: item })}>
      <RestaurantName>{item.name}</RestaurantName>
      <RestaurantInfo>{item.address}</RestaurantInfo>
    </RestaurantCard>
  );

  return (
    <Container>
      <SideMenuDrawer
        isVisible={isMenuVisible}
        onClose={() => setMenuVisible(false)}
        onLoginPress={() => navigation.navigate('LoginMain')}
      />

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.restaurantNo.toString()}
        renderItem={renderItem}
        onEndReached={() => fetchRestaurants()}
        onEndReachedThreshold={0.6}
        ListHeaderComponent={
          <>
            <HeaderSection>
              <Header
                title="내돈내픽"
                canGoBack={false}
                onBackPress={() => Alert.alert('뒤로가기 버튼 클릭')}
                onMenuPress={() => setMenuVisible(true)}
              />
              <Banner source={{ uri: 'https://cdn.gimhaenews.co.kr/news/photo/201501/11563_17242_3954.jpg' }} />
              <Description>
                가격대와 선호 항목을 설정하고{'\n'}나에게 맞는 음식점을 추천 받아보세요....
              </Description>
              <InfoText>내 예산: 33,000원</InfoText>
              <InfoText>내 위치: {address}</InfoText>
            </HeaderSection>

            <StickySearchBar>
              <RestaurantSearchBar onSearch={handleSearch} />
            </StickySearchBar>
          </>
        }
        ListFooterComponent={renderFooter}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const HeaderSection = styled.View`
  padding: 20px;
`;

const StickySearchBar = styled.View`
  background-color: #fff;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;

const Banner = styled.Image`
  width: 100%;
  height: 120px;
  background-color: #e5e5e5;
  margin-bottom: 16px;
  border-radius: 12px;
`;

const Description = styled.Text`
  text-align: center;
  font-size: 16px;
  color: #333;
  margin-bottom: 24px;
  line-height: 24px;
`;

const InfoText = styled.Text`
  font-size: 16px;
  margin-bottom: 12px;
  color: #555;
`;

const RestaurantCard = styled.TouchableOpacity`
  padding: 16px;
  border-bottom-width: 1px;
  border-color: #eee;
`;

const RestaurantName = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

const RestaurantInfo = styled.Text`
  font-size: 14px;
  color: #666;
`;