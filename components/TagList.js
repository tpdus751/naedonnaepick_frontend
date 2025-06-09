// components/TagList.js

import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const ALL_TAGS = [
  { name: '삼겹살', icon: <MaterialCommunityIcons name="pig" size={20} /> },
  { name: '치킨', icon: <MaterialCommunityIcons name="food-drumstick" size={20} /> },
  { name: '피자', icon: <Ionicons name="pizza" size={20} /> },
  { name: '햄버거', icon: <FontAwesome5 name="hamburger" size={20} /> },
  { name: '파스타', icon: <MaterialCommunityIcons name="noodles" size={20} /> },
  { name: '초밥', icon: <MaterialCommunityIcons name="fish" size={20} /> },
  { name: '국밥', icon: <MaterialCommunityIcons name="rice" size={20} /> },
  { name: '분식', icon: <MaterialCommunityIcons name="noodles" size={20} /> },
  { name: '족발', icon: <MaterialCommunityIcons name="food-steak" size={20} /> },
  { name: '샤브샤브', icon: <MaterialCommunityIcons name="pot" size={20} /> },
];

export default function TagList({ onTagPress }) {
  // 랜덤 6개 태그
  const randomTags = [...ALL_TAGS].sort(() => 0.5 - Math.random()).slice(0, 6);

  return (
    <TagContainer>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={randomTags}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TagButton onPress={() => onTagPress(item.name)}>
            {item.icon}
            <TagText>{item.name}</TagText>
          </TagButton>
        )}
      />
    </TagContainer>
  );
}

const TagContainer = styled.View`
  padding: 8px 20px;
`;

const TagButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #f0f0f0;
  padding: 6px 12px;
  border-radius: 20px;
  margin-right: 8px;
`;

const TagText = styled.Text`
  margin-left: 6px;
  font-size: 14px;
  font-weight: 500;
`;
