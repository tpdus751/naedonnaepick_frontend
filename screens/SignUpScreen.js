// screens/SignUpScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import Header from '../components/Header';

export default function SignUpScreen({ navigation }) {
  const [step, setStep] = useState(1);

  // 개인정보 입력 상태
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 선호도 입력 상태
  const preferenceTags = [
    '매운맛', '가성비', '친절함', '청결함', '분위기', '양 많음', '맛집',
    '웨이팅 있음', '달콤함', '짭짤함', '고소함', '신선함', '혼밥 가능', '트렌디함', '주차 편의성'
  ];
  const [preferences, setPreferences] = useState(
    preferenceTags.reduce((acc, tag) => {
      acc[tag] = 3;
      return acc;
    }, {})
  );

  const handlePreferenceChange = (tag, value) => {
    setPreferences(prev => ({
      ...prev,
      [tag]: value
    }));
  };

  const handleNext = () => {
    if (!firstName || !lastName || !nickname || !email || !password) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      alert('이름은 영어로 입력해야 합니다.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      alert('비밀번호는 영문자와 숫자를 포함한 8자 이상이어야 합니다.');
      return;
    }

    setStep(2);
  };

  const handleSubmit = () => {
    console.log({
      firstName,
      lastName,
      nickname,
      email,
      password,
      preferences
    });
    alert('회원가입이 완료되었습니다!');
    navigation.navigate('MyPage');
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
          <>
            <Text style={styles.title}>개인정보 입력</Text>

            <View style={styles.nameContainer}>
              <TextInput
                placeholder="성"
                value={firstName}
                onChangeText={setFirstName}
                style={[styles.input, { width: '48%' }]} // width를 48%로 설정하여 간격 좁힘
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TextInput
                placeholder="이름"
                value={lastName}
                onChangeText={setLastName}
                style={[styles.input, { width: '48%' }]} // width를 48%로 설정하여 간격 좁힘
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TextInput
              placeholder="닉네임"
              value={nickname}
              onChangeText={setNickname}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              placeholder="이메일"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              placeholder="비밀번호"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>다음</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>선호도 선택</Text>

            {preferenceTags.map((tag) => (
              <View key={tag} style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>{tag}</Text>
                <View style={styles.scoreContainer}>
                  {[1, 2, 3, 4, 5].map(score => (
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
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
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
