// screens/BudgetScreen.js
import React, {useNavigation} from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import Header from '../components/Header';

export default function ProfileScreen() {

  return (
    <Container>
      <Header 
        title="내돈내픽"  
        canGoBack={false}
        onBackPress={() => Alert.alert('뒤로가기 버튼 클릭')}
        onMenuPress={() => Alert.alert('메뉴 버튼 클릭')}
      /> 
    <View><Text>마이페이지 화면</Text></View>
    </Container>
  );
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
  padding: 20px;
`;