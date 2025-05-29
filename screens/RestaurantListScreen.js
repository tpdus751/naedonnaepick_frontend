import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native';
import Header from '../components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
  padding: 20px;
`;

const RestaurantListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const restaurants = route.params?.restaurants || []; // 데이터 확인, 없으면 빈 배열 반환

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('RestaurantDetailScreen', {
          restaurant: item,
        })
      }
    >
      <View style={styles.info}>
        <Text style={styles.title}>{item.name || '이름 없음'}</Text>
        <Text style={styles.description}>{item.address || '주소 없음'}</Text>
        <Text style={styles.category}>{item.category || '카테고리 없음'}</Text>
        <Text style={styles.phoneNumber}>
          연락처: {item.phoneNumber || '연락처 없음'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (!restaurants || restaurants.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
      </View>
    );
  }

  return (
    <Container>
      <Header
        title="음식점 리스트"
        canGoBack={true}
        onBackPress={() => navigation.goBack()}
      />
      <FlatList
        data={restaurants}
        renderItem={renderItem}
        keyExtractor={(item) => item.id ? item.id.toString() : String(Math.random())}
        contentContainerStyle={{ padding: 16 }}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#777',
  },
  card: {
    flexDirection: 'column',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 12,
    color: '#007AFF',
  },
});

export default RestaurantListScreen;