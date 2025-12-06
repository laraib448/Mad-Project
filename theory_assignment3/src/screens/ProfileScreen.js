import { useUser } from '../contexts/UserContext';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Image, TextInput, Modal, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProfileScreen({ navigation }) {
  const { user, updateUser } = useUser();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [imageUrlModal, setImageUrlModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  

const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Successfully logged out');
            navigation.navigate('Login');
          }
        }
      ]
    );
  };

  const openEditModal = (field, value) => {
    setEditField(field);
    setEditValue(value);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editValue.trim()) {
       updateUser({ [editField]: editValue });
      Alert.alert('Success', 'Profile updated successfully');
      setEditModalVisible(false);
    }
  };

  const changeProfileImage = () => {
    setImageUrlModal(true);
  };

  const saveImageUrl = () => {
    if (newImageUrl.trim()) {
     updateUser({ image: newImageUrl });
      setNewImageUrl('');
      setImageUrlModal(false);
      Alert.alert('Success', 'Profile picture updated');
    }
  };

  // Sample image URLs for quick selection
  const sampleImages = [
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/men/75.jpg',
    'https://randomuser.me/api/portraits/women/65.jpg',
    'https://randomuser.me/api/portraits/women/44.jpg',
    'https://randomuser.me/api/portraits/men/22.jpg',
    'https://randomuser.me/api/portraits/women/33.jpg',
  ];

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Name',
      onPress: () => openEditModal('name', user.name),
    },
    {
      icon: 'mail-outline',
      title: 'Edit Email',
      onPress: () => openEditModal('email', user.email),
    },
    {
      icon: 'call-outline',
      title: 'Edit Phone',
      onPress: () => openEditModal('phone', user.phone),
    },
    {
      icon: 'calendar-outline',
      title: 'Edit Birthday',
      onPress: () => openEditModal('birthday', user.birthday),
    },
    {
      icon: 'chatbubble-outline',
      title: 'Edit Bio',
      onPress: () => openEditModal('bio', user.bio),
    },
    {
      icon: 'information-circle-outline',
      title: 'About App',
      onPress: () => Alert.alert(
        'About Birthday Reminder',
        'Version 1.0.0\n\nThis app helps you never forget important birthdays. You can add birthdays, set reminders, and view them in calendar format.\n\nFeatures:\n• Add/Edit/Delete birthdays\n• Set custom alerts\n• Calendar view\n• Profile management'
      ),
    },
  ];

  const stats = [
    { label: 'Birthdays', value: '12', icon: 'cake' },
    { label: 'Reminders', value: '8', icon: 'notifications' },
    { label: 'Years', value: '3', icon: 'calendar' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => Alert.alert('Settings', 'Settings screen coming soon!')}
        >
          <Icon name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={changeProfileImage}>
            <View style={styles.profileImageContainer}>
              <Image source={{ uri: user.image }} style={styles.profileImage} />
              <View style={styles.editImageButton}>
                <Icon name="camera" size={20} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          <View style={styles.bioContainer}>
            <Icon name="chatbubble-outline" size={16} color="#8E44AD" />
            <Text style={styles.userBio}>{user.bio}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Icon name={stat.icon} size={20} color="#8E44AD" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>
                  <Icon name={item.icon} size={20} color="#8E44AD" />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#BDC3C7" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={styles.supportButton}
            onPress={() => Alert.alert('Support', 'Contact support@birthdayapp.com')}
          >
            <Icon name="help-circle-outline" size={20} color="#8E44AD" />
            <Text style={styles.supportButtonText}>Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Icon name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editField === 'name' && 'Edit Name'}
                {editField === 'email' && 'Edit Email'}
                {editField === 'phone' && 'Edit Phone Number'}
                {editField === 'birthday' && 'Edit Birthday'}
                {editField === 'bio' && 'Edit Bio'}
              </Text>
              <TouchableOpacity 
                onPress={() => setEditModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#7F8C8D" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={
                editField === 'name' ? 'Enter your name' :
                editField === 'email' ? 'Enter your email' :
                editField === 'phone' ? 'Enter your phone number' :
                editField === 'birthday' ? 'Enter your birthday (YYYY-MM-DD)' :
                'Enter your bio'
              }
              autoFocus
              keyboardType={
                editField === 'email' ? 'email-address' :
                editField === 'phone' ? 'phone-pad' :
                editField === 'birthday' ? 'numbers-and-punctuation' :
                'default'
              }
              multiline={editField === 'bio'}
              numberOfLines={editField === 'bio' ? 3 : 1}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Image URL Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={imageUrlModal}
        onRequestClose={() => setImageUrlModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Profile Picture</Text>
              <TouchableOpacity 
                onPress={() => setImageUrlModal(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#7F8C8D" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Enter Image URL:</Text>
            <TextInput
              style={styles.modalInput}
              value={newImageUrl}
              onChangeText={setNewImageUrl}
              placeholder="https://example.com/image.jpg"
              autoFocus
              keyboardType="url"
            />

            <Text style={styles.modalSubtitle}>Or select from samples:</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.sampleImages}
              contentContainerStyle={styles.sampleImagesContent}
            >
              {sampleImages.map((url, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setUser({ ...user, image: url });
                    setImageUrlModal(false);
                    Alert.alert('Success', 'Profile picture updated');
                  }}
                  activeOpacity={0.7}
                  style={styles.sampleImageContainer}
                >
                  <Image source={{ uri: url }} style={styles.sampleImage} />
                  {user.image === url && (
                    <View style={styles.selectedImageOverlay}>
                      <Icon name="checkmark" size={16} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setImageUrlModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveImageUrl}
                activeOpacity={0.8}
                disabled={!newImageUrl.trim()}
              >
                <Text style={[styles.saveButtonText, !newImageUrl.trim() && styles.disabledButtonText]}>
                  Use URL
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1FF',
  },
  header: {
    backgroundColor: '#8E44AD',
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  settingsButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    elevation: 2,
  },
  profileSection: {
    alignItems: 'center',
    padding: 25,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#8E44AD',
    backgroundColor: '#E8DAEF',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8E44AD',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 15,
    textAlign: 'center',
  },
  bioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8DAEF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    maxWidth: '80%',
  },
  userBio: {
    fontSize: 14,
    color: '#8E44AD',
    marginLeft: 8,
    fontStyle: 'italic',
    textAlign: 'center',
    flexShrink: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7F1FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8E44AD',
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  menuSection: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7F1FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: '#2C3E50',
    flex: 1,
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
    gap: 12,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  supportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E44AD',
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E74C3C',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 10,
  },
  versionText: {
    textAlign: 'center',
    color: '#BDC3C7',
    fontSize: 14,
    marginBottom: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
    marginTop: 15,
  },
  modalInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E8DAEF',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 10,
  },
  sampleImages: {
    marginBottom: 20,
  },
  sampleImagesContent: {
    paddingVertical: 10,
  },
  sampleImageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  sampleImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#8E44AD',
  },
  selectedImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(142, 68, 173, 0.7)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  saveButton: {
    backgroundColor: '#8E44AD',
  },
  cancelButtonText: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButtonText: {
    opacity: 0.5,
  },
});