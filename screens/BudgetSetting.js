// screens/BudgetSetting.js
import React, { useState } from 'react';
import { View, TextInput, Text, KeyboardAvoidingView, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import styled from 'styled-components/native';
import Header from '../components/Header';

export default function BudgetSetting() {
  const [budget, setBudget] = useState(36000); // 초기 예산

  // 예산을 1,000 단위로 포맷
  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 텍스트 입력 시 숫자만 추출해서 상태 업데이트
  const handleTextChange = (text) => {
    const numericValue = parseInt(text.replace(/[^0-9]/g, '')) || 0;
    setBudget(numericValue > 1000000 ? 1000000 : numericValue);
  };

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header 
        title="예산설정" 
        canGoBack={true} 
        onBackPress={() => {}} 
        onMenuPress={() => {}} 
      />

      <Content>
        <Title>예산설정</Title>

        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={1000000}
          step={1000}
          value={budget}
          onValueChange={(value) => setBudget(value)}
          minimumTrackTintColor="#000000"
          maximumTrackTintColor="#cccccc"
          thumbTintColor="#000000"
        />

        <AmountInput
          value={`${formatCurrency(budget)}원`}
          onChangeText={handleTextChange}
          keyboardType="numeric"
        />

        <Notice>*따로 설정하지 않으면 계속 이 가격으로 예산이 정해집니다.</Notice>

        <AdBox>
          <AdText>대충광고</AdText>
        </AdBox>
      </Content>
    </Container>
  );
}

const Container = styled(KeyboardAvoidingView)`
  flex: 1;
  background-color: #fff;
`;

const Content = styled.View`
  flex: 1;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
`;

const AmountInput = styled.TextInput`
  font-size: 20px;
  text-align: center;
  margin-top: 10px;
  border-bottom-width: 1px;
  border-color: #ccc;
  padding: 5px 0;
`;

const Notice = styled.Text`
  font-size: 12px;
  color: #555;
  text-align: center;
  margin-top: 10px;
`;

const AdBox = styled.View`
  height: 100px;
  border-width: 1px;
  border-color: #000;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
`;

const AdText = styled.Text`
  font-size: 16px;
`;
