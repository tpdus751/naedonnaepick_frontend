// screens/HomeScreen.js
import React from 'react';
import { SafeAreaView, Image, Alert } from 'react-native';
import styled from 'styled-components/native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native'; // ✅ 1

export default function HomeScreen() {
  const navigation = useNavigation(); 

  return (
    <Container>
      <Header 
        title="내돈내픽"  
        canGoBack={false}
        onBackPress={() => Alert.alert('뒤로가기 버튼 클릭')}
        onMenuPress={() => Alert.alert('메뉴 버튼 클릭')}
      /> 
      {/* 상단 이미지 + 설명 */}
      <Banner source={{ uri: 'https://cdn.gimhaenews.co.kr/news/photo/201501/11563_17242_3954.jpg' }} />
      <Description>
        가격대와 선호 항목을 설정하고{'\n'}나에게 맞는 음식점을 추천 받아보세요..
      </Description>

      {/* 버튼 3개 */}
      <ButtonContainer>
        <MainButton onPress={() => navigation.navigate('Detail')}>
          <ButtonText>음식점 검색</ButtonText>
        </MainButton>
        <MainButton onPress={() => navigation.navigate('Detail')}>
          <ButtonText>예산 관리</ButtonText>
        </MainButton>
        <MainButton onPress={() => navigation.navigate('Detail')}>
          <ButtonText>채팅방 가기</ButtonText>
        </MainButton>
      </ButtonContainer>

      {/* 예산 + 위치 정보 */}
      <InfoText>내 예산: 33,000원</InfoText>
      <InfoText>내 위치: 경기도 성남시 산성동</InfoText>
    </Container>
  );
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
`;

const MenuButton = styled.TouchableOpacity``;

const MenuText = styled.Text`
  font-size: 24px;
`;

const Banner = styled.Image`
  width: 100%;
  height: 120px;
  background-color: #e5e5e5;
  margin-bottom: 16px;
  border-radius: 12px;
`;

const Description = styled.Text`
  text-align: center;
  font-size: 16px;
  color: #333;
  margin-bottom: 24px;
`;

const ButtonContainer = styled.View`
  gap: 12px;
  margin-bottom: 24px;
`;

const MainButton = styled.TouchableOpacity`
  background-color: black;
  padding: 14px;
  border-radius: 10px;
  margin-top: 20px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  text-align: center;
`;

const InfoText = styled.Text`
  font-size: 16px;
  margin-bottom: 6px;
  color: #555;
`;
