import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import styled from 'styled-components/native';
import useUserStore from '../store/userStore'; // ✅ Zustand import
import { API_BASE_URL } from '../services/config'; // ✅ 주소 import

export default function LoginScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const setUser = useUserStore((state) => state.setUser);
  const setTags = useUserStore((state) => state.setTags);
  const user = useUserStore((state) => state.user);

  const fromSignUp = route.params?.welcome === true;
  const isWelcome = !!user || fromSignUp;

  const handleLogin = async () => {
    if (!emailInput || !passwordInput) {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(API_BASE_URL + 'api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailInput,
          password: passwordInput,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `HTTP ${response.status}`);
      }

      const userData = await response.json();
      setUser(userData.user);
      setTags(userData.tags); // ✅ 상태 저장

      // ✅ 단순히 Main 탭 루트로 reset
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      console.error('로그인 실패', error);
      alert('로그인 실패: ' + error.message);
    }
  };

  return (
    <Container>
      <Header
        title="내돈내픽"
        canGoBack={true}
        onBackPress={() => navigation.goBack()}
        onMenuPress={() => {}}
      />

      <View style={styles.container}>
        <Text style={styles.title}>
          {isWelcome
            ? '환영합니다!'
            : '서비스를 이용하시려면\n로그인이 필요합니다.'}
        </Text>

        <TextInput
          placeholder="이메일을 입력하세요."
          value={emailInput}
          onChangeText={setEmailInput}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="비밀번호를 입력하세요."
          value={passwordInput}
          onChangeText={setPasswordInput}
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>로그인</Text>
        </TouchableOpacity>

        <Text style={styles.forgotPassword}>비밀번호 찾기</Text>
        <Text style={styles.orText}>or</Text>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.signupText}>일반 회원가입 하기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <View style={styles.socialInner}>
            <Image
              source={require('../screens/naver-icon.png')}
              style={styles.icon}
            />
            <Text style={styles.socialText}>네이버로 로그인하기</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: '#FAE100' }]}
        >
          <View style={styles.socialInner}>
            <Image
              source={require('../screens/kakao-icon.png')}
              style={styles.icon}
            />
            <Text style={styles.socialText}>카카오로 로그인하기</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Container>
  );
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
  padding: 20px;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 40,
    lineHeight: 32,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  forgotPassword: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 10,
  },
  orText: {
    textAlign: 'center',
    color: '#aaa',
    marginVertical: 10,
  },
  signupButton: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  signupText: {
    textAlign: 'center',
    color: '#333',
  },
  socialButton: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  socialText: {
    marginLeft: 10,
    color: '#333',
  },
  icon: {
    width: 24,
    height: 24,
  },
  socialInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
  