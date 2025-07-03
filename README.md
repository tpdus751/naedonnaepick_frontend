# 🍽️ Naedonnaepick (내돈내픽)

> **머신러닝 기반 개인 맞춤형 음식점 추천 & 예산 관리 앱**

내돈내픽은 **가격대, 위치, 개인 취향**을 종합적으로 고려한 **모바일 음식점 추천 서비스**입니다. 사용자가 설정한 예산과 선호 태그(맛/분위기 등)를 기반으로, 주변 음식점을 추천하고 **실시간 지역 채팅** 및 **예산 소비 관리** 기능을 제공합니다.

이 프로젝트는 **React Native 앱(프론트엔드)**과 **Spring Boot 서버(백엔드)**로 구성된 **4인 팀 프로젝트**이며, 작성자는 **팀장**으로서 핵심 프론트엔드 구현 및 채팅, 추천 기능을 주도적으로 개발하였습니다.

---

## 📌 주요 기능 (Key Features)

1. **맞춤 음식점 추천**
   - 위치, 예산, 태그를 입력하면 머신러닝(Random Forest) 기반 추천 결과를 받아 표시
   - 추천 음식점의 예상 선호도(확률), 거리 등 정보 제공
   - “먹기” 버튼 클릭 시 예산 차감 및 소비 내역 기록

2. **근처 음식점 보기**
   - 사용자의 GPS 기반 현재 위치를 활용하여 거리순 음식점 리스트 제공

3. **예산 관리 및 소비 기록**
   - 월별 식비 예산 설정 및 자동 남은 금액 계산
   - 최근 소비 내역 확인 및 상세 내역 열람 가능

4. **예산에 맞는 메뉴 필터링**
   - 음식점별 메뉴 데이터를 크롤링하여 예산 이내의 메뉴를 강조 표시
   - 약 9,300개 음식점 중 4,600곳의 메뉴/가격 데이터 확보

5. **지역 채팅 기능**
   - 위치 기반 채팅방에서 사용자 간 실시간 소통
   - STOMP + SockJS 기반 WebSocket 채팅 구현
   - 메시지 DB 저장 및 입장 시 과거 기록 로딩

6. **채팅 투표 이벤트**
   - 채팅방 내 투표 기능 제공 (맛집 선정, 모임 장소 투표 등)
   - 실시간 투표 반영 및 결과 하이라이트

7. **간편 회원 인증**
   - 이메일/소셜 로그인(Kakao) 통합
   - JWT 기반 토큰 인증 및 Zustand로 전역 사용자 상태 관리

---

## 🛠️ 기술 스택 (Tech Stack)

| 영역        | 기술                                                |
|-------------|-----------------------------------------------------|
| Frontend    | React Native (Expo), Zustand, JavaScript/TypeScript |
| Backend     | Spring Boot (Spring MVC, JPA), REST API, WebSocket |
| ML Server   | Python Flask, Random Forest, KcELECTRA (감성 분석) |
| Crawling    | Selenium WebDriver, Naver 지도 크롤링              |
| Database    | MySQL (AWS RDS)                                     |
| Infra       | AWS EC2, Flask ML 서버 분리 운영                    |

---

## 📁 폴더 구조 (Folder Structure)

Naedonnaepick/
├── frontend/ # React Native 앱 소스
│ ├── screens/ # 홈, 추천, 예산, 채팅 등 주요 화면
│ ├── components/ # 공통 UI 컴포넌트
│ ├── store/ # Zustand 상태 관리
│ ├── utils/ # API 유틸 등
│ └── App.js # 앱 진입점
├── backend/ # Spring Boot 서버 소스
│ ├── controller/ # REST API 컨트롤러
│ ├── service/ # 비즈니스 로직
│ ├── domain/ # JPA 엔티티 및 Repository
│ └── resources/ # application.yml, 초기 SQL 등

yaml
복사
편집

※ 프론트엔드와 백엔드는 별도 레포지토리로 관리됩니다.

---

## ▶️ 시연 영상 (Demo)

[📽️ 내돈내픽 시연 영상 보러가기](https://your-demo-link.com)  
> 앱 설치 없이 Android 에뮬레이터로 전체 기능 시연 (추천 → 소비 기록 → 채팅 투표)

---

## 🚀 실행 방법 (How to Run)

### 1. 백엔드 서버 실행 (Spring Boot)

```bash
# application.yml 설정 (DB 연결 정보 등)
spring.datasource.url=...
spring.datasource.username=...
spring.datasource.password=...

# 빌드 및 실행
./gradlew bootRun
포트: http://localhost:8080

WebSocket: /ws/chat

추천 기능: Flask 서버 연동 필요

2. 프론트엔드 앱 실행 (React Native)
bash
복사
편집
# 디렉토리 이동
cd frontend/

# 패키지 설치
npm install

# 백엔드 API 주소 설정
# ex) API_BASE_URL = "http://10.0.2.2:8080/api"

# Expo 실행
npx expo start
Android Emulator 또는 Expo Go 앱으로 실행

채팅 기능은 2개 이상 디바이스로 테스트 권장

📊 데이터 & 모델
약 36만 건의 음식점 리뷰 → 감정 분석 라벨링 (긍정/중립/부정)

KcELECTRA 모델 및 감성 분석 결과로 태그 점수 생성

음식점 메뉴 가격 데이터 약 6만 건 수집

🧠 향후 계획
지도 기반 음식점 위치 시각화

채팅 메시지 감성 분석 연동

Kafka 기반 채팅 서버 확장

즐겨찾기 및 푸시 알림 기능 추가

📌 프로젝트 소개
이 프로젝트는 한국폴리텍대학 성남캠퍼스 인공지능소프트웨어과의 팀 프로젝트로 개발되었습니다.
사용자의 예산에 맞춘 추천 기능과 실시간 소통 채팅 기능을 통해 금전적 제약 속에서 최고의 선택을 돕는 앱을 목표로 삼고 있습니다.

👤 팀 구성 및 역할
이름	역할
박세연	팀장, 프론트엔드/채팅/추천 구현
팀원 A	Flask 기반 추천 모델 구현
팀원 B	Spring Boot 예산 관리/DB 연동
팀원 C	네이버 지도 크롤링 및 데이터 정제

📎 참고 링크
🧠 음식점 리뷰 감성 분석 모델

📂 크롤러 코드 (Selenium)
