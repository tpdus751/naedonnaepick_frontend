// utils/kakaoGeo.js
import axios from 'axios';

const KAKAO_API_KEY = 'KakaoAK 82386dba96ff94edbd73ddfc7519b456'; // ⚠️ 반드시 KakaoAK 포함

export const getRegionFromKakao = async (lat, lng) => {
  try {
    const res = await axios.get('https://dapi.kakao.com/v2/local/geo/coord2address.json', {
      params: { x: lng, y: lat },
      headers: { Authorization: KAKAO_API_KEY },
    });

    const data = res.data.documents[0]; // 항상 첫 번째 결과 사용

    const dongName = data?.address?.region_3depth_name || '';
    const roadAddress = data?.road_address?.address_name || '';
    const jibunAddress = data?.address?.address_name;

    return {
      dongName,
      roadAddress: roadAddress || jibunAddress || '', // ✅ fallback
    };
  } catch (error) {
    console.error('🛑 Kakao API 오류:', error);
    return { dongName: '', roadAddress: '' };
  }
};


