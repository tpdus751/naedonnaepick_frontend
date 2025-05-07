import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView, SafeAreaView } from 'react-native';
import Header from '../components/Header'; // 헤더 컴포넌트 임포트
import SideMenuDrawer from '../components/SideMenuDrawer';

export default function BudgetScreen({ navigation }) {
  const [budgetInfo] = useState({
    startDate: '2025-04-14',
    endDate: '2025-04-20',
    initialBudget: 130000,
    remainingBudget: 15000,
  });

  // 거래내역이 많을 때 스크롤 확인용 더미 데이터
  const [transactions] = useState([
    { id: '1', date: '25-04-14', name: '스타벅스', amount: -10000 },
    { id: '2', date: '25-04-14', name: '맥도날드', amount: -8000 },
    { id: '3', date: '25-04-15', name: '편의점', amount: -3000 },
    { id: '4', date: '25-04-16', name: '분식집', amount: -2000 },
    { id: '5', date: '25-04-16', name: '카페', amount: -4000 },
    { id: '6', date: '25-04-17', name: '편의점', amount: -3000 },
    { id: '7', date: '25-04-18', name: '분식집', amount: -2000 },
    { id: '8', date: '25-04-19', name: '카페', amount: -4000 },
    { id: '9', date: '25-04-20', name: '편의점', amount: -3000 },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [isMenuVisible, setMenuVisible] = useState(false);
  

  return (
    <SafeAreaView style={styles.safe}>
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

      <View style={styles.container}>

        <Text style={styles.title}>현재예산</Text>
        <Text style={styles.period}>
          시작일: {budgetInfo.startDate} ~ 종료일: {budgetInfo.endDate}
        </Text>
        <Text style={styles.budgetInfo}>
          설정금액: {budgetInfo.initialBudget.toLocaleString()}원  남은예산: {budgetInfo.remainingBudget.toLocaleString()}원
        </Text>

        {/* 거래내역 박스 (더 크게 & 스크롤) */}
        <View style={styles.transactionBox}>
          <FlatList
            data={transactions}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Text style={styles.transactionItem}>
                {item.date} {item.name} {item.amount.toLocaleString()}원
              </Text>
            )}
            style={{ flexGrow: 0 }}
            contentContainerStyle={{ paddingBottom: 4 }}
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
          />
          <TouchableOpacity style={styles.moreBtn} onPress={() => setShowModal(true)}>
            <Text style={styles.moreBtnText}>더보기</Text>
          </TouchableOpacity>
        </View>

        {/* 버튼 영역(동일한 크기, 간격) */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('BudgetSetting')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionBtnText}>예산설정</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Detail')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionBtnText}>과거기록</Text>
          </TouchableOpacity>
        </View>

        {/* 거래내역 전체 모달 (스크롤 가능) */}
        <Modal visible={showModal} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <ScrollView style={{ maxHeight: 350 }}>
                {transactions.map(item => (
                  <Text key={item.id} style={styles.transactionItem}>
                    {item.date} {item.name} {item.amount.toLocaleString()}원
                  </Text>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.closeBtnText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
    color: '#222',
  },
  period: {
    fontSize: 15,
    color: '#444',
    marginBottom: 3,
    textAlign: 'center',
  },
  budgetInfo: {
    fontSize: 15,
    color: '#444',
    marginBottom: 18,
    textAlign: 'center',
  },
  transactionBox: {
    backgroundColor: '#f5f5f7',
    borderRadius: 12,
    padding: 14,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    minHeight: 180,
    maxHeight: 250, // 더 크게!
  },
  transactionItem: {
    fontSize: 15,
    color: '#222',
    marginVertical: 2,
    letterSpacing: -0.5,
  },
  moreBtn: {
    alignSelf: 'flex-end',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  moreBtnText: {
    color: '#757575',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginTop: 4,
  },
  actionBtn: {
    backgroundColor: '#e0e4ef',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 8,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#bfc8e0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
    minWidth: 120,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#22315b',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxHeight: '70%',
    alignItems: 'center',
  },
  closeBtn: {
    marginTop: 18,
    backgroundColor: '#e0e4ef',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeBtnText: {
    color: '#22315b',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
