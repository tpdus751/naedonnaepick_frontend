import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import Header from '../components/Header';
import PriceSlider from '../components/PriceSlider';
import LocationInput from '../components/LocationInput';
import TasteSelector from '../components/TasteSelector';
import { useNavigation } from '@react-navigation/native';
import SideMenuDrawer from '../components/SideMenuDrawer';
import { fetchRestaurants } from '../api/RestaurantAPI';

// ✅ Styled-components 선언
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
`;

const RecommendationScreen = () => {
  
  const navigation = useNavigation();
  const [priceRange, setPriceRange] = useState([5000, 20000]);
  const [location, setLocation] = useState('');
  const [tastePreferences, setTastePreferences] = useState({});
  const [restaurants, setRestaurants] = useState([]);
  const [isMenuVisible, setMenuVisible] = useState(false);

  // const handleSearch = async () => {
  //   try {
  //     const response = await axios.get('/api/restaurants', {
  //       params: {
  //         minPrice: priceRange[0],
  //         maxPrice: priceRange[1],
  //         location,
  //         taste: tasteLevel,
  //       },
  //     });
  //     setRestaurants(response.data);
  //   } catch (error) {
  //     console.error('검색 오류:', error);
  //   }
  // };
  
  // 검색 핸들러 함수
  const handleSearch = async () => {
    try {
      const allRestaurants = await fetchRestaurants();

      // 조건에 따라 음식점 필터링
      const filteredRestaurants = allRestaurants.filter((restaurant) => {
        // 1. 지역 조건: location 값이 없거나 일치하지 않으면 제외
        if (!location || restaurant.location !== location) {
          return false;
        }

        // 2. 가격 조건: priceRange의 최소값과 최대값 안에 포함
        const isWithinPriceRange =
          restaurant.priceRange[0] >= priceRange[0] &&
          restaurant.priceRange[1] <= priceRange[1];

        // 3. 태그 조건: 사용자가 설정한 태그 점수를 모두 만족해야 포함
        const matchesTags = Object.keys(tastePreferences).every((tag) => {
          return (
            tastePreferences[tag] === 0 || // 선택되지 않은 태그 무시
            (restaurant.tags[tag] && restaurant.tags[tag] >= tastePreferences[tag]) // 조건 충족
          );
        });

        // 필터링된 리스트 조건
        return isWithinPriceRange && matchesTags;
      });

      if (filteredRestaurants.length === 0) {
        // 조건에 맞는 데이터가 없을 경우 알림
        Alert.alert('검색 결과가 없습니다.');
      } else {
        // 조건에 맞는 데이터만 RestaurantListScreen으로 전달
        navigation.navigate('RestaurantListScreen', { restaurants: filteredRestaurants });
      }
    } catch (error) {
      console.error('검색 오류:', error);
      Alert.alert('검색 오류', '검색 중 문제가 발생했습니다.');
    }
  };

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
                          onLoginPress={() => 
                            navigation.navigate('LoginMain')
                          }
                        />
      <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>음식점 추천</Text>
        <PriceSlider value={priceRange} onChange={setPriceRange} />
        <LocationInput value={location} onChange={setLocation} />
        <TasteSelector value={tastePreferences} onChange={setTastePreferences} />
        <Button title="검색" onPress={handleSearch} />
      </ScrollView>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default RecommendationScreen;