import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to Book Tracker</Text>
        <Text style={styles.subtitle}>
          Manage your books and track your reading progress.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Menyusun elemen dari atas
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8bbd0', // Latar belakang pink pastel yang lembut
  },
  card: {
    backgroundColor: '#fce4ec', // Kartu dengan warna pink pastel cerah
    borderRadius: 25, // Sudut melengkung untuk kesan modern
    padding: 30,
    width: '90%', // Kartu lebih lebar dan mencakup hampir seluruh layar
    marginTop: 50, // Memberi jarak antara bagian atas dan kartu
    shadowColor: '#f48fb1', // Bayangan pink pastel halus
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    alignItems: 'center',
    borderWidth: 0,
  },
  title: {
    fontSize: 34, // Ukuran font lebih besar
    fontWeight: 'bold',
    color: '#d81b60', // Warna pink yang lebih gelap untuk judul
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(216, 27, 96, 0.2)', // Bayangan pink gelap halus
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 20, // Ukuran font lebih besar untuk subtitle
    textAlign: 'center',
    color: '#d81b60', // Warna pink yang kontras dengan judul
    lineHeight: 30,
    marginTop: 10, // Menambahkan jarak antara subtitle dan judul
    fontStyle: 'italic',
  },
});

export default HomeScreen;
