import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import useUserStore from '../store/userStore'; // ✅ Zustand에서 user 정보 가져오기
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export default function SideMenuDrawer({ isVisible, onClose, onLoginPress }) {
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const navigation = useNavigation();

  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : screenWidth,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const handleLogout = () => {
    logout();
    onClose();
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginMain' }],
    });
  };

  return (
    <>
      {isVisible && <Backdrop onPress={onClose} />}

      <DrawerContainer style={{ transform: [{ translateX: slideAnim }] }}>
        <ContentWrapper>
          {/* ✅ 사용자 정보 표시 */}
          {user && (
            <UserInfo>
              <UserText>{user.nickname} 님</UserText>
              <UserEmail>{user.email}</UserEmail>
            </UserInfo>
          )}

          {/* ✅ 로그인 / 로그아웃 분기 */}
          {user ? (
            <MenuItem onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#333" style={{ marginRight: 10 }} />
              <MenuText>로그아웃</MenuText>
            </MenuItem>
          ) : (
            <MenuItem onPress={() => {
              onClose();
              onLoginPress();
            }}>
              <Ionicons name="log-in-outline" size={20} color="#333" style={{ marginRight: 10 }} />
              <MenuText>로그인</MenuText>
            </MenuItem>
          )}

          <MenuItem>
            <Ionicons name="settings-outline" size={20} color="#333" style={{ marginRight: 10 }} />
            <MenuText>설정</MenuText>
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
  right: 0;
  width: ${screenWidth * 0.65}px;
  background-color: #fff;
  padding: 30px 20px;
  z-index: 999;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 6;
`;

const ContentWrapper = styled.View`
  margin-top: 60px;
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
  flex-direction: row;
  align-items: center;
  padding: 18px 0;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const MenuText = styled.Text`
  font-size: 17px;
  color: #333;
`;

const UserInfo = styled.View`
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;

const UserText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #222;
`;

const UserEmail = styled.Text`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
`;
