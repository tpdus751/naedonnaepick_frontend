// navigation/StackNavigator.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';


// 화면 컴포넌트 import
import BudgetScreen from '../screens/BudgetScreen';
import BudgetSetting from '../screens/BudgetSetting';
import UserPastBudgetList from '../screens/UserPastBudgetList';
import SignUpScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/MainLoginPage'; 
import RestaurantListScreen from '../screens/RestaurantListScreen';
import RestaurantDetailScreen from '../screens/RestaurantDetailScreen';
import ChatroomScreen from '../screens/ChatroomScreen';
import NearbyListScreen from '../screens/NearByListScreen';
import SearchResultScreen from '../screens/SearchResultScreen';
import RecommendedResultScreen from '../screens/RecommendedResultScreen';
import HomeScreen from '../screens/HomeScreen';
import BudgetEditScreen from '../screens/BudgetEditScreen';

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

      <Stack.Screen name="UserPastBudgetList" component={UserPastBudgetList} />

      <Stack.Screen name="SignUp" component={SignUpScreen} />

      <Stack.Screen name="LoginMain" component={LoginScreen} />

      <Stack.Screen name="RestaurantListScreen" component={RestaurantListScreen} />

      <Stack.Screen name="RestaurantDetailScreen" component={RestaurantDetailScreen} />

      <Stack.Screen name="ChatroomScreen" component={ChatroomScreen} />

      <Stack.Screen name="SearchResultScreen" component={SearchResultScreen} />

      <Stack.Screen name="NearbyListScreen" component={NearbyListScreen} />

      <Stack.Screen name="RecommendedResultScreen" component={RecommendedResultScreen} />

      <Stack.Screen name="HomeScreen" component={HomeScreen} />

      <Stack.Screen name="BudgetEditScreen" component={BudgetEditScreen} />
      
    </Stack.Navigator>
  );
}