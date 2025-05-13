import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const TasteSelector = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      <Text>맛 강도 설정</Text>
      <Slider
        value={value}
        onValueChange={onChange}
        step={1}
        minimumValue={0}
        maximumValue={10}
      />
      <Text>선택한 맛 강도: {value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default TasteSelector;
