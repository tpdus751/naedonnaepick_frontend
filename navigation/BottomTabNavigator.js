import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import useUserStore from '../store/userStore';
import { useNavigation } from '@react-navigation/native';

// 🔽 여기가 중요
import HomeScreen from '../screens/HomeScreen';
import BudgetScreen from '../screens/BudgetScreen';
import RecommendationScreen from '../screens/RecommendationScreen';
import ChatScreen from '../screens/ChatScreen';
import MyPageScreen from '../screens/MyPageScreen';

export default function BottomTabNavigator() {
  const { user } = useUserStore();
  const navigation = useNavigation();

  // 로그인 여부에 따라 막아야 할 스크린들
  const requireLogin = ['예산', '채팅', '마이페이지'];
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case '홈': iconName = 'home'; break;
            case '예산': iconName = 'cash-outline'; break;
            case '음식점': iconName = 'restaurant'; break;
            case '채팅': iconName = 'chatbubble-ellipses-outline'; break;
            case '마이페이지': iconName = 'person'; break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="홈" component={HomeScreen} />
      <Tab.Screen
        name="예산"
        component={user ? BudgetScreen : DummyScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!user) {
              e.preventDefault(); // 기본 이동 막기
              navigation.navigate('LoginMain');
            }
          },
        })}
      />
      <Tab.Screen name="음식점" component={RecommendationScreen} />
      <Tab.Screen
        name="채팅"
        component={user ? ChatScreen : DummyScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              navigation.navigate('LoginMain');
            }
          },
        })}
      />
      <Tab.Screen
        name="마이페이지"
        component={user ? MyPageScreen : DummyScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              navigation.navigate('LoginMain');
            }
          },
        })}
      />
    </Tab.Navigator>
  );
}

// 로그인하지 않은 경우 탭 클릭 시 화면은 Dummy로 설정
const DummyScreen = () => null;
