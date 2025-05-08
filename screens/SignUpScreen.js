// screens/SignUpScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import Header from '../components/Header';

export default function SignUpScreen({ navigation }) {
  const [step, setStep] = useState(1); // 현재 단계 (1: 개인정보 입력, 2: 선호도 선택)

  // 개인정보 입력 상태
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // 선호도 입력 상태 (1~5점)
  const preferenceTags = [
    '매운맛', '가성비', '친절함', '청결함', '분위기', '양 많음', '맛집',
    '웨이팅 있음', '달콤함', '짭짤함', '고소함', '신선함', '혼밥 가능', '트렌디함', '주차 편의성'
  ];
  const [preferences, setPreferences] = useState(
    preferenceTags.reduce((acc, tag) => {
      acc[tag] = 3; // 기본값 3점
      return acc;
    }, {})
  );

  // 선호도 점수 조절
  const handlePreferenceChange = (tag, value) => {
    setPreferences(prev => ({
      ...prev,
      [tag]: value
    }));
  };

  // 개인정보 입력 완료 후 다음 단계
  const handleNext = () => {
    if (name && birth && phone && email && address) {
      setStep(2);
    } else {
      alert('모든 항목을 입력해주세요.');
    }
  };

  // 회원가입 완료 처리
  const handleSubmit = () => {
    // 여기서 서버로 회원가입 정보 전송하거나 저장하는 로직 작성 가능
    console.log({
      name, birth, phone, email, address, preferences
    });
    alert('회원가입이 완료되었습니다!');
    navigation.navigate('LoginMain'); // 회원가입 끝나면 로그인 메인 페이지로 이동
  };

  return (
    <Container>
      <Header 
        title="회원가입" 
        canGoBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {step === 1 ? (
          // 개인정보 입력 화면
          <>
            <Text style={styles.title}>개인정보 입력</Text>

            <TextInput
              placeholder="이름"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="생년월일 (YYYY-MM-DD)"
              value={birth}
              onChangeText={setBirth}
              style={styles.input}
            />
            <TextInput
              placeholder="전화번호"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
            />
            <TextInput
              placeholder="이메일"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
            />
            <TextInput
              placeholder="주소"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
            />

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>다음</Text>
            </TouchableOpacity>
          </>
        ) : (
          // 선호도 선택 화면
          <>
            <Text style={styles.title}>선호도 선택</Text>

            {preferenceTags.map((tag) => (
              <View key={tag} style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>{tag}</Text>
                <View style={styles.scoreContainer}>
                  {[1,2,3,4,5].map(score => (
                    <TouchableOpacity
                      key={score}
                      style={[
                        styles.scoreButton,
                        preferences[tag] === score && styles.selectedScoreButton
                      ]}
                      onPress={() => handlePreferenceChange(tag, score)}
                    >
                      <Text style={styles.scoreText}>{score}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>회원가입 완료</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </Container>
  );
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
`;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  preferenceItem: {
    marginBottom: 20,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedScoreButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  scoreText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
