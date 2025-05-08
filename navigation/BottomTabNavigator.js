// navigation/BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import BudgetScreen from '../screens/BudgetScreen';
import SearchScreen from '../screens/SearchScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
      <Tab.Navigator 
          screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            switch (route.name) {
              case '홈':
                iconName = 'home';
                break;
              case '예산':
                iconName = 'cash-outline';
                break;
              case '음식점':
                iconName = 'restaurant';
                break;
              case '채팅':
                iconName = 'chatbubble-ellipses-outline';
                break;
              case '마이페이지':
                iconName = 'person';
                break;
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="홈" component={HomeScreen} />
        <Tab.Screen name="예산" component={BudgetScreen} />
        <Tab.Screen name="음식점" component={SearchScreen} />
        <Tab.Screen name="채팅" component={ChatScreen} />
        <Tab.Screen name="마이페이지" component={ProfileScreen} />
      </Tab.Navigator>
  );
}