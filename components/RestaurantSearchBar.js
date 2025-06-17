import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RestaurantSearchBar({ onSearch }) {
  const [searchText, setSearchText] = useState('');

  const handleSearchPress = () => {
    if (searchText.trim().length > 0) {
      onSearch(searchText);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="음식점명 또는 메뉴 검색"
        value={searchText}
        onChangeText={setSearchText}
        returnKeyType="search"
        onSubmitEditing={handleSearchPress}
      />
      <TouchableOpacity style={styles.iconButton} onPress={handleSearchPress}>
        <Ionicons name="search" size={20} color="#555" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 6,
    paddingRight: 8,
    color: '#333',
  },
  iconButton: {
    padding: 4,
  },
});
