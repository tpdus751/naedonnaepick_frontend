import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';

const regions = [
  '수정구', '중원구', '분당구',
  '신흥동', '태평동', '수진동', '산성동', '단대동',
  '금광동', '상대원동', '중앙동', '성남동', '하대원동',
  '정자동', '서현동', '이매동', '야탑동', '분당동',
  '구미동', '수내동', '금곡동', '정자1동', '판교동'
];


const LocationInput = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      <Text>지역 선택</Text>
      <View style={styles.buttonContainer}>
        {regions.map(region => (
          <Button
            key={region}
            title={region}
            onPress={() => onChange(region)}
            color={value === region ? 'blue' : 'gray'}
          />
        ))}
      </View>
      {value && (
        <Text style={styles.selectedRegion}>
          선택된 지역: <Text style={{ fontWeight: 'bold' }}>성남시 {value}</Text>
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  selectedRegion: {
    marginTop: 8,
  },
});

export default LocationInput;
