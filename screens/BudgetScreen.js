// BudgetScreen.js (소비내역 모달과 동일한 UI를 메인 화면에도 적용)

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Modal, ScrollView, SafeAreaView, Alert, RefreshControl
} from 'react-native';
import axios from 'axios';
import Header from '../components/Header';
import SideMenuDrawer from '../components/SideMenuDrawer';
import useUserStore from '../store/userStore';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

export default function BudgetScreen({ navigation }) {
  const { user } = useUserStore();
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const isTodayWithinRange = (start, end) => {
    const today = new Date().toISOString().slice(0, 10);
    return today >= start.slice(0, 10) && today <= end.slice(0, 10);
  };

  const fetchBudgetData = async () => {
  if (!user || !user.email) return;

  try {
    const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const response = await axios.get('http://192.168.40.14:8080/api/budget/current', {
      params: {
        email: user.email,
        date: today,
      },
    });

    const b = response.data.budget;
    const sList = response.data.spendingList;

    const totalSpent = sList.reduce((sum, s) => sum + s.price, 0);
    const originalBudget = b.totalBudget + totalSpent;

    setBudgetInfo({
      startDate: b.startDate.slice(0, 10),
      endDate: b.endDate.slice(0, 10),
      initialBudget: originalBudget,
      remainingBudget: b.totalBudget,
    });

    setTransactions(
      sList.map((s, idx) => ({
        id: idx.toString(),
        date: s.date.slice(0, 10),
        name: `${s.restaurantName} - ${s.menu}`,
        amount: -s.price,
      }))
    );
  } catch (error) {
    if (error.response?.status === 404) {
      // 예산 없을 때 (예외 상황 대응)
      setBudgetInfo(null);
      setTransactions([]);
    } else {
      console.error("❌ 예산 요청 실패:", error.response?.data || error.message);
      Alert.alert('오류', '예산 정보를 불러오는 데 실패했습니다.');
    }
  }
};


  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBudgetData();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [user])
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="내돈내픽" canGoBack={false} onMenuPress={() => setMenuVisible(true)} />
      <SideMenuDrawer
        isVisible={isMenuVisible}
        onClose={() => setMenuVisible(false)}
        onLoginPress={() => navigation.navigate('LoginMain')}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Text style={styles.title}>💰 현재 예산 현황</Text>
        {budgetInfo ? (
          <View style={styles.budgetCard}>
            <Text style={styles.period}>📅 {budgetInfo.startDate} ~ {budgetInfo.endDate}</Text>
            <Text style={styles.budgetAmount}>총예산: {budgetInfo.initialBudget.toLocaleString()}원</Text>
            <Text style={styles.budgetRemain}>남은금액: {budgetInfo.remainingBudget.toLocaleString()}원</Text>
          </View>
        ) : (
          <Text style={styles.noBudget}>📌 오늘 날짜에 해당하는 예산이 없습니다.</Text>
        )}

        <View style={styles.transactionBox}>
          <Text style={styles.sectionTitle}>📜 소비 내역</Text>
          {transactions.length > 0 ? (
            <>
              {transactions.slice(0, 3).map(item => (
                <View key={item.id} style={styles.transactionCard}>
                  <Text style={styles.transactionLine}>📅 {item.date}</Text>
                  <Text style={styles.transactionLine}>🍽️ {item.name}</Text>
                  <Text style={styles.transactionPrice}>💸 {item.amount.toLocaleString()}원</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.moreBtn} onPress={() => setShowModal(true)}>
                <Text style={styles.moreBtnText}>더보기</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.noTransactionText}>소비 내역이 없습니다.</Text>
          )}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate(budgetInfo ? 'BudgetEdit' : 'BudgetSetting')}
          >
            <Text style={styles.actionBtnText}>{budgetInfo ? '예산수정' : '예산설정'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('BudgetDetail')}
          >
            <Text style={styles.actionBtnText}>과거기록</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showModal} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <ScrollView style={{ maxHeight: 300, width: '100%' }}>
                {transactions.map(item => (
                  <View key={item.id} style={styles.transactionCard}>
                    <Text style={styles.transactionLine}>📅 {item.date}</Text>
                    <Text style={styles.transactionLine}>🍽️ {item.name}</Text>
                    <Text style={styles.transactionPrice}>💸 {item.amount.toLocaleString()}원</Text>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.closeBtnText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fafbfe' },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40, // 여유있게 추가
  },
  title: { fontSize: 24, fontWeight: '700', color: '#22315b', textAlign: 'center', marginBottom: 16 },
  budgetCard: {
    backgroundColor: '#ffffff', padding: 20, borderRadius: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 3 }, elevation: 3,
    marginBottom: 24,
  },
  period: { fontSize: 15, color: '#666', marginBottom: 8 },
  budgetAmount: { fontSize: 18, fontWeight: '600', color: '#3e4a89' },
  budgetRemain: { fontSize: 16, color: '#226666', marginTop: 4 },
  noBudget: { fontSize: 16, color: '#999', textAlign: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '600', marginBottom: 10, color: '#333' },
  transactionBox: {
    backgroundColor: '#fff', padding: 16, borderRadius: 14, marginBottom: 30,
    shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  transactionCard: {
    backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 12,
    borderWidth: 1, borderColor: '#ddd', width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
    elevation: 2,
  },
  transactionLine: { fontSize: 15, color: '#333', marginBottom: 2 },
  transactionPrice: { fontSize: 15, color: '#2b72e8', fontWeight: 'bold' },
  moreBtn: { alignSelf: 'flex-end', marginTop: 10 },
  moreBtnText: { color: '#5a5a5a', fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  actionBtn: {
    backgroundColor: '#dfe4f2', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10,
    minWidth: 120, alignItems: 'center',
  },
  actionBtnText: { color: '#22315b', fontSize: 16, fontWeight: '600' },
  modalBackground: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '85%', alignItems: 'center',
  },
  closeBtn: {
    marginTop: 20, backgroundColor: '#e0e4ef', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10,
  },
  closeBtnText: { color: '#22315b', fontWeight: 'bold', fontSize: 16 },
  noTransactionText: { textAlign: 'center', color: '#999', fontSize: 15, marginTop: 12 },
});