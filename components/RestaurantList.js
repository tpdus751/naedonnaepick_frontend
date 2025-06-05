import React from 'react';
import { FlatList, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RestaurantList({ restaurants }) {
  const navigation = useNavigation();

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
    <FlatList
      data={restaurants}
      renderItem={renderItem}
      keyExtractor={(item) => item.id ? item.id.toString() : String(Math.random())}
    />
  );
}

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