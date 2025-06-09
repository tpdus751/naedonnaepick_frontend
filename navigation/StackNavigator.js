// navigation/StackNavigator.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';


// 화면 컴포넌트 import
import BudgetScreen from '../screens/BudgetScreen';
import BudgetSetting from '../screens/BudgetSetting';
import BudgetDetail from '../screens/BudgetDetail';
import SignUpScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/MainLoginPage'; 
import RestaurantListScreen from '../screens/RestaurantListScreen';
import RestaurantDetailScreen from '../screens/RestaurantDetailScreen';
import ChatroomScreen from '../screens/ChatroomScreen';
import NearbyListScreen from '../screens/NearByListScreen';
import SearchResultScreen from '../screens/SearchResultScreen';

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
      <Stack.Screen name="BudgetDetail" component={BudgetDetail} />

      <Stack.Screen name="SignUp" component={SignUpScreen} />

      <Stack.Screen name="LoginMain" component={LoginScreen} />

      <Stack.Screen name="RestaurantListScreen" component={RestaurantListScreen} />

      <Stack.Screen name="RestaurantDetailScreen" component={RestaurantDetailScreen} />

      <Stack.Screen name="ChatroomScreen" component={ChatroomScreen} />

      <Stack.Screen name="SearchResultScreen" component={SearchResultScreen} />

      <Stack.Screen name="NearbyListScreen" component={NearbyListScreen} />
      
    </Stack.Navigator>
  );
}