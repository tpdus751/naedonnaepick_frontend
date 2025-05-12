// navigation/StackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';


// 화면 컴포넌트 import
import BudgetScreen from '../screens/BudgetScreen';
import BudgetSetting from '../screens/BudgetSetting';
import SomeDetailScreen from '../screens/SomeDetailScreen'; // 상세보기 화면 예시

import LoginScreen from '../screens/MainLoginPage'; 
import RecommendationScreen from '../screens/RecommendationScreen';
import RestaurantListScreen from '../screens/RestaurantListScreen';
import RestaurantDetailScreen from '../screens/RestaurantDetailScreen';
// import LoginMainScreen from '../screens/LoginMainScreen';


const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 첫 화면은 탭 네비게이터 */}
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      {/* 예산설정 메인화면 */}
      <Stack.Screen name="Budget" component={BudgetScreen} />
      {/* 예산정하기(예산설정) 화면 */}
      <Stack.Screen name="BudgetSetting" component={BudgetSetting} />
      {/* 추가로 Stack 화면을 연결하고 싶을 때 */}
      <Stack.Screen name="Detail" component={SomeDetailScreen} />

      <Stack.Screen name="LoginMain" component={LoginScreen} />

      <Stack.Screen name="restaurant" component={RecommendationScreen} />

      <Stack.Screen name="RestaurantListScreen" component={RestaurantListScreen} />

      <Stack.Screen name="RestaurantDetailScreen" component={RestaurantDetailScreen} />

    </Stack.Navigator>
  );
}
