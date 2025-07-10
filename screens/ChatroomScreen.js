// ✅ ChatRoomScreen.jsx (최신 버전 - 자동완성 선택 시 /음식점명 으로 한칸 띄우기 적용)

import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import SideMenuDrawer from '../components/SideMenuDrawer';
import { WS_BASE_URL } from '../services/config';
import api from '../services/api';
import moment from 'moment';
import useUserStore from '../store/userStore';

export default function ChatRoomScreen() {
  const route = useRoute();
  const { roomNo, title } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [client, setClient] = useState(null);
  const { user } = useUserStore();
  const nickname = user?.nickname || '익명';
  const email = user?.email || '';
  const navigation = useNavigation();
  const [userCount, setUserCount] = useState(0);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportTarget, setReportTarget] = useState({ nickname: '', email: '', content: '' });
  const [reportReason, setReportReason] = useState('');
  const [reportDetail, setReportDetail] = useState('');
  const [isRestaurantMode, setIsRestaurantMode] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // ✅ 누락된 선언
  const [selectedRestaurantNo, setSelectedRestaurantNo] = useState(null);
  const [selectedRestaurantName, setSelectedRestaurantName] = useState(null); 
  const [topVotedRestaurants, setTopVotedRestaurants] = useState([]);
  const [topVotedModalVisible, setTopVotedModalVisible] = useState(false); // ✅ TOP 5 모달 여부

  // 👇 ChatRoomScreen 컴포넌트 안에 추가
  const openReportModal = (nickname, email, content) => {
    setReportTarget({ nickname, email, content });
    setReportModalVisible(true);
  };


  useEffect(() => {
    api.get(`api/chat/history/${roomNo}`).then((response) => {
      const sortedMessages = response.data.sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));
      setMessages(sortedMessages);
    });  

    const fetchUserCount = () => {
      api.get(`api/chat/room/${roomNo}/userCount`).then((res) => setUserCount(res.data));
    };
    fetchUserCount();
    const interval = setInterval(fetchUserCount, 5000);

    const socket = new SockJS(WS_BASE_URL);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { roomNo: String(roomNo) },
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
      clearInterval(interval);
      stompClient.deactivate();
      api.post(`api/chat/leave`, { roomNo, email });
    };
  }, []);

  useEffect(() => {
    const today = moment().date(); // 오늘 날짜의 '일'
    if (today === 1) {
      const fetchTopVoted = async () => {
        try {
          const res = await api.get('/api/chat/vote_result', {
            params: { roomNo }
          });
          setTopVotedRestaurants(res.data);
          setTopVotedModalVisible(true); // ✅ 모달 띄우기
        } catch (error) {
          console.error('상위 투표 음식점 조회 실패:', error);
        }
      };

      fetchTopVoted();
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const match = input.match(/\/([^\s]+)/);
      if (match) {
        const query = match[1];
        fetchRestaurantSuggestions(query);
        setIsRestaurantMode(true);
      } else {
        setSuggestions([]);
        setIsRestaurantMode(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [input]);

  const fetchRestaurantSuggestions = async (query) => {
    try {
      const res = await api.get('/api/restaurant/message', { params: { query } });
      setSuggestions(res.data);
    } catch (err) {
      console.error('자동완성 실패:', err);
    }
  };

  const handleInputChange = (text) => {
    setInput(text);
  };

  const handleSuggestionSelect = (name, no) => {
    const newInput = input.replace(/\/[^\s]+/, `/${name} `);
    setInput(newInput);
    setSelectedRestaurantNo(no); // ✅ restaurant_no 저장
    setSelectedRestaurantName(name)
    setIsRestaurantMode(false);
    setSuggestions([]);
  };

  const sendMessage = () => {
    const finalInput = input.trim();
    if (client && finalInput) {
      const match = finalInput.match(/\/(\S+)/);
      const restaurantName = match ? match[1] : null;

      const messagePayload = {
        room_no: roomNo,
        email,
        nickname,
        content: finalInput,
        restaurant_detail: selectedRestaurantNo,
        restaurant_name: selectedRestaurantName
      };
      console.log(messagePayload)
      client.publish({
        destination: `/app/chat/send/${roomNo}`,
        body: JSON.stringify(messagePayload),
      });

      setSelectedRestaurantName(null);
      setSelectedRestaurantNo(null);
      setInput('');
      setIsRestaurantMode(false);
      setSuggestions([]);
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
        {!isMine && <Text style={styles.senderNickname}>{sender}</Text>}

        <View style={[styles.messageContainer, isMine ? styles.myMessage : styles.otherMessage]}>
          {isMine && <Text style={styles.timeLeft}>{time}</Text>}

          {/* ✅ 하이퍼링크 조건 분기 */}
          <View style={[styles.bubble, isMine ? styles.myBubble : styles.otherBubble]}>
            {renderMessageText(item)}
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

  const renderMessageText = (item) => {
    const content = item.content || '';
    const restaurantNo = item.restaurant_detail;
    const restaurantName = item.restaurant_name;

    if (restaurantNo && restaurantName && content.includes(restaurantName)) {
      const parts = content.split(restaurantName);

      return (
        <Text style={styles.messageText}>
          {parts.map((part, idx) => (
            <React.Fragment key={idx}>
              <Text>{part}</Text>
              {idx < parts.length - 1 && (
                <Text
                  style={styles.restaurantUnderline}  // ✅ 여기에만 색상 명시
                  onPress={() =>
                    navigation.navigate('RestaurantDetailScreen', {
                      restaurant: { name: restaurantName, restaurantNo },
                    })
                  }
                >
                  {restaurantName}
                </Text>
              )}
            </React.Fragment>
          ))}
        </Text>
      );
    }

    return <Text style={styles.messageText}>{content}</Text>;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="내돈내픽" canGoBack onBackPress={() => navigation.goBack()} onMenuPress={() => setMenuVisible(true)} />
      <SideMenuDrawer isVisible={isMenuVisible} onClose={() => setMenuVisible(false)} onLoginPress={() => navigation.navigate('LoginMain')} />
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.userCountText}>접속자 수: {userCount}명</Text>
      </View>
      {topVotedModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>📊 지난달 사용자 추천 TOP 5</Text>
            <Text style={styles.modalDescription}>이 채팅방에서 가장 긍정적으로 언급된 음식점이에요.</Text>
            {topVotedRestaurants.map((item, idx) => (
              <View key={idx} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                  {idx + 1}. {item.name} ({item.positiveCount}표)
                </Text>
                <Text style={{ fontSize: 12, color: '#666', marginLeft: 10 }}>
                  📍 {item.address}
                </Text>
              </View>
            ))}
            <TouchableOpacity onPress={() => setTopVotedModalVisible(false)} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <FlatList data={messages} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} contentContainerStyle={styles.chatContainer} />

        {isRestaurantMode && suggestions.length > 0 && (  // ✅ 조건에서 input.startsWith('/') 제거
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.restaurantNo.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSuggestionSelect(item.name, item.restaurantNo)}>
              <Text style={styles.suggestionItem}>
                {item.name.split(new RegExp(`(${input.slice(1)})`, 'gi')).map((part, i) =>
                  part.toLowerCase() === input.slice(1).toLowerCase() ? (
                    <Text key={i} style={styles.highlight}>{part}</Text>
                  ) : <Text key={i}>{part}</Text>
                )}
              </Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionList}
        />
      )}

      <View style={styles.inputContainer}>
        {selectedRestaurant && (
          <View style={styles.restaurantTagBox}>
            <Text style={styles.restaurantTagText}>{selectedRestaurant}</Text>
          </View>
        )}
        <TextInput
          value={input}  // ✅ 항상 input 상태값을 보여주도록 수정
          onChangeText={handleInputChange}
          placeholder="메시지를 입력하세요"
          style={styles.textInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>전송</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>

      {/* 신고 모달 유지 */}
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
                style={[styles.radioItemBox, reportReason === reason && styles.radioItemBoxSelected]}
              >
                <Text style={{ color: reportReason === reason ? '#007BFF' : '#333', fontWeight: reportReason === reason ? 'bold' : 'normal' }}>
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}
            {reportReason === '기타' && (
              <>
                <TextInput
                  style={styles.detailInput}
                  placeholder="신고 사유를 입력해 주세요 (최대 255자)"
                  value={reportDetail}
                  onChangeText={(text) => {
                    if (text.length <= 255) setReportDetail(text);
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
                setReportModalVisible(false);
                api.post('api/chat/report', {
                  reporter_email: email,
                  reported_email: reportTarget.email,
                  reason: finalReason,
                })
                  .then(() => alert('신고가 접수되었습니다.'))
                  .catch((error) => {
                    console.error('신고 실패:', error);
                    alert('신고 처리 중 오류가 발생했습니다.');
                  });
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
  userCountText: { fontSize: 12, color: '#666', marginTop: 4 },
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
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  modalContainer: { width: '80%', backgroundColor: '#fff', borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalDescription: { fontSize: 12, marginBottom: 10, color: '#555' },
  radioItemBox: { padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginVertical: 5, backgroundColor: '#f9f9f9' },
  radioItemBoxSelected: { borderColor: '#007BFF', backgroundColor: '#e6f0ff' },
  detailInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginTop: 10, backgroundColor: '#f9f9f9', textAlignVertical: 'top', minHeight: 60 },
  submitButton: { backgroundColor: 'black', paddingVertical: 10, marginTop: 10, borderRadius: 5, alignItems: 'center' },
  submitButtonText: { color: 'white', fontWeight: 'bold' },
  closeButton: { marginTop: 10, alignItems: 'center' },
  charCount: { alignSelf: 'flex-end', fontSize: 12, color: '#888', marginTop: 5 },
  suggestionList: { position: 'absolute', bottom: 60, width: '100%', maxHeight: 150, backgroundColor: '#fff', zIndex: 10, borderColor: '#ccc', borderWidth: 1 },
  suggestionItem: { padding: 10, fontSize: 15 },
  highlight: { color: '#fff', fontWeight: 'bold' },
  restaurantHighlight: { color: '#007AFF', fontWeight: 'bold' },
  restaurantTagBox: {
  backgroundColor: '#dce0e3',
  borderRadius: 14,
  paddingHorizontal: 8,
  paddingVertical: 4,
  marginRight: 8,
  marginLeft: 5,
  flexShrink: 0
},
restaurantTagText: {
  color: '#333',
  fontSize: 14,
  fontWeight: 'bold'
},
restaurantUnderline: {
  color: 'yellow',              // ✅ 링크용 파란색
  fontWeight: 'bold',
  textDecorationLine: 'underline'
}
});












