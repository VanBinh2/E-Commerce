
/**
 * MOBILE APP BOILERPLATE (React Native + Expo)
 * Copy file này vào dự án Expo mới.
 */

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- MOCK DATA ---
const PRODUCTS = [
  { id: '1', name: 'Summer Yellow Tee', price: 35.00, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab' },
  { id: '2', name: 'Classic Green Shirt', price: 55.00, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c' },
];

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// --- SCREENS ---
function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Discover</Text>
      <FlatList
        data={PRODUCTS}
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardPrice}>${item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.detailImage} />
      <View style={styles.detailInfo}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.desc}>High quality material, perfect for summer days.</Text>
        <TouchableOpacity style={styles.btn} onPress={() => Alert.alert('Added to Cart')}>
          <Text style={styles.btnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CartScreen() {
  return (
    <View style={styles.center}>
      <Text>Cart is empty</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>John Doe</Text>
      <Text>john@example.com</Text>
      <TouchableOpacity style={[styles.btn, { marginTop: 20, backgroundColor: 'red' }]}>
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Shop" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Details' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline';
            else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Cart" component={CartScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },
  card: { flex: 1, margin: 5, borderRadius: 10, backgroundColor: '#f9f9f9', padding: 10 },
  cardImage: { width: '100%', height: 150, borderRadius: 10 },
  cardTitle: { marginTop: 10, fontWeight: '600' },
  cardPrice: { color: 'green', fontWeight: 'bold' },
  detailImage: { width: '100%', height: 300 },
  detailInfo: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  price: { fontSize: 20, color: 'green', marginVertical: 10 },
  desc: { color: '#666', marginBottom: 20 },
  btn: { backgroundColor: '#111827', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});
