// navigation/StackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';

import SomeDetailScreen from '../screens/SomeDetailScreen'; // 예시로 추가한 상세 화면
import LoginScreen from '../screens/MainLoginPage'; 
import BudgetSetting from '../screens/BudgetSetting';
// import LoginMainScreen from '../screens/LoginMainScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 첫 화면은 탭 네비게이터로 */}
      <Stack.Screen name="Main" component={BottomTabNavigator} />

      <Stack.Screen name="BudgetSetting" component={BudgetSetting} /> 

      {/* 추가로 Stack 화면을 연결하고 싶을 때 */}
      <Stack.Screen name="Detail" component={SomeDetailScreen} />
      <Stack.Screen name="LoginMain" component={LoginScreen} />
    </Stack.Navigator>
  );
}
