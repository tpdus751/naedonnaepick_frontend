import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const PriceSlider = ({ value, onChange }) => {
  const [min, max] = value;

  return (
    <View style={styles.container}>
      <Text>가격 범위 설정</Text>

      <Text>최소: ₩{min.toLocaleString()}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100000}
        step={1000}
        value={min}
        onValueChange={(val) => {
          const newMin = val;
          const newMax = Math.max(val, max); // 최소가 최대보다 커지지 않게
          onChange([newMin, newMax]);
        }}
      />

      <Text>최대: ₩{max.toLocaleString()}</Text>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={100000}
        step={1000}
        value={max}
        onValueChange={(val) => {
          onChange([min, val]);
        }}
      />

      <Text style={styles.rangeText}>
        선택된 범위: ₩{min.toLocaleString()} - ₩{max.toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeText: {
    marginTop: 16,
  },
});

export default PriceSlider;
