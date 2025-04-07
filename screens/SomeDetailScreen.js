// screens/SomeDetailScreen.js
import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import styled from 'styled-components/native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';


export default function SomeDetailScreen() {

    const navigation = useNavigation();

  return (
    <Container>
    <Header 
    title="내돈내픽"  
        canGoBack={true}
        onBackPress={() => navigation.goBack()}
        onMenuPress={() => Alert.alert('메뉴 버튼 클릭')}
    />
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>상세 화면이에요!</Text>
    </View>
    </Container>
  );
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
  padding: 20px;
`;