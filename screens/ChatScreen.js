// screens/ChatScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, Alert } from 'react-native';
import styled from 'styled-components/native';
import Header from '../components/Header';
import api from '../services/api'; // ✅ 경로만 확인해 주세요
import { useNavigation } from '@react-navigation/native';
import SideMenuDrawer from '../components/SideMenuDrawer';

export default function ChatroomScreen() {
  const [chatRooms, setChatRooms] = useState([]);
  const navigation = useNavigation();
  const [isMenuVisible, setMenuVisible] = useState(false);

  // 채팅방 목록 조회
  useEffect(() => {
    api.get('api/chat/chatrooms')
      .then(response => {
        console.log('채팅방 목록:', response.data);  // ✅ 목록 출력 추가
        setChatRooms(response.data);
      })
      .catch(error => console.error('채팅방 목록 조회 실패:', error));
  }, []);


  // 채팅방 입장 요청
  const handleEnterRoom = (roomNo, title) => {
    api.post('api/chat/enter', {
      roomNo: roomNo,
      email: 'jisoo@naver.com',  // 실제 사용자 아이디 적용
    })
    .then(response => {
      console.log('입장 성공:', response.data);
      navigation.navigate('ChatroomScreen', { roomNo, title });
    })
    .catch(error => {
      console.error('입장 실패:', error);
      Alert.alert('입장 실패', '채팅방 입장에 실패했습니다.');
    });
  };

  // 리스트 렌더링
  const renderItem = ({ item }) => (
    <ChatRoomCard>
      <RoomTitle>{item.title}</RoomTitle>
      <RoomInfo>현재 인원: {0} / {item.max_person_cnt}</RoomInfo>
      <EnterButton onPress={() => handleEnterRoom(item.room_no, item.title)}>
        <ButtonText>채팅방 입장</ButtonText>
      </EnterButton>
    </ChatRoomCard>
  );

  return (
    <Container>
      <Header 
        title="내돈내픽"
        canGoBack={false}
        onMenuPress={() => setMenuVisible(true)}
      />
      <SideMenuDrawer
                    isVisible={isMenuVisible}
                    onClose={() => setMenuVisible(false)}
                    onLoginPress={() => 
                      navigation.navigate('LoginMain')
                    }
                  />
      <ScreenTitle>성남시 채팅방 목록</ScreenTitle>
      <FlatList
        data={chatRooms}
        keyExtractor={(item, index) => (item.room_no || index).toString()}  // ✅ 수정됨
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

    </Container>
  );
}

// 스타일 정의
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #f0f0f0;
`;

const ScreenTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin: 20px;
  text-align: center;
`;

const ChatRoomCard = styled.View`
  background-color: #fff;
  margin: 10px 20px;
  padding: 16px;
  border-radius: 12px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const RoomTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const RoomInfo = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
`;

const EnterButton = styled(TouchableOpacity)`
  padding: 10px;
  background-color: #007bff;
  border-radius: 8px;
`;

const ButtonText = styled.Text`
  color: #fff;
  text-align: center;
  font-size: 16px;
`;
