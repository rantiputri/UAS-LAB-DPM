import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getAuthToken, removeAuthToken } from '../utils/auth';
import { fetchUserProfile, editProfile } from '../services/api';
import { RootStackParamList, User } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedUsername, setEditedUsername] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadUserProfile = async () => {
      const token = await getAuthToken();
      if (token) {
        try {
          const profileData = await fetchUserProfile() as User;
          setUser(profileData);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
      setLoading(false);
    };

    loadUserProfile();
  }, []);

  const handleLogout = async () => {
    await removeAuthToken();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const openEditModal = () => {
    if (user) {
      setEditedUsername(user.username);
      setEditedEmail(user.email);
      setEditModalVisible(true);
    }
  };

  const handleSaveChanges = async () => {
    if (!editedUsername || !editedEmail) {
      alert('All fields are required.');
      return;
    }

    try {
      if (user) {
        const updatedProfile = await editProfile(user.id, {
          username: editedUsername,
          email: editedEmail,
        });
        setUser(updatedProfile);
        setEditModalVisible(false);
        alert('Profile updated successfully.');
      }
    } catch (error) {
      console.error('Failed to update user profile:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user.username}!</Text>
      <View style={styles.profileCard}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{user.username}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>
      <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Modal for Editing Profile */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={editedUsername}
              onChangeText={setEditedUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={editedEmail}
              onChangeText={setEditedEmail}
              keyboardType="email-address"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8bbd0', // Background color pink pastel
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#d81b60', // Dark pink color for title
    marginBottom: 20,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#fce4ec', // Light pink background for the profile card
    borderRadius: 20,
    padding: 20,
    width: '85%',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  label: {
    color: '#d81b60', // Dark pink for labels
    fontSize: 16,
    marginBottom: 5,
  },
  value: {
    color: '#000', // Dark color for value text
    fontSize: 16,
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#f06292', // Soft pink background for edit button
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginBottom: 15,
  },
  editButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#e94560', // A bolder pink for logout button
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fce4ec', // Light pink for modal content
    borderRadius: 20,
    padding: 20,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d81b60', // Dark pink for modal title
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f8bbd0', // Light pink input background
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    color: '#000',
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#4caf50', // Green for save button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#e94560', // Red for cancel button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
