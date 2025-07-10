import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, SafeAreaView,
  ScrollView, TouchableOpacity, Modal
} from 'react-native';
import Header from '../components/Header';
import SideMenuDrawer from '../components/SideMenuDrawer';
import api from '../services/api';
import useUserStore from '../store/userStore';

export default function UserPastBudgetList({ route, navigation }) {
  const { budgetNo } = route.params;
  const { user } = useUserStore();
  const [pastBudgets, setPastBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuVisible, setMenuVisible] = useState(false);

  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAllBudgets = async () => {
      if (!user?.email) return;

      try {
        const response = await api.post('api/budget/all', {
          email: user.email,
        });

        const allBudgets = response.data;
        const filtered = allBudgets.filter(b => b.budget.budgetNo !== budgetNo);
        setPastBudgets(filtered);
      } catch (error) {
        console.error('❌ 전체 예산 조회 실패:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBudgets();
  }, [user, budgetNo]);

  const openModalWithTransactions = (transactions) => {
    setSelectedTransactions(transactions);
    setShowModal(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="과거 예산 기록" canGoBack onMenuPress={() => setMenuVisible(true)} />
      <SideMenuDrawer
        isVisible={isMenuVisible}
        onClose={() => setMenuVisible(false)}
        onLoginPress={() => navigation.navigate('LoginMain')}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#22315b" style={{ marginTop: 40 }} />
      ) : pastBudgets.length > 0 ? (
        <ScrollView contentContainerStyle={styles.container}>
          {pastBudgets.map((item, idx) => {
            const b = item.budget;
            const transactions = item.spendingList || [];

            return (
              <View key={idx} style={styles.budgetCard}>
                <Text style={styles.period}>📅 {b.startDate.slice(0, 10)} ~ {b.endDate.slice(0, 10)}</Text>
                <Text style={styles.budgetAmount}>
                  초기 예산: {(b.totalBudget ?? 0).toLocaleString()}원
                </Text>

                <View style={styles.transactionBox}>
                  <Text style={styles.sectionTitle}>📜 소비 내역</Text>
                  {transactions.length > 0 ? (
                    <>
                      {transactions.slice(0, 3).map((t, index) => (
                        <View key={index} style={styles.transactionCard}>
                          <Text style={styles.transactionLine}>📅 {t.date.slice(0, 10)}</Text>
                          <Text style={styles.transactionLine}>🍽️ {t.restaurantName} - {t.menu}</Text>
                          <Text style={styles.transactionPrice}>💸 {t.price.toLocaleString()}원</Text>
                        </View>
                      ))}
                      {transactions.length > 3 && (
                        <TouchableOpacity
                          style={styles.moreBtn}
                          onPress={() => openModalWithTransactions(transactions)}
                        >
                          <Text style={styles.moreBtnText}>더보기</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  ) : (
                    <Text style={styles.noTransactionText}>소비 내역이 없습니다.</Text>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <Text style={styles.noData}>📌 과거 예산 기록이 없습니다.</Text>
      )}

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <ScrollView style={{ maxHeight: 350, width: '100%' }}>
              {selectedTransactions.map((t, idx) => (
                <View key={idx} style={styles.transactionCard}>
                  <Text style={styles.transactionLine}>📅 {t.date.slice(0, 10)}</Text>
                  <Text style={styles.transactionLine}>🍽️ {t.restaurantName} - {t.menu}</Text>
                  <Text style={styles.transactionPrice}>💸 {t.price.toLocaleString()}원</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)}>
              <Text style={styles.closeBtnText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fafbfe' },
  container: { paddingHorizontal: 24, paddingVertical: 32 },
  budgetCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  period: { fontSize: 15, color: '#666', marginBottom: 8 },
  budgetAmount: { fontSize: 18, fontWeight: '600', color: '#3e4a89', marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '600', marginBottom: 10, color: '#333' },
  transactionBox: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eee',
  },
  transactionCard: {
    backgroundColor: '#fdfdfd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionLine: { fontSize: 15, color: '#333', marginBottom: 2 },
  transactionPrice: { fontSize: 15, color: '#2b72e8', fontWeight: 'bold' },
  moreBtn: { alignSelf: 'flex-end', marginTop: 6 },
  moreBtnText: { color: '#5a5a5a', fontWeight: 'bold' },
  noTransactionText: { textAlign: 'center', color: '#999', fontSize: 14 },
  noData: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#888' },
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
});
