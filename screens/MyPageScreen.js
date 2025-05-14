// screens/MyPageScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import Header from '../components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function MyPageScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  // 만약 SignUpScreen에서 user 정보를 params로 전달했다면
  // const { firstName, lastName, nickname, email } = route.params;

  // 예시 값
  const firstName = 'Hong';
  const lastName = 'Gildong';
  const nickname = 'hihi';
  const email = '1234hong@gmail.com';

  return (
    <Container>
      <Header
        title="내돈내픽"
        canGoBack={false}
        onMenuPress={() => {/* 햄버거 메뉴 처리 */}}
      />

      <ScrollView contentContainerStyle={styles.inner}>
        <Card>
          <Text style={styles.infoText}>
            이름: {firstName}{lastName}{'\n'}
            닉네임: {nickname}{'\n'}
            이메일: {email}
          </Text>
        </Card>

        <OptionButton onPress={() => {/* 프로필 정보 확인 */}}>
          <OptionText>프로필 정보 확인</OptionText>
        </OptionButton>
        <OptionButton onPress={() => {/* 비밀번호 변경 */}}>
          <OptionText>비밀번호 변경</OptionText>
        </OptionButton>
        <OptionButton onPress={() => {/* 로그아웃 */}}>
          <OptionText>로그아웃</OptionText>
        </OptionButton>
        <OptionButton onPress={() => {/* 공지사항 */}}>
          <OptionText>공지사항</OptionText>
        </OptionButton>
        <OptionButton onPress={() => {/* 앱 정보 */}}>
          <OptionText>앱 정보</OptionText>
        </OptionButton>

        <HomeButton onPress={() => navigation.navigate('Main')}>
          <HomeText>홈으로</HomeText>
        </HomeButton>
      </ScrollView>
    </Container>
  );
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
`;

const Card = styled(View)`
  border-width: 1px;
  border-color: #ddd;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
`;

const OptionButton = styled(TouchableOpacity)`
  border-width: 1px;
  border-color: #ddd;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 12px;
`;

const OptionText = styled(Text)`
  font-size: 16px;
`;

const HomeButton = styled(TouchableOpacity)`
  background-color: #ddd;
  padding: 15px;
  border-radius: 5px;
  align-items: center;
  margin-top: 30px;
`;

const HomeText = styled(Text)`
  font-size: 16px;
  font-weight: bold;
`;

const styles = StyleSheet.create({
  inner: {
    padding: 20,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
