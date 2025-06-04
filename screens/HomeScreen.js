import React, { useState, useEffect } from 'react';
import { SafeAreaView, Alert } from 'react-native';
import styled from 'styled-components/native';
import Header from '../components/Header';
import SideMenuDrawer from '../components/SideMenuDrawer';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('위치 권한이 거부되었습니다.');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      let geocode = await Location.reverseGeocodeAsync(loc.coords);
      if (geocode.length > 0) {
        const { region, city, district } = geocode[0];
        setAddress(`${region} ${city} ${district}`);
      }
    })();
  }, []);

  return (
    <Container>
      <Header
        title="내돈내픽"
        canGoBack={false}
        onBackPress={() => Alert.alert('뒤로가기 버튼 클릭')}
        onMenuPress={() => setMenuVisible(true)}
      />

      <SideMenuDrawer
        isVisible={isMenuVisible}
        onClose={() => setMenuVisible(false)}
        onLoginPress={() => navigation.navigate('LoginMain')}
      />

      {/* 상단 이미지 + 설명 */}
      <Banner source={{ uri: 'https://cdn.gimhaenews.co.kr/news/photo/201501/11563_17242_3954.jpg' }} />
      <Description>
        가격대와 선호 항목을 설정하고{'\n'}나에게 맞는 음식점을 추천 받아보세요....
      </Description>

      {/* 예산 + 위치 정보 */}
      <InfoText>내 예산: 33,000원</InfoText>
      <InfoText>
        내 위치: {address ? address : '위치 확인 중...'}
      </InfoText>
      {errorMsg && <InfoText style={{ color: 'red' }}>{errorMsg}</InfoText>}
    </Container>
  );
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
  padding: 20px;
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
  line-height: 24px;
`;

const InfoText = styled.Text`
  font-size: 16px;
  margin-bottom: 6px;
  color: #555;
`;
