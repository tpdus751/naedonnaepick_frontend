import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import SideMenuDrawer from '../components/SideMenuDrawer';
import axios from 'axios';
import moment from 'moment';

export default function ChatRoomScreen() {
  const route = useRoute();
  const { roomNo, title } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [client, setClient] = useState(null);
  const nickname = '세연1234';
  const email = 'seyeon@naver.com';
  const navigation = useNavigation();

  useEffect(() => {
    axios.get(`http://172.31.57.26:8080/api/chat/history/${roomNo}`)
      .then((response) => {
        const sortedMessages = response.data.sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));
        setMessages(sortedMessages);
      })
      .catch((error) => console.error('채팅 내역 불러오기 실패:', error));

    const socket = new SockJS('http://172.31.57.26:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stompClient.subscribe(`/topic/chatroom/${roomNo}`, (msg) => {
          const received = JSON.parse(msg.body);
          setMessages((prev) => [...prev, received]);
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
      const messagePayload = {
        room_no: roomNo,
        email: email,
        nickname: nickname,
        content: input.trim(),
      };
      client.publish({
        destination: `/app/chat/send/${roomNo}`,
        body: JSON.stringify(messagePayload),
      });
      setInput('');
    }
  };

  const renderItem = ({ item, index }) => {
    const isMine = item.email === email;
    const sender = isMine ? nickname : item.nickname || item.email;
    const content = item.content || item;
    const time = moment(item.sent_at).format('HH:mm');

    const showDateSeparator = index === 0 || !moment(item.sent_at).isSame(messages[index - 1].sent_at, 'day');

    return (
      <View>
        {showDateSeparator && (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateText}>{moment(String(item.sent_at)).format('YYYY년 MM월 DD일')}</Text>
          </View>
        )}
        <View style={[styles.messageContainer, isMine ? styles.myMessage : styles.otherMessage]}>
          {isMine && <Text style={styles.timeLeft}>{time}</Text>}
          <View style={[styles.bubble, isMine ? styles.myBubble : styles.otherBubble]}>
            <Text style={styles.messageText}>{content}</Text>
          </View>
          {!isMine && <Text style={styles.timeRight}>{time}</Text>}
        </View>
      </View>
    );
  };

  const [isMenuVisible, setMenuVisible] = useState(false);

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
        onLoginPress={() => navigation.navigate('LoginMain')}
      />
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
  safe: { flex: 1, backgroundColor: '#f0f0f0' },
  titleContainer: { paddingVertical: 12, paddingHorizontal: 20, backgroundColor: '#e9e9e9', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc' },
  titleText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  chatContainer: { padding: 10 },
  messageContainer: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 5 },
  myMessage: { justifyContent: 'flex-end' },
  otherMessage: { justifyContent: 'flex-start' },
  bubble: { padding: 10, borderRadius: 12, maxWidth: '80%' },
  myBubble: { backgroundColor: '#007bff', borderTopRightRadius: 0 },
  otherBubble: { backgroundColor: '#e0e0e0', borderTopLeftRadius: 0 },
  messageText: { color: '#fff' },
  timeLeft: { fontSize: 10, color: '#555', marginRight: 5, alignSelf: 'flex-end' },
  timeRight: { fontSize: 10, color: '#555', marginLeft: 5, alignSelf: 'flex-end' },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ddd' },
  textInput: { flex: 1, height: 40, paddingHorizontal: 10, backgroundColor: '#f9f9f9', borderRadius: 20, marginRight: 10 },
  sendButton: { backgroundColor: '#007bff', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
  dateSeparator: { alignItems: 'center', marginVertical: 10 },
  dateText: { fontSize: 12, color: '#888' },
});
