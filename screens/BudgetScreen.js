// screens/BudgetScreen.js
import React from 'react';
import { ScrollView, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import styled from 'styled-components/native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';


export default function BudgetScreen() {
  const navigation = useNavigation();
  return (
    <Container>
      <Header 
        title="내돈내픽"  
        canGoBack={false}
        onBackPress={() => Alert.alert('뒤로가기 버튼 클릭')}
        onMenuPress={() => Alert.alert('메뉴 버튼 클릭')}
      /> 

      <Content>
        <TitleText>1주차 예산 : 37,000원  남은 예산 : 7,200원</TitleText>

        <ScrollView style={{ maxHeight: 200, marginVertical: 10 }}>
          <ExpenseItem>1. 지존짬뽕 25.04.01 해물짬뽕 -6000원</ExpenseItem>
          <ExpenseItem>2. 맥도날드 25.04.02 맥스파이시 라지세트 -9,800원</ExpenseItem>
          <ExpenseItem>3. 김밥천국 25.04.04 김밥,우동 -6,000원</ExpenseItem>
          <ExpenseItem>4. 천국돼지국밥 25.04.05 돼지국밥 -8,000원</ExpenseItem>
        </ScrollView>

        <CalendarBox>
          <Text>1주차 (달력 형식)</Text>
          <Text>-6000원, -9800원, -6000원, -8000원</Text>
        </CalendarBox>

        <ButtonRow>
        <StyledButton onPress={() => navigation.navigate('BudgetSetting')}>
       <ButtonText>예산 설정</ButtonText>
        </StyledButton>
          <StyledButton><ButtonText>소비내역</ButtonText></StyledButton>
          <StyledButton><ButtonText>이번달지출</ButtonText></StyledButton>
        </ButtonRow>
      </Content>
    </Container>
  );
}

// SafeAreaView 사용!
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
`;

const Content = styled.View`
  padding: 20px;
  flex: 1;
`;

const TitleText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ExpenseItem = styled.Text`
  font-size: 14px;
  margin-bottom: 5px;
`;

const CalendarBox = styled.View`
  height: 100px;
  border: 1px solid #ccc;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

const StyledButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #333;
  padding: 10px;
  margin: 0 5px;
  border-radius: 8px;
`;

const ButtonText = styled.Text`
  color: white;
  text-align: center;
`;
