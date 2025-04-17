import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const RestaurantList = ({ data }) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text>{item.description}</Text>
          <Text>위치: {item.location}</Text>
          <Text>가격대: {item.price}원</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 16,
  },
  itemName: {
    fontWeight: 'bold',
  },
});

export default RestaurantList;
