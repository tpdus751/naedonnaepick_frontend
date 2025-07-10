import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TAGS_KR = {
  spicy: '매운맛',
  value_for_money: '가성비',
  kindness: '친절도',
  cleanliness: '청결도',
  atmosphere: '분위기',
  large_portions: '푸짐함',
  tasty: '맛있음',
  waiting: '웨이팅',
  sweet: '단맛',
  salty: '짠맛',
  savory: '감칠맛',
  freshness: '신선도',
  solo_dining: '혼밥 적합도',
  trendy: '트렌디함',
  parking: '주차 편리함',
};

const TAG_DESCRIPTIONS = {
  spicy: '매운 음식을 선호하는 정도',
  value_for_money: '가격 대비 만족도를 중요시하는 정도',
  kindness: '직원의 친절함을 얼마나 중요하게 생각하는지',
  cleanliness: '매장의 위생 상태에 대한 민감도',
  atmosphere: '분위기, 인테리어 등 감성적인 요소의 중요도',
  large_portions: '음식의 양을 중요하게 생각하는 정도',
  tasty: '전반적인 음식의 맛에 대한 기대치',
  waiting: '기다리는 것에 대한 수용도',
  sweet: '단맛을 선호하는 정도',
  salty: '짠맛을 선호하는 정도',
  savory: '감칠맛을 선호하는 정도',
  freshness: '재료의 신선도에 대한 민감도',
  solo_dining: '혼밥하기 좋은지 여부를 얼마나 고려하는지',
  trendy: '인스타감성, 트렌디함에 대한 선호도',
  parking: '주차 편리성을 얼마나 중요하게 여기는지',
};

const TAG_LIST = Object.keys(TAGS_KR);

export default function TagPreferenceSection({ tagScores, setTagScores }) {
  const handleScoreChange = (tag, value) => {
    setTagScores((prev) => ({
      ...prev,
      [tag]: value,
    }));
  };

  console.log(tagScores)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍽️ 태그 선호도 설정</Text>
      <Text style={styles.subtitle}>
        내 취향을 반영해 더 정밀한 추천을 받아보세요.
      </Text>

      {TAG_LIST.map((tag) => (
        <View key={tag} style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.tagName}>{TAGS_KR[tag]}</Text>
            <Text style={styles.scoreText}>
              {tagScores?.[tag]}점
            </Text>
          </View>

          <Text style={styles.description}>{TAG_DESCRIPTIONS[tag]}</Text>

          <View style={styles.buttonRow}>
            {[1, 2, 3, 4, 5].map((score) => (
              <TouchableOpacity
                key={score}
                style={[
                  styles.scoreButton,
                  tagScores?.[tag] === score && styles.scoreButtonSelected,
                ]}
                onPress={() => handleScoreChange(tag, score)}
              >
                <Text
                  style={[
                    styles.scoreButtonText,
                    tagScores?.[tag] === score && styles.scoreButtonTextSelected,
                  ]}
                >
                  {score}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tagName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreButton: {
    width: 40,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    backgroundColor: '#f5f5f5',
  },
  scoreButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  scoreButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  scoreButtonTextSelected: {
    color: 'white',
  },
});
