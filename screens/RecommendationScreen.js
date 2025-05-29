import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import Header from '../components/Header';
import PriceSlider from '../components/PriceSlider';
import LocationInput from '../components/LocationInput';
import TasteSelector from '../components/TasteSelector';
import { useNavigation } from '@react-navigation/native';
import SideMenuDrawer from '../components/SideMenuDrawer';

// ✅ styled-component는 반드시 컴포넌트 함수 밖에서 선언해야 함!
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
  padding: 20px;
`;

const RecommendationScreen = () => {
  
  const navigation = useNavigation();
  const [priceRange, setPriceRange] = useState([5000, 20000]);
  const [location, setLocation] = useState('');
  const [tasteLevel, setTasteLevel] = useState(5);
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
        <Text style={styles.title}>음식점 추천</Text>
        <PriceSlider value={priceRange} onChange={setPriceRange} />
        <LocationInput value={location} onChange={setLocation} />
        <TasteSelector value={tasteLevel} onChange={setTasteLevel} />
        <Button title="검색" onPress={() => navigation.navigate('RestaurantListScreen')} />
      </View>
      
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default RecommendationScreen;
