import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

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
      />
      <Button title="검색" onPress={handleSearchPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
});