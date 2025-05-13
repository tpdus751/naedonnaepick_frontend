import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import Header from '../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import SideMenuDrawer from '../components/SideMenuDrawer';

export default function BudgetSettingScreen() {
  const navigation = useNavigation();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [budget, setBudget] = useState(100000);
  const [isMenuVisible, setMenuVisible] = useState(false);

  const formatDate = (date) => {
    return date.toISOString().slice(0, 10);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
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

      <View style={styles.container}>
        <Text style={styles.title}>예산설정</Text>
        <View style={styles.dateRow}>
          <Text style={styles.label}>시작일</Text>
          <TouchableOpacity onPress={() => setShowStartPicker(true)}>
            <Text style={styles.dateBtn}>{formatDate(startDate)}</Text>
          </TouchableOpacity>
          <Text style={styles.label}>종료일</Text>
          <TouchableOpacity onPress={() => setShowEndPicker(true)}>
            <Text style={styles.dateBtn}>{formatDate(endDate)}</Text>
          </TouchableOpacity>
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);
              if (event.type === 'set' && selectedDate) {
                setStartDate(selectedDate);
                if (selectedDate > endDate) {
                  setEndDate(selectedDate);
                }
              }
            }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndPicker(false);
              if (event.type === 'set' && selectedDate) {
                if (selectedDate < startDate) {
                  alert("종료일은 시작일보다 늦어야 합니다.");
                } else {
                  setEndDate(selectedDate);
                }
              }
            }}
          />
        )}

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
          onChangeText={text => setBudget(Number(text.replace(/[^0-9]/g, '')))}
          keyboardType="numeric"
          placeholder="예산 입력"
        />

        <Text style={styles.notice}>
          * 따로 설정하지 않으면 계속 이 가격으로 예산이 정해집니다.
        </Text>

        <TouchableOpacity style={styles.confirmBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.confirmBtnText}>확인</Text>
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
  sliderBox: {
    marginBottom: 10,
  },
  budgetNum: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
  },
  notice: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmBtn: {
    backgroundColor: '#22315b',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
