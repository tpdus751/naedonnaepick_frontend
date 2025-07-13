# 내돈내픽 통합 Readme

## "내돈내픽"
내돈내픽은 내 돈으로 내가 픽(선택)한다. 라는 의미로 이름을 지었습니다.
해당 프로젝트는 한국폴리텍대학 성남캠퍼스 인공지능소프트웨어과의 2학년 1학기 과정 융합 프로젝트의 팀 프로젝트로 진행되었으며,
주요 key-point는 "돈"으로, 기존 많은 음식점 추천 앱들은 가격을 기준으로 음식점을 찾기 어려워 내돈내픽 프로젝트를 고안하였습니다.

## Why Mobile?
그동안 PC 환경의 WEB을 기준으로 프로젝트를 진행하였지만,
다양한 환경의 서비스, 다양한 실무적 수요를 경험해보고자, Mobile 환경으로 Android Studio 에뮬레이터를 활용하여 개발하였습니다.

## 프로젝트 구성원
| 이름      | 역할                | 담당 업무                                                                                                                        |
| ------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **박세연** | 팀장 | - 프로젝트 전체 코드 통합 및 구조 설계<br>- 추천 모델 개발 (Random Forest)<br>- 감성 분석 모델 개발 (KcELECTRA)<br>- 실시간 채팅 기능 구현<br>- 전체 문서화 및 README 관리 |
| **김범준** | 팀원   | - 예산 등록/조회/수정/과거 내역 확인 기능 구현                                                                              |
| **이지수** | 팀원   | - 음식점 정보 조회/추천/검색 기능 구현<br>                                                                           |
| **전가람** | 팀원   | - 회원가입 및 로그인, 마이페이지 기능 구현<br>                                                                    |

## 프로젝트 전체 소요 기간
2025-04 ~ 2025-07

## 내돈내픽 주요 기능
- 가격, 위치, 취향(15가지 취향에 대한 점수)기반 음식점 추천
- 기간별 예산 설정, 관리
- 현재 위치 기반 근처 음식점 확인(좌표기반 거리순, Haversine 공식)
- 음식점 및 메뉴 통합 검색
- 음식점 상세 페이지에서 메뉴 및 먹기 버튼 활성화 (먹기 버튼 클릭 시, 현재 예산에서 차감)
- 사용자 소통을 위한 주제별 채팅 기능(ex. 성남시에서 가장 핫한 음식점은?)
- 음식점이 언급 된 사용자 채팅 감성 분석 후 긍정인 경우 자동 투표 및 투표 결과 시각화

## 기술 스택
| 영역           | 사용 기술                           | 설명                             |
| ------------ | ------------------------------- | ------------------------------ |
| **Frontend** | `React Native`, `Expo`          | 크로스 플랫폼 모바일 앱 개발 (Android)     |
| **Backend**  | `Spring Boot`, `REST API`       | 사용자 관리, 음식점/예산/채팅 기능 제공 API 서버 |
| **DB**       | `AWS RDS`, `MySQL`              | 클라우드 기반 관계형 데이터베이스 운영          |
| **AI 모델**    | `Flask API Server`              | 머신러닝 기반 음식점 추천 및 감성 분석 API 제공  |
|  • 추천 모델     | `Random Forest`                 | 사용자 취향 점수 기반 음식점 추천            |
|  • 감성 분석     | `beomi/KcELECTRA-base-v2022`    | 음식점 리뷰에 대한 감성 분석 (긍정/중립/부정 분류) |
| **데이터 수집**   | `Selenium`, `webdriver_manager` | 네이버 지도 기반 음식점 리뷰 크롤링           |

## 기획 - 문서 작성

### WBS 일정 관리
<img width="1867" height="781" alt="image" src="https://github.com/user-attachments/assets/bbd57afb-a214-468c-850e-7adadffd8c71" />
<img width="914" height="542" alt="image" src="https://github.com/user-attachments/assets/0d169054-2481-4ac9-a953-21e593a876de" /><br>
[내돈내픽_WBS.xlsx](https://github.com/user-attachments/files/21205635/_WBS.xlsx)


### 요구사항 정의서 (SRS)
<img width="1825" height="901" alt="image" src="https://github.com/user-attachments/assets/962b781a-e8ed-421f-968e-f7ce75cc86ce" />
일부 이미지 캡쳐<br>
[내돈내픽_요구사항 명세서.xlsx](https://github.com/user-attachments/files/21205589/_.xlsx)

### 유스케이스 다이어그램
![내돈내픽_유스케이스](https://github.com/user-attachments/assets/67d43e91-a1f6-45aa-ba31-5b301f9af457)

### 아키텍처 - 논리 레벨
<img width="1883" height="727" alt="내돈내픽_아키텍처" src="https://github.com/user-attachments/assets/0e6f837f-1065-498c-af75-413bcc9b0265" />
Monolithic 구조의 아키텍처<br>

### ERD
<img width="1570" height="2212" alt="내돈내픽_ERD" src="https://github.com/user-attachments/assets/c625ecdf-82d4-4660-aadb-4b4d27e3cdb9" />


## 시연 영상

### 회원가입, 로그인, 로그아웃, 마이페이지
https://github.com/user-attachments/assets/63f28a2e-865a-4e58-8b71-6b8a33410ed4



