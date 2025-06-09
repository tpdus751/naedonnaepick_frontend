import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RestaurantCard({ restaurant }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('RestaurantDetailScreen', { restaurant })
      }
      style={{
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff',
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{restaurant.name}</Text>
      <Text>{restaurant.address}</Text>
    </TouchableOpacity>
  );
}
