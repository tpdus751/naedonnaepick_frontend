import React, { useEffect, useState} from 'react';
import { View, TextInput, FlatList, Text, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header'; // 헤더 컴포넌트 
import SideMenuDrawer from '../components/SideMenuDrawer';

export default function ChatRoomScreen() {
  const route = useRoute();
  const { roomNo, title } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [client, setClient] = useState(null);
  const senderId = 'seyeon'; // 본인 사용자 ID (나중에 실제 사용자 정보로 교체)
  const navigation = useNavigation();
  
  useEffect(() => {
    const socket = new SockJS('http://192.168.25.3:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected');
        stompClient.subscribe(`/topic/chatroom/${roomNo}`, (msg) => {
          const received = JSON.parse(msg.body);
          setMessages(prev => [...prev, received]);
        });
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const sendMessage = () => {
  if (client && input.trim()) {
    const messagePayload = { roomNo, sender: senderId, message: input.trim() };
    client.publish({
      destination: `/app/chat/send/${roomNo}`,
      body: JSON.stringify(messagePayload),
    });
    setInput('');  // ✅ 입력창만 초기화, 리스트는 서버가 처리
  }
};

  const renderItem = ({ item }) => {
    const isMine = item.sender === senderId;
    return (
        <View style={[styles.messageContainer, isMine ? styles.myMessage : styles.otherMessage]}>
        <Text style={styles.sender}>{isMine ? '나' : item.sender}</Text>
        <View style={[styles.bubble, isMine ? styles.myBubble : styles.otherBubble]}>
          <Text style={styles.messageText}>{item.message}</Text>
        </View>
      </View>
    );
  };

  const [isMenuVisible, setMenuVisible] = useState(true);


  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="내돈내픽"
        canGoBack={true}
        onBackPress={() => navigation.goBack()}
        onMenuPress={() => setMenuVisible(true)}
      />
      <SideMenuDrawer
                          isVisible={isMenuVisible}
                          onClose={() => setMenuVisible(false)}
                          onLoginPress={() => 
                          navigation.navigate('LoginMain')
                          }
                        />
      {/* ✅ 채팅방 타이틀 표시 */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{title}</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.chatContainer}
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="메시지를 입력하세요"
            style={styles.textInput}
            multiline={false}
            numberOfLines={1}
            blurOnSubmit={true}
            returnKeyType="send"
          />

          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>전송</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f0f0' }, // ✅ SafeAreaView 스타일 추가
  titleContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#e9e9e9',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  chatContainer: { padding: 10 },
  messageContainer: { marginVertical: 5 },
  myMessage: { alignItems: 'flex-end' },
  otherMessage: { alignItems: 'flex-start' },
  sender: { fontSize: 12, color: '#555', marginBottom: 2 },
  bubble: { padding: 10, borderRadius: 12, maxWidth: '80%' },
  myBubble: { backgroundColor: '#007bff', borderTopRightRadius: 0 },
  otherBubble: { backgroundColor: '#e0e0e0', borderTopLeftRadius: 0 },
  messageText: { color: '#fff' },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  textInput: {
    flex: 1,
    height: 40,              // ✅ 높이 고정
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    marginRight: 10,
  },

  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
