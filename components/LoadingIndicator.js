import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

const loadingMessages = [
  "🍴 취향을 반영한 음식점을 찾는 중이에요…",
  "⏳ AI가 열심히 분석하고 있어요. 조금만 기다려 주세요!",
  "🐶 맛있는 냄새가 나는 곳을 찾는 중입니다…",
  "🧠 태그 분석 중… 당신에게 꼭 맞는 식당을 추천할게요!",
];

const RotatingLoader = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TextMessage>{loadingMessages[index]}</TextMessage>
  );
};

const TextMessage = styled.Text`
  font-size: 15px;
  color: #333;
  text-align: center;
  line-height: 22px;
`;

export default RotatingLoader;

const Center = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const Message = styled.Text`
  margin-top: 16px;
  font-size: 16px;
  color: #333;
  text-align: center;
`;
