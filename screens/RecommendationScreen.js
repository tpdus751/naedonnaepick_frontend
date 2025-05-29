import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import Header from '../components/Header';
import PriceSlider from '../components/PriceSlider';
import LocationInput from '../components/LocationInput';
import TasteSelector from '../components/TasteSelector';
import { useNavigation } from '@react-navigation/native';
import SideMenuDrawer from '../components/SideMenuDrawer';
import axios from 'axios';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
`;

const RecommendationScreen = () => {
  const navigation = useNavigation();
  const [priceRange, setPriceRange] = useState([5000, 20000]);
  const [location, setLocation] = useState('');
  const [tastePreferences, setTastePreferences] = useState({});
  const [isMenuVisible, setMenuVisible] = useState(false);

const handleSearch = async () => {
  if (!location.trim()) {
    // 지역을 입력하지 않은 경우 알림
    Alert.alert('오류', '지역을 선택해주세요.');
    return; // 함수 실행 중단
  }

  try {
    const response = await axios.get('http://172.31.57.31:8080/api/restaurant/recommended', {
      params: {
        location,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      },
    });

    const { data: filteredRestaurants } = response;

    if (filteredRestaurants.length === 0) {
      Alert.alert('검색 결과가 없습니다.');
    } else {
      // 데이터를 RestaurantListScreen으로 전달
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
        onLoginPress={() => navigation.navigate('LoginMain')}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>음식점 추천</Text>
          <PriceSlider value={priceRange} onChange={setPriceRange} />
          <LocationInput value={location} onChange={setLocation} />
          <TasteSelector value={tastePreferences} onChange={setTastePreferences} />
        </ScrollView>
        <View style={styles.fixedButton}>
          <Button title="검색" onPress={handleSearch} />
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  fixedButton: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});

export default RecommendationScreen;