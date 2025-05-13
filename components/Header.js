// components/Header.js
import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

export default function Header({ title, canGoBack = false, onBackPress, onMenuPress }) {
  return (
    <Container>
      {/* 왼쪽: 뒤로가기 버튼 */}
      {canGoBack ? (
        <BackButton onPress={onBackPress}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </BackButton>
      ) : (
        <Spacer />
      )}

      {/* 가운데: 타이틀 */}
      <Title numberOfLines={1}>{title}</Title>
      
      {/* 오른쪽: 메뉴 아이콘 */}
      <MenuButton onPress={onMenuPress}>
        <Ionicons name="menu" size={24} color="black" />
      </MenuButton>
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: white;
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #000;
  flex: 1;
  text-align: center;
`;

const BackButton = styled(TouchableOpacity)`
  padding: 8px;
`;

const MenuButton = styled(TouchableOpacity)`
  padding: 8px;
`;

const Spacer = styled.View`
  width: 32px;
`;
