// screens/LoginScreen.js

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>내돈내픽</Text>

      <TextInput
        placeholder="이메일을 입력하세요." //칸에 흐리게 안내 문구 표시
        style={styles.input}
        keyboardType="email-address" //핸드폰 키보드가 이메일 입력에 적합하도록 바뀜
      />

      <TextInput
        placeholder="비밀번호를 입력하세요."
        style={styles.input}
        secureTextEntry        //입력 내용이 ●로 보이게 함
      />

      {/* TouchableOpacity: 눌렀을 때 투명해지는 버튼 역할의 컴포넌트트*/}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>로그인</Text>
      </TouchableOpacity>

      {/* ↓ 지금은 그냥 텍스트인데 추후에 비번찾기 페이지로 이동할 수 있게 할 예정 */}
      <Text style={styles.forgotPassword}>비밀번호 찾기</Text>

      <Text style={styles.orText}>or</Text>

      <TouchableOpacity style={styles.signupButton}>
        <Text style={styles.signupText}>일반 회원가입 하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <View style={styles.socialInner}>
          <Image source={require('../screens/naver-icon.png')} style={styles.icon} />
          <Text style={styles.socialText}>네이버로 로그인하기</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#FAE100' }]}>
        <View style={styles.socialInner}>
          <Image source={require('../screens/kakao-icon.png')} style={styles.icon} />
          <Text style={styles.socialText}>카카오로 로그인하기</Text>
        </View>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 40,
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
    justifyContent: 'center', // 가운데 정렬!
  },
});
