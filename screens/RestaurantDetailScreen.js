import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import styled from 'styled-components/native';

const RestaurantDetailScreen = () => {
  const route = useRoute();
  const { restaurant } = route.params;
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get('http://172.31.57.17:8080/api/restaurant/menus', {
          params: { restaurantNo: restaurant.restaurantNo },
        });
        setMenus(response.data);
      } catch (error) {
        console.error('메뉴 불러오기 오류:', error);
        Alert.alert('오류', '메뉴를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [restaurant.restaurantNo]);

  const handleEatButtonPress = (menuItem) => {
    Alert.alert(
      '먹기 버튼 클릭',
      `${restaurant.name}의 ${menuItem.menu}을(를) 선택하시겠습니까?`,
      [{ text: '취소', style: 'cancel' }, { text: '확인' }]
    );
  };

  if (loading) {
    return (
      <Loader>
        <ActivityIndicator size="large" color="#007AFF" />
      </Loader>
    );
  }

  const renderItem = ({ item }) => (
    <MenuItemContainer>
      <MenuInfo>
        <MenuName>{item.menu}</MenuName>
        {item.description && <MenuDescription>{item.description}</MenuDescription>}
        <MenuPrice>
          {item.price !== null && item.price > 0
            ? `${item.price.toLocaleString()} 원`
            : '변동'}
        </MenuPrice>
      </MenuInfo>
      {/* 가격이 변동이 아닐 때만 "먹기" 버튼 렌더링 */}
      {item.price !== null && item.price > 0 && (
        <EatButton onPress={() => handleEatButtonPress(item)}>
          <EatButtonText>먹기</EatButtonText>
        </EatButton>
      )}
    </MenuItemContainer>
  );

  return (
    <Container>
      <RestaurantName>{restaurant.name}</RestaurantName>
      <SectionTitle>메뉴</SectionTitle>
      {menus.length === 0 ? (
        <NoDataText>등록된 메뉴가 없습니다.</NoDataText>
      ) : (
        <FlatList
          data={menus}
          renderItem={renderItem}
          keyExtractor={(item) => item.menuNo.toString()}
        />
      )}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: #fff;
`;

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const RestaurantName = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const NoDataText = styled.Text`
  font-size: 16px;
  color: #777;
`;

const MenuItemContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const MenuInfo = styled.View`
  flex: 1;
`;

const MenuName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const MenuDescription = styled.Text`
  font-size: 14px;
  color: #777;
  margin-bottom: 4px;
`;

const MenuPrice = styled.Text`
  font-size: 16px;
  color: #007AFF;
`;

const EatButton = styled(TouchableOpacity)`
  background-color: #4CAF50; /* 자연 친화적인 녹색 계열 */
  padding: 8px 15px;
  border-radius: 20px;
  margin-left: 16px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const EatButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

export default RestaurantDetailScreen;