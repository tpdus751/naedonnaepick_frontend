import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
  padding: 20px;
`;

const RestaurantDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // RestaurantListScreen에서 전달받은 데이터
  const { restaurant } = route.params;

  return (
    <Container>
      <Header
        title="음식점 상세 정보"
        canGoBack={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView style={styles.container}>
        {/* 대표 사진 */}
        <View style={styles.headerSection}>
          <Image source={restaurant.image} style={styles.thumbnail} />
          <View style={styles.info}>
            <Text style={styles.sectionTitle}>{restaurant.name}</Text>
            <Text style={styles.description}>{restaurant.description}</Text>
          </View>
        </View>
        <View style={styles.separator} />

        {/* 메뉴 섹션 */}
        {restaurant.menu && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>메뉴</Text>
            {restaurant.menu.map((item) => (
              <View key={item.id} style={styles.menuItem}>
                <Image source={item.image} style={styles.menuImage} />
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuName}>{item.name}</Text>
                  <Text style={styles.menuPrice}>{item.price}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 12,
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#555',
  },
  menuItem: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuName: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuPrice: {
    fontSize: 14,
    color: '#777',
  },
  selectButton: {
  backgroundColor: '#007BFF',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 4,
},
selectButtonText: {
  color: '#fff',
  fontSize: 14,
},
});

export default RestaurantDetailScreen;