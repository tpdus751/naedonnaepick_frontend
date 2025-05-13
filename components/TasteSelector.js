import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';

export const TAGS = [
  '매운맛', '가성비', '친절함', '청결함', '분위기', '양 많음',
  '맛집', '웨이팅 있음', '달콤함', '짭짤함', '고소함',
  '신선함', '혼밥 가능', '트렌디함', '주차 편의성'
];

const TasteSelector = ({ value, onChange }) => {
  const [showTags, setShowTags] = useState(false);

  // value가 undefined일 경우 기본값 설정
  const safeValue = value || {};

  const handleSliderChange = (tag, val) => {
    onChange({ ...safeValue, [tag]: val });
  };

  return (
    <View style={styles.container}>
      {/* 태그 설정 토글 버튼 */}
      <TouchableOpacity onPress={() => setShowTags(prev => !prev)}>
        <Text style={styles.toggleText}>
          태그 설정 {showTags ? '∧' : '∨'}
        </Text>
      </TouchableOpacity>

      {/* showTags가 true일 경우 태그 슬라이더 표시 */}
      {showTags && (
        <ScrollView style={styles.scrollArea}>
          {TAGS.map(tag => (
            <View key={tag} style={styles.sliderWrapper}>
              <Text style={styles.label}>
                {tag}: {safeValue[tag] ?? 0}
              </Text>
              <Slider
                value={safeValue[tag] ?? 0}
                onValueChange={val => handleSliderChange(tag, val)}
                step={1}
                minimumValue={0}
                maximumValue={10}
                style={styles.slider}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  toggleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 12,
  },
  scrollArea: {
    maxHeight: 400, // 화면 넘칠 경우 스크롤
  },
  sliderWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  slider: {
    width: '100%',
  },
});

export default TasteSelector;
