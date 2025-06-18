import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import useUserStore from '../store/userStore';

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

const TAG_LIST = Object.keys(TAGS_KR);

const TagPreferenceSection = ({ tagScores, setTagScores }) => {
  const userTags = useUserStore((state) => state.tags);

  useEffect(() => {
    if (userTags) setTagScores(userTags);
  }, [userTags]);

  const handleScoreChange = (tag, value) => {
    setTagScores((prev) => ({
      ...prev,
      [tag]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>태그 선호도 설정</Text>
      <Text style={styles.subtitle}>각 항목에 대한 본인의 선호도를 설정해주세요.</Text>

      {TAG_LIST.map((tag) => (
        <View key={tag} style={styles.card}>
          <View style={styles.labelRow}>
            <Text style={styles.tagName}>{TAGS_KR[tag]}</Text>
            <Text style={styles.scoreText}>
              {(tagScores?.[tag] ?? 3.0).toFixed(1)}점
            </Text>
          </View>

          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={5}
            step={0.5}
            value={tagScores?.[tag] ?? 3.0}
            onValueChange={(value) => handleScoreChange(tag, value)}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#ddd"
            thumbTintColor="#007AFF"
          />
        </View>
      ))}
    </View>
  );
};

export default TagPreferenceSection;

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  tagName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  slider: {
    width: '100%',
    height: 36,
  },
});
