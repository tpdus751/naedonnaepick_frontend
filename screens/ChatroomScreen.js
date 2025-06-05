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
  const nickname = '가람1234';
  const email = 'garam@naver.com';
  const navigation = useNavigation();

  const [isMenuVisible, setMenuVisible] = useState(false);

  // 신고 모달 상태
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportTarget, setReportTarget] = useState({ nickname: '', email: '', content: '' });
  const [reportReason, setReportReason] = useState('');

  const [reportDetail, setReportDetail] = useState('');


  useEffect(() => {

    axios.get(`http://172.31.57.31:8080/api/chat/history/${roomNo}`)
      .then((response) => {
        const sortedMessages = response.data.sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));
        setMessages(sortedMessages);
      })
      .catch((error) => console.error('채팅 내역 불러오기 실패:', error));

    const socket = new SockJS('http://172.31.57.31:8080/ws');
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

  const openReportModal = (reportedNickname, reportedEmail, messageContent) => {
    setReportTarget({ nickname: reportedNickname, email: reportedEmail, content: messageContent });
    setReportReason('');
    setReportModalVisible(true);
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

        {!isMine && (
          <Text style={styles.senderNickname}>{sender}</Text>
        )}

        <View style={[styles.messageContainer, isMine ? styles.myMessage : styles.otherMessage]}>
          {isMine && <Text style={styles.timeLeft}>{time}</Text>}
          <View style={[styles.bubble, isMine ? styles.myBubble : styles.otherBubble]}>
            <Text style={styles.messageText}>{content}</Text>
          </View>
          {!isMine && (
            <View style={styles.rightActionContainer}>
              <Text style={styles.timeRight}>{time}</Text>
              <TouchableOpacity onPress={() => openReportModal(sender, item.email, content)}>
                <Text style={styles.reportText}>신고</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

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

      {/* 신고 모달 */}
      {reportModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>신고하기</Text>
            <Text style={styles.modalDescription}>
              허위 신고일 경우, 신고자의 서비스 활동이 제한될 수 있으니 신중하게 신고해 주세요.
            </Text>

            {['욕설, 비방, 차별, 혐오', '홍보, 영리목적', '음란, 청소년 유해', '개인 정보 노출, 유포, 거래', '기타'].map((reason) => (
            <TouchableOpacity
              key={reason}
              onPress={() => {
                setReportReason(reason);
                if (reason !== '기타') setReportDetail('');
              }}
              style={[
                styles.radioItemBox,
                reportReason === reason && styles.radioItemBoxSelected
              ]}
            >
              <Text style={{ color: reportReason === reason ? '#007BFF' : '#333', fontWeight: reportReason === reason ? 'bold' : 'normal' }}>
                {reason}
              </Text>
            </TouchableOpacity>
          ))}

          {/* 기타 선택 시 입력칸 보여주기 */}
          {reportReason === '기타' && (
            <>
              <TextInput
                style={styles.detailInput}
                placeholder="신고 사유를 입력해 주세요 (최대 255자)"
                value={reportDetail}
                onChangeText={(text) => {
                  if (text.length <= 255) {
                    setReportDetail(text);
                  }
                }}
                multiline
              />
              <Text style={styles.charCount}>{reportDetail.length} / 255</Text>
            </>
          )}



            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                const finalReason = reportReason === '기타' ? reportDetail.trim() : reportReason;

                if (finalReason.length > 255) {
                  alert('신고 사유는 255자 이내여야 합니다.');
                  return;
                }

                console.log(`신고 대상: ${reportTarget.nickname} - ${reportTarget.email}`);
                console.log(`신고 메시지: ${reportTarget.content}`);
                console.log(`신고 사유: ${finalReason}`);
                setReportModalVisible(false);
              }}
              disabled={!reportReason || (reportReason === '기타' && !reportDetail.trim())}
            >
              <Text style={styles.submitButtonText}>신고</Text>
            </TouchableOpacity>



            <TouchableOpacity onPress={() => setReportModalVisible(false)} style={styles.closeButton}>
              <Text style={{ color: 'red' }}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  senderNickname: { fontSize: 12, color: '#555', marginBottom: 2, marginLeft: 10 },
  rightActionContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 5 },
  reportText: { color: 'red', fontSize: 11, marginLeft: 5 },

  // 모달 스타일
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalDescription: { fontSize: 12, marginBottom: 10, color: '#555' },
  radioItemBox: {
  padding: 12,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  marginVertical: 5,
  backgroundColor: '#f9f9f9',
},
radioItemBoxSelected: {
  borderColor: '#007BFF',
  backgroundColor: '#e6f0ff',
},
detailInput: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 10,
  marginTop: 10,
  backgroundColor: '#f9f9f9',
  textAlignVertical: 'top',
  minHeight: 60,
},

  submitButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: { color: 'white', fontWeight: 'bold' },
  closeButton: { marginTop: 10, alignItems: 'center' },
  charCount: {
  alignSelf: 'flex-end',
  fontSize: 12,
  color: '#888',
  marginTop: 5,
},


});
