import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Alert
} from 'react-native';
import api from '../services/api';
import Header from '../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import SideMenuDrawer from '../components/SideMenuDrawer';
import useUserStore from '../store/userStore';

export default function BudgetEditScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useUserStore();

  const {
    startDate: passedStart,
    endDate: passedEnd,
    remainingBudget,
    budgetNo,
  } = route.params || {};

  useEffect(() => {
    console.log("💡넘겨받은 remainingBudget:", remainingBudget);
  }, []);

  const [startDate] = useState(passedStart ? new Date(passedStart) : new Date());
  const [endDate] = useState(passedEnd ? new Date(passedEnd) : new Date());
  const [budget, setBudget] = useState(0);
  const [isMenuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    if (remainingBudget !== undefined) {
      setBudget(remainingBudget);
    }
  }, [remainingBudget]);

  const formatDate = (date) => date.toISOString().slice(0, 10);

  const submitUpdate = async () => {
    try {
      let adjustmentType = null;
      if (budget > remainingBudget) {
        adjustmentType = "추가";
      } else if (budget < remainingBudget) {
        adjustmentType = "차감";
      }

      const payload = {
        totalBudget: budget,
        budgetNo: budgetNo,
        remainingBudget: remainingBudget
      };

      if (adjustmentType) {
        payload.restaurantName = "수정";
        payload.menu = adjustmentType;
      }

      const res = await api.put('/api/budget/update', payload);

      if (res.status === 200) {
        Alert.alert('성공', '예산이 수정되었습니다.');
        navigation.goBack();
      } else {
        Alert.alert('오류', '예산 수정 중 문제가 발생했습니다.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('오류', '서버와 통신 중 문제가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header
        title="예산 수정"
        canGoBack={true}
        onBackPress={() => navigation.goBack()}
        onMenuPress={() => setMenuVisible(true)}
      />
      <SideMenuDrawer
        isVisible={isMenuVisible}
        onClose={() => setMenuVisible(false)}
        onLoginPress={() => navigation.navigate('LoginMain')}
      />
      <View style={styles.container}>
        <Text style={styles.title}>예산 수정</Text>

        <View style={styles.dateRow}>
          <Text style={styles.label}>시작일</Text>
          <View style={styles.disabledDateBox}>
            <Text style={styles.dateText}>{formatDate(startDate)}</Text>
          </View>

          <Text style={styles.label}>종료일</Text>
          <View style={styles.disabledDateBox}>
            <Text style={styles.dateText}>{formatDate(endDate)}</Text>
          </View>
        </View>

        <Text style={styles.label}>예산 입력</Text>
        <TextInput
          style={styles.input}
          value={budget.toString()}
          onChangeText={(text) => {
            const clean = text.replace(/[^0-9]/g, '');
            setBudget(Number(clean));
          }}
          keyboardType="numeric"
          placeholder="예산 입력"
        />

        <Text style={styles.notice}>* 예산 금액만 수정할 수 있습니다.</Text>

        <TouchableOpacity style={styles.confirmBtn} onPress={submitUpdate}>
          <Text style={styles.confirmBtnText}>수정 완료</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#222',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  label: {
    fontSize: 15,
    color: '#444',
    marginHorizontal: 4,
  },
  disabledDateBox: {
    backgroundColor: '#f0f2f5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  dateText: {
    fontSize: 15,
    color: '#999',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bfc8e0',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 12,
    marginBottom: 10,
    textAlign: 'center',
    backgroundColor: '#f5f5f7',
  },
  notice: {
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  confirmBtn: {
    backgroundColor: '#e0e4ef',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#bfc8e0',
  },
  confirmBtnText: {
    color: '#22315b',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: -0.5,
  },
});
