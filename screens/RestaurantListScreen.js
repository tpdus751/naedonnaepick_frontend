// RestaurantListScreen.js
import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
  padding: 20px;
`;
const restaurantData = [
  {
    id: '1',
    name: '카산도',
    description: '카츠 , 카레 ,산도가 맛있는 나만의 섬 카산도에 여러분을 초대합니다.',
    image: require('../imgs/음식점 1.jpg'),
  },
  {
    id: '2',
    name: '돌판 하나',
    description: '대한민국 상위 1프로 지례 흑돼지를 취급하고 있습니다',
    image: require('../imgs/음식점 2.jpg'),
  },
  {
    id: '3',
    name: '갓 잇',
    description: '줄 서서 먹는 타코 맛집 갓잇 분당정자점입니다.',
    image: require('../imgs/음식점 3.jpg'),
  }
];

const RestaurantListScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RestaurantDetailScreen')}>
      {item.image ? (
        <Image source={item.image} style={styles.image}/>
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>이미지 없음</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );
  

  return (
    <Container>
      <Header 
        title="내돈내픽"  
        canGoBack={true}
        onBackPress={() => navigation.goBack()}
        onMenuPress={() => setMenuVisible(true)}
      /> 
      <View style={styles.container}>
        <FlatList
          data={restaurantData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    flexDirection: 'row', // 이미지와 텍스트를 나란히
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    alignItems: 'center',
  },
  image: {
    width: 100, // 이미지 너비를 절반 이하로
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  placeholderText: {
    color: '#888',
    fontSize: 12,
  },
  info: {
    flex: 1,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 4,
    fontSize: 13,
    color: '#555',
  },
});


export default RestaurantListScreen;
