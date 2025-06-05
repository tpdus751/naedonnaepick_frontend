import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native'; 
import SideMenuDrawer from '../components/SideMenuDrawer';
import RestaurantSearchBar from '../components/RestaurantSearchBar';
import RestaurantList from '../components/RestaurantList';

export default function HomeScreen() {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [restaurants, setRestaurants] = useState([]); // 검색된 음식점 리스트
  const navigation = useNavigation();

  // 음식점 검색 API 호출 핸들링
  const handleSearch = (searchText) => {
    fetch(`http://172.31.57.31:8080/api/restaurant/search?searchText=${searchText}`)
      .then((res) => res.json())
      .then((data) => {
        setRestaurants(data); // 검색된 결과를 상태로 저장
      })
      .catch((err) => {
        Alert.alert('검색 오류', '검색 중 오류가 발생했습니다.');
        console.error(err);
      });
  };

  return (
    <Container>
      {/* 스크롤 가능한 영역 */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        stickyHeaderIndices={[1]} // 검색 바만 Sticky Header로 설정
      >
        {/* 고정되지 않는 Header와 기존 UI */}
        <HeaderSection>
          <Header 
            title="내돈내픽"  
            canGoBack={false}
            onBackPress={() => Alert.alert('뒤로가기 버튼 클릭')}
            onMenuPress={() => setMenuVisible(true)}
          />
          <SideMenuDrawer
            isVisible={isMenuVisible}
            onClose={() => setMenuVisible(false)}
            onLoginPress={() => 
              navigation.navigate('LoginMain')
            }
          />
          <Banner source={{ uri: 'https://cdn.gimhaenews.co.kr/news/photo/201501/11563_17242_3954.jpg' }} />
          <Description>
            가격대와 선호 항목을 설정하고{'\n'}나에게 맞는 음식점을 추천 받아보세요....
          </Description>
          <InfoText>내 예산: 33,000원</InfoText>
          <InfoText>내 위치: 경기도 성남시 산성동</InfoText>
        </HeaderSection>

        {/* 검색 바 */}
        <StickySearchBar>
          <RestaurantSearchBar onSearch={handleSearch} />
        </StickySearchBar>

        {/* 음식점 리스트 */}
        <RestaurantList restaurants={restaurants} />
      </ScrollView>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

// 고정되지 않는 UI 구성 (기존 헤더, 배너 등)
const HeaderSection = styled.View`
  padding: 20px;
`;

// Sticky Header로 고정될 검색 바
const StickySearchBar = styled.View`
  background-color: #fff;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
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
  margin-bottom: 12px;
  color: #555;
`;