// screens/SignUpScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);

  // 1단계: 개인정보
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 2단계: 선호도 점수
  const preferenceTags = [
    'valueForMoney','largePortions','kindness','cleanliness','atmosphere','soloDining','tasty',
    'trendy','parking','waiting','freshness','spicy','salty','sweet','savory'
  ];
  const [preferences, setPreferences] = useState(
    preferenceTags.reduce((acc, tag) => ({ ...acc, [tag]: 3 }), {})
  );

  const handlePreferenceChange = (tag, value) => {
    setPreferences(prev => ({ ...prev, [tag]: value }));
  };

  const handleNext = () => {
    if (!first_name || !last_name || !nickname || !email || !password) {
      Alert.alert('모든 항목을 입력해주세요.');
      return;
    }
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(first_name) || !nameRegex.test(last_name)) {
      Alert.alert('이름은 영어로 입력해야 합니다.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('유효한 이메일 주소를 입력해주세요.');
      return;
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert('비밀번호는 영문자와 숫자를 포함한 8자 이상이어야 합니다.');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    const payload = {
      email,
      password,
      first_name,
      last_name,
      nickname,
      preferences   // JSON object of tag→score
    };

    try {
      const res = await fetch('http://172.31.57.26:8080/api/users/register', {
        // 에뮬레이터를 쓰고있으니까 10.0.2.2 로 로컬 호스트에 접근해야 됨
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || `HTTP ${res.status}`);
      }

      Alert.alert('회원가입이 완료되었습니다!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginMain', params: { welcome: true } }],
      });
    } catch (e) {
      console.error(e);
      Alert.alert('회원가입 실패', e.message);
    }
  };

  return (
    <Container>
      <Header
        title="회원가입"
        canGoBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {step === 1 ? (
          <>
            <Text style={styles.title}>개인정보 입력</Text>
            <View style={styles.nameContainer}>
              <TextInput
                placeholder="성"
                value={first_name}
                onChangeText={setFirstName}
                style={[styles.input, { width: '48%' }]}
                autoCapitalize="none"
              />
              <TextInput
                placeholder="이름"
                value={last_name}
                onChangeText={setLastName}
                style={[styles.input, { width: '48%' }]}
                autoCapitalize="none"
              />
            </View>
            <TextInput
              placeholder="닉네임"
              value={nickname}
              onChangeText={setNickname}
              style={styles.input}
              autoCapitalize="none"
            />
            <TextInput
              placeholder="이메일"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
              autoCapitalize="none"
            />
            <TextInput
              placeholder="비밀번호"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>다음</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>선호도 선택</Text>
            {preferenceTags.map(tag => (
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
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
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
    marginTop: 10,
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
