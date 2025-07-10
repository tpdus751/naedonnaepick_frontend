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
import { API_BASE_URL } from '../services/config';
import TagPreferenceSection from '../components/TagPreferenceSection'; // ✅ 선호도 UI 컴포넌트

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);

  // 1단계: 개인정보
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 2단계: 태그 점수 상태
  const [tagScores, setTagScores] = useState({
    spicy: 3,
    value_for_money: 3,
    kindness: 3,
    cleanliness: 3,
    atmosphere: 3,
    large_portions: 3,
    tasty: 3,
    waiting: 3,
    sweet: 3,
    salty: 3,
    savory: 3,
    freshness: 3,
    solo_dining: 3,
    trendy: 3,
    parking: 3,
  });

  const handleNext = () => {
    if (!first_name || !last_name || !nickname || !email || !password) {
      Alert.alert('모든 항목을 입력해주세요.');
      return;
    }

    const koreanNameRegex = /^[가-힣]+$/;
    if (!koreanNameRegex.test(first_name) || !koreanNameRegex.test(last_name)) {
      Alert.alert('이름은 한글로 입력해주세요.');
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
      privacy_agreed: 1,
      preferences: tagScores,
    };

    try {
      const res = await fetch(API_BASE_URL + 'api/users/register', {
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
            <TagPreferenceSection
              tagScores={tagScores}
              setTagScores={setTagScores}
            />
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
});
