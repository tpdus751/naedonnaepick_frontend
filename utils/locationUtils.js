// utils/locationUtils.js

export function getDistrictName(addressObj) {
  if (!addressObj) return '';
  const { district, city } = addressObj;

  // city가 이미 "강남구", "분당구" 등인 경우
  if (city && city.endsWith('구')) return city;
  return district || '';  // 기본적으로 district 사용
}
