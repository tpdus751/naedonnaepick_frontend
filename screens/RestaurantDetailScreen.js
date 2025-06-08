import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const RestaurantDetailScreen = () => {
  const route = useRoute();
  const { restaurant } = route.params;
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get('http://192.168.25.9:8080/api/restaurant/menus', {
          params: { restaurantNo: restaurant.restaurantNo },
        });
        setMenus(response.data);
      } catch (error) {
        console.error('메뉴 불러오기 오류:', error);
        Alert.alert('오류', '메뉴를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [restaurant.restaurantNo]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.restaurantName}>{restaurant.name}</Text>
      <Text style={styles.sectionTitle}>메뉴</Text>
      {menus.length === 0 ? (
        <Text style={styles.noDataText}>등록된 메뉴가 없습니다.</Text>
      ) : (
        <FlatList
          data={menus}
          renderItem={({ item }) => (
            <View style={styles.menuItem}>
              <Text style={styles.menuName}>{item.menu}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
              <Text style={styles.menuPrice}>{item.price.toLocaleString()} 원</Text>
            </View>
          )}
          keyExtractor={(item) => item.menuNo.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 16,
    color: '#777',
  },
  menuItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  menuPrice: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default RestaurantDetailScreen;