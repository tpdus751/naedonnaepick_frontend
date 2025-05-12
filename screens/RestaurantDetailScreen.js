// RestaurantDetailScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native';


const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
  padding: 20px;
`;

const restaurant = {
  name: '카산도',
  description: '이곳은 다양한 퓨전 요리를 선보이는 맛집입니다. 분위기도 좋고 맛도 훌륭해요!',
  featuredImage: require('../imgs/음식점 1.jpg'), // ✅ 로컬 이미지 사용
  menu: [
    {
      id: '1',
      name: '카산도 미소카츠 정식',
      price: '₩15,000',
      image: require('../imgs/음식점 1 음식 1.jpg'),
    },
    {
      id: '2',
      name: '특 등심카츠 정식',
      price: '₩16,000',
      image: require('../imgs/음식점 1 음식 2.jpg'),
    },
    {
        id: '3',
        name: '등심카츠 정식',
        price: '₩14,000',
        image: require('../imgs/음식점 1 음식 3.jpg'),
    }
  ],
};

const RestaurantDetailScreen = () => {
  return (
    <Container>
<Header 
        title="내돈내픽"  
        canGoBack={false}
        onBackPress={() => navigation.goBack()}
        onMenuPress={() => Alert.alert('메뉴 버튼 클릭')}
      /> 
    <ScrollView style={styles.container}>
      {/* 대표 사진 */}
      <View style={styles.headerSection}>
  <Image source={restaurant.featuredImage} style={styles.thumbnail} />
  <View style={styles.info}>
    <Text style={styles.sectionTitle}>{restaurant.name}</Text>
    <Text style={styles.description}>{restaurant.description}</Text>
  </View>
</View>
<View style={styles.separator} />

      {/* 메뉴 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>메뉴</Text>
        {restaurant.menu.map((item) => (
            <View key={item.id} style={styles.menuItem}>
            <Image source={item.image} style={styles.menuImage} />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuPrice}>{item.price}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
</Container>
  );
};

const styles = StyleSheet.create({
    headerSection: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'flex-start',
    },
    thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
    },
    info: {
    flex: 1,
    },
      
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 12,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#555',
  },
  menuItem: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuName: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuPrice: {
    fontSize: 14,
    color: '#777',
  },
});

export default RestaurantDetailScreen;
