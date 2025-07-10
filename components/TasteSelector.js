import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export const TAGS = [
  '매운맛', '가성비', '친절함', '청결함', '분위기', '양 많음',
  '맛집', '웨이팅 있음', '달콤함', '짭짤함', '고소함',
  '신선함', '혼밥 가능', '트렌디함', '주차 편의성'
];

const TasteSelector = ({ value, onChange }) => {
  const [showTags, setShowTags] = useState(false);

  // value가 undefined일 경우 기본값 설정
  const safeValue = value || TAGS.reduce((acc, tag) => ({ ...acc, [tag]: 3 }), {});

  const handlePreferenceChange = (tag, score) => {
    onChange({ ...safeValue, [tag]: score });
  };

  return (
    <View style={styles.container}>
      {/* 태그 설정 토글 버튼 */}
      <TouchableOpacity onPress={() => setShowTags((prev) => !prev)}>
        <Text style={styles.toggleText}>
          태그 설정 {showTags ? '∧' : '∨'}
        </Text>
      </TouchableOpacity>

      {/* 태그 설정 영역 */}
      {showTags && (
        <ScrollView 
          style={styles.scrollContainer} // 스크롤 영역 스타일 추가
          contentContainerStyle={styles.scrollContent} 
          nestedScrollEnabled={true} // 부모와의 스크롤 충돌 방지
        >
          {TAGS.map((tag) => (
            <View key={tag} style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>{tag}</Text>
              <View style={styles.scoreContainer}>
                {[1, 2, 3, 4, 5].map((score) => (
                  <TouchableOpacity
                    key={score}
                    style={[
                      styles.scoreButton,
                      safeValue[tag] === score && styles.selectedScoreButton,
                    ]}
                    onPress={() => handlePreferenceChange(tag, score)}
                  >
                    <Text
                      style={[
                        styles.scoreText,
                        safeValue[tag] === score && styles.selectedScoreText,
                      ]}
                    >
                      {score}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
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
    flex: 1,
  },
  toggleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 12,
  },
  scrollContainer: {
    maxHeight: 300, // 스크롤 영역의 최대 높이를 설정
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  preferenceItem: {
    marginBottom: 20,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedScoreButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  scoreText: {
    fontWeight: 'bold',
    color: '#000',
  },
  selectedScoreText: {
    color: '#fff',
  },
});

export default TasteSelector;