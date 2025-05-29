import { TAGS } from '../components/TasteSelector'; // TasteSelector.js의 태그 가져오기

export class Restaurant {
  constructor(id, name, description, image, menu, location, priceRange, tags) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.menu = menu; // 메뉴 데이터 추가
    this.location = location; // e.g., "분당구"
    this.priceRange = priceRange; // [minPrice, maxPrice]
    this.tags = tags; // e.g., { 매운맛: 3, 가성비: 4, 친절함: 0, ... }
  }
}

// 모든 태그를 기본값으로 포함하는 함수
const createTags = (customTags = {}) => {
  const defaultTags = TAGS.reduce((acc, tag) => {
    acc[tag] = 0; // 초기값 0으로 설정
    return acc;
  }, {});

  return { ...defaultTags, ...customTags }; // 커스텀 태그로 기본 태그 덮어쓰기
};

// Mock 데이터
export const fetchRestaurants = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        new Restaurant(
          '1',
          '카산도',
          '카츠, 카레, 산도가 맛있는 나만의 섬 카산도입니다.',
          require('../imgs/음식점 1.jpg'), // 음식점 이미지
          [
            { id: '1', name: '카산도 미소카츠 정식', price: '₩15,000', image: require('../imgs/음식점 1 음식 1.jpg') },
            { id: '2', name: '특등심카츠 정식', price: '₩16,000', image: require('../imgs/음식점 1 음식 2.jpg') },
            { id: '3', name: '등심카츠 정식', price: '₩14,000', image: require('../imgs/음식점 1 음식 3.jpg') },
          ],
          '분당구',
          [15000, 20000],
          createTags({ 매운맛: 3, 가성비: 5, 친절함: 3 })
        ),
        new Restaurant(
          '2',
          '돌판 하나',
          '대한민국 상위 1% 지례 흑돼지를 취급하고 있습니다.',
          require('../imgs/음식점 2.jpg'),
          [
            { id: '1', name: '지례흑돼지 오겹살 1인분', price: '₩18,000', image: require('../imgs/음식점 2 음식 1.jpg') },
            { id: '2', name: '지례흑돼지 목살 1인분', price: '₩18,000', image: require('../imgs/음식점 2 음식 2.jpg') },
            { id: '3', name: '지례흑돼지 목전지 1인분', price: '₩14,000', image: require('../imgs/음식점 2 음식 3.jpg') },
          ],
          '수정구',
          [18000, 30000],
          createTags({ '양 많음': 5, 친절함: 4, 청결함: 4 })
        ),
        new Restaurant(
          '3',
          '갓 잇',
          '줄 서서 먹는 타코 맛집 갓잇 중원구점입니다.',
          require('../imgs/음식점 3.jpg'),
          [
            { id: '1', name: '<A세트>', price: '₩39,000', image: require('../imgs/음식점 3 음식 1.jpg') },
            { id: '2', name: '<C세트>', price: '₩43,000', image: require('../imgs/음식점 3 음식 2.jpg') },
            { id: '3', name: '<불닭세트> 매운맛 3단계', price: '₩42,000', image: require('../imgs/음식점 3 음식 3.jpg') },
          ],
          '중원구',
          [39000, 43000],
          createTags({ 달콤함: 4, 분위기: 5, 가성비: 3 })
        ),
      ]);
    }); // 1초 지연 후 데이터 반환
  });
};