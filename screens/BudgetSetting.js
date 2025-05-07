import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Slider from '@react-native-community/slider';

export default function BudgetSettingScreen({ navigation }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStart, setIsStart] = useState(true);
  const [budget, setBudget] = useState(100000);

  // 날짜 포맷 함수
  const formatDate = (date) => {
    return date.toISOString().slice(0, 10);
  };

  // 날짜 선택기 표시
  const showDatePicker = (isStartDate) => {
    setIsStart(isStartDate);
    setDatePickerVisibility(true);
  };

  // 날짜 선택기 숨기기
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // 날짜 선택 완료
  const handleConfirm = (date) => {
    if (isStart) {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>예산정하기</Text>

      <View style={styles.dateRow}>
        <Text style={styles.label}>시작일</Text>
        <TouchableOpacity onPress={() => showDatePicker(true)}>
          <Text style={styles.dateBtn}>{formatDate(startDate)}</Text>
        </TouchableOpacity>
        <Text style={styles.label}>종료일</Text>
        <TouchableOpacity onPress={() => showDatePicker(false)}>
          <Text style={styles.dateBtn}>{formatDate(endDate)}</Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <View style={styles.sliderBox}>
        <Text style={styles.label}>예산설정</Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={1000000}
          step={1000}
          value={budget}
          onValueChange={setBudget}
          minimumTrackTintColor="#22315b"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#22315b"
        />
        <Text style={styles.budgetNum}>₩{budget.toLocaleString()}</Text>
      </View>

      <TextInput
        style={styles.input}
        value={budget.toString()}
        onChangeText={(text) => setBudget(Number(text.replace(/[^0-9]/g, '')))}
        keyboardType="numeric"
        placeholder="예산 입력"
      />

      <Text style={styles.notice}>
        * 따로 설정하지 않으면 계속 이 가격으로 예산이 정해집니다.
      </Text>

      <TouchableOpacity
        style={styles.confirmBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.confirmBtnText}>확인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 40 },
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
  label: { fontSize: 15, color: '#444', marginHorizontal: 4 },
  dateBtn: {
    fontSize: 15,
    color: '#22315b',
    backgroundColor: '#e0e4ef',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginHorizontal: 2,
    fontWeight: 'bold',
  },
  sliderBox: { marginBottom: 10 },
  budgetNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22315b',
    textAlign: 'center',
    marginTop: 6,
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
