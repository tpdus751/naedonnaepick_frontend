// components/SideMenuDrawer.js
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function SideMenuDrawer({ isVisible, onClose, onLoginPress, onSignUpPress }) {
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : screenWidth, // ✅ 0이면 오른쪽에 붙어 있음
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  return (
    <>
      {isVisible ? <Backdrop onPress={onClose} /> : null}

      <DrawerContainer style={{ right: 0, transform: [{ translateX: slideAnim }] }}>
      <ContentWrapper>
        <MenuItem onPress={onLoginPress}>
          <MenuText>로그인</MenuText>
        </MenuItem>
        <MenuItem onPress={onSignUpPress}>
          <MenuText>회원가입</MenuText>
        </MenuItem>
        </ContentWrapper>
      </DrawerContainer>
    </>
  );
}

const DrawerContainer = styled(Animated.View)`
  position: absolute;
  top: 0;
  bottom: 0;
  width: ${screenWidth * 0.65}px;
  background-color: white;
  padding: 0 20px;
  z-index: 999;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 6;
`;

const ContentWrapper = styled.View`
  margin-top: 80px; /* ✅ 로그인이 너무 위에 붙지 않게 */
`;


const Backdrop = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: 998;
`;

const MenuItem = styled(TouchableOpacity)`
  padding: 18px 0;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const MenuText = styled.Text`
  font-size: 18px;
  color: #333;
`;
