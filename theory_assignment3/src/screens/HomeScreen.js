import { useUser } from '../contexts/UserContext';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity,
  Modal, TextInput, ScrollView, Alert, Image, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getHolidays } from '../config/api'; // Add this import

// Sample birthday data
const initialBirthdays = [
  { 
    id: '1', 
    name: 'Serena Williams', 
    date: '2024-10-15', 
    age: 23, 
    image: 'https://randomuser.me/api/portraits/women/1.jpg', 
    note: 'Best friend from college',
    phone: '+1 234 567 8900'
  },
  { 
    id: '2', 
    name: 'Debbie Johnson', 
    date: '2024-10-20', 
    age: 25, 
    image: 'https://randomuser.me/api/portraits/women/2.jpg', 
    note: 'Office colleague',
    phone: '+1 234 567 8901'
  },
];

export default function HomeScreen({ route }) {
  const { user } = useUser();
  const [birthdays, setBirthdays] = useState(initialBirthdays);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedBirthday, setSelectedBirthday] = useState(null);
  const [newBirthday, setNewBirthday] = useState({
    name: '',
    date: '',
    age: '',
    note: '',
    phone: '',
    image: 'https://randomuser.me/api/portraits/women/10.jpg'
  });
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [loadingHolidays, setLoadingHolidays] = useState(true);
  
  const userName = user.name || 'User';

  useEffect(() => {
    fetchUpcomingHolidays();
  }, []);

  const calculateDaysLeft = (dateString) => {
    const today = new Date();
    const birthday = new Date(dateString);
    birthday.setFullYear(today.getFullYear());
    
    if (birthday < today) {
      birthday.setFullYear(today.getFullYear() + 1);
    }
    
    const diffTime = birthday - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const fetchUpcomingHolidays = async () => {
    setLoadingHolidays(true);
    try {
      const year = new Date().getFullYear();
      const holidays = await getHolidays('US', year);
      
      // Get upcoming holidays (next 3)
      const today = new Date();
      const upcoming = holidays
        .filter(holiday => {
          if (!holiday.date || !holiday.date.iso) return false;
          const holidayDate = new Date(holiday.date.iso);
          return holidayDate >= today;
        })
        .sort((a, b) => new Date(a.date.iso) - new Date(b.date.iso))
        .slice(0, 3);
      
      setUpcomingHolidays(upcoming);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      setUpcomingHolidays([]);
    }
    setLoadingHolidays(false);
  };

  const getUpcomingBirthdays = () => {
    return birthdays.map(birthday => ({
      ...birthday,
      daysLeft: calculateDaysLeft(birthday.date)
    })).sort((a, b) => a.daysLeft - b.daysLeft);
  };

  const handleAddBirthday = () => {
    if (!newBirthday.name || !newBirthday.date || !newBirthday.age) {
      Alert.alert('Error', 'Please fill name, date, and age');
      return;
    }

    const newId = (birthdays.length + 1).toString();
    const updatedBirthdays = [
      ...birthdays,
      { ...newBirthday, id: newId }
    ];
    
    setBirthdays(updatedBirthdays);
    setModalVisible(false);
    setNewBirthday({
      name: '',
      date: '',
      age: '',
      note: '',
      phone: '',
      image: 'https://randomuser.me/api/portraits/women/10.jpg'
    });
    Alert.alert('Success', 'Birthday added successfully!');
  };

  const handleEditBirthday = (birthday) => {
    setSelectedBirthday(birthday);
    setEditModalVisible(true);
  };

  const handleUpdateBirthday = () => {
    if (!selectedBirthday) return;

    const updatedBirthdays = birthdays.map(b => 
      b.id === selectedBirthday.id ? selectedBirthday : b
    );
    
    setBirthdays(updatedBirthdays);
    setEditModalVisible(false);
    setSelectedBirthday(null);
    Alert.alert('Success', 'Birthday updated successfully!');
  };

const handleDeleteBirthday = (id) => {
  Alert.alert(
    'Delete Birthday',
    'Are you sure you want to delete this birthday?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedBirthdays = birthdays.filter(birthday => birthday.id !== id);
          setBirthdays(updatedBirthdays);
          Alert.alert('Success', 'Birthday deleted successfully');
        }
      }
    ]
  );
};

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const upcomingBirthdays = getUpcomingBirthdays();
  const birthdaysThisMonth = upcomingBirthdays.filter(b => b.daysLeft <= 30).length;
  const birthdaysToday = upcomingBirthdays.filter(b => b.daysLeft === 0).length;

  const renderBirthdayItem = ({ item }) => {
    const getStatusColor = () => {
      if (item.daysLeft === 0) return '#E74C3C';
      if (item.daysLeft <= 7) return '#F39C12';
      if (item.daysLeft <= 30) return '#3498DB';
      return '#2ECC71';
    };

    const getStatusText = () => {
      if (item.daysLeft === 0) return 'Today! 🎉';
      if (item.daysLeft === 1) return 'Tomorrow';
      if (item.daysLeft <= 30) return `${item.daysLeft} days`;
      return `${Math.floor(item.daysLeft / 30)} months`;
    };

    return (
      <View style={styles.birthdayCard}>
        <Image source={{ uri: item.image }} style={styles.birthdayAvatar} />
        
        <View style={styles.birthdayInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.birthdayName}>{item.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="calendar-outline" size={14} color="#7F8C8D" />
            <Text style={styles.detailText}>{formatDate(item.date)}</Text>
            <Text style={styles.ageText}> • Turns {item.age}</Text>
          </View>
          
          {item.note && (
            <View style={styles.detailRow}>
              <Icon name="document-text-outline" size={14} color="#7F8C8D" />
              <Text style={styles.noteText}>{item.note}</Text>
            </View>
          )}
          
          {item.phone && (
            <View style={styles.detailRow}>
              <Icon name="call-outline" size={14} color="#7F8C8D" />
              <Text style={styles.detailText}>{item.phone}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleEditBirthday(item)}
          >
            <Icon name="create-outline" size={20} color="#8E44AD" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeleteBirthday(item.id)}
          >
            <Icon name="trash-outline" size={20} color="#E74C3C" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userName}! 👋</Text>
          <Text style={styles.subtitle}>Your birthday reminders</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="calendar" size={24} color="#8E44AD" />
            <Text style={styles.statNumber}>{birthdaysThisMonth}</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="people" size={24} color="#3498DB" />
            <Text style={styles.statNumber}>{birthdays.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="today" size={24} color="#E74C3C" />
            <Text style={styles.statNumber}>{birthdaysToday}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
        </View>

        {upcomingHolidays.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Holidays</Text>
            </View>
            
            {upcomingHolidays.map((holiday, index) => (
              <View key={index} style={[styles.birthdayCard, styles.holidayCard]}>
                <View style={[styles.birthdayAvatar, styles.holidayAvatar]}>
                  <Icon name="flag" size={24} color="#3498DB" />
                </View>
                <View style={styles.birthdayInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.birthdayName}>{holiday.name}</Text>
                    <View style={styles.holidayBadge}>
                      <Text style={styles.holidayBadgeText}>Holiday</Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <Icon name="calendar-outline" size={14} color="#3498DB" />
                    <Text style={styles.detailText}>
                      {holiday.date && holiday.date.iso 
                        ? new Date(holiday.date.iso).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : 'Date not available'}
                    </Text>
                  </View>
                  {holiday.description && (
                    <Text style={styles.noteText}>{holiday.description}</Text>
                  )}
                </View>
              </View>
            ))}
          </>
        )}

        {loadingHolidays && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#8E44AD" />
            <Text style={styles.loadingText}>Loading holidays...</Text>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Birthdays</Text>
        </View>

        {upcomingBirthdays.length > 0 ? (
          <FlatList
            data={upcomingBirthdays}
            renderItem={renderBirthdayItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.birthdayList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Icon name="gift-outline" size={60} color="#BDC3C7" />
            <Text style={styles.emptyStateText}>No birthdays added yet</Text>
            <Text style={styles.emptyStateSubtext}>Add your first birthday reminder!</Text>
          </View>
        )}
      </ScrollView>

      {/* Add Birthday Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Birthday</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#7F8C8D" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newBirthday.name}
                  onChangeText={(text) => setNewBirthday({...newBirthday, name: text})}
                  placeholder="Enter full name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Birth Date *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newBirthday.date}
                  onChangeText={(text) => setNewBirthday({...newBirthday, date: text})}
                  placeholder="YYYY-MM-DD"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Age *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newBirthday.age}
                  onChangeText={(text) => setNewBirthday({...newBirthday, age: text})}
                  placeholder="Enter age"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={newBirthday.phone}
                  onChangeText={(text) => setNewBirthday({...newBirthday, phone: text})}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Note</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newBirthday.note}
                  onChangeText={(text) => setNewBirthday({...newBirthday, note: text})}
                  placeholder="Add a note (optional)"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Profile Image URL</Text>
                <TextInput
                  style={styles.textInput}
                  value={newBirthday.image}
                  onChangeText={(text) => setNewBirthday({...newBirthday, image: text})}
                  placeholder="Enter image URL"
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleAddBirthday}>
                <Text style={styles.saveButtonText}>Save Birthday</Text>
                <Icon name="save" size={20} color="#fff" />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Birthday Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Birthday</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Icon name="close" size={24} color="#7F8C8D" />
              </TouchableOpacity>
            </View>

            {selectedBirthday && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Name *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={selectedBirthday.name}
                    onChangeText={(text) => setSelectedBirthday({...selectedBirthday, name: text})}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Birth Date *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={selectedBirthday.date}
                    onChangeText={(text) => setSelectedBirthday({...selectedBirthday, date: text})}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Age *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={selectedBirthday.age.toString()}
                    onChangeText={(text) => setSelectedBirthday({...selectedBirthday, age: text})}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <TextInput
                    style={styles.textInput}
                    value={selectedBirthday.phone}
                    onChangeText={(text) => setSelectedBirthday({...selectedBirthday, phone: text})}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Note</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={selectedBirthday.note}
                    onChangeText={(text) => setSelectedBirthday({...selectedBirthday, note: text})}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Profile Image URL</Text>
                  <TextInput
                    style={styles.textInput}
                    value={selectedBirthday.image}
                    onChangeText={(text) => setSelectedBirthday({...selectedBirthday, image: text})}
                  />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleUpdateBirthday}>
                  <Text style={styles.saveButtonText}>Update Birthday</Text>
                  <Icon name="checkmark" size={20} color="#fff" />
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>
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
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#E8DAEF',
    marginTop: 5,
  },
  notificationButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    width: '30%',
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 5,
  },
  sectionHeader: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  birthdayList: {
    paddingHorizontal: 15,
  },
  birthdayCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 12,
    padding: 15,
    borderRadius: 15,
    elevation: 3,
  },
  holidayCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3498DB',
    backgroundColor: '#fff',
  },
  birthdayAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  holidayAvatar: {
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  birthdayInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  birthdayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  holidayBadge: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  holidayBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginLeft: 5,
  },
  ageText: {
    fontSize: 14,
    color: '#8E44AD',
    fontWeight: '500',
  },
  noteText: {
    fontSize: 13,
    color: '#7F8C8D',
    marginLeft: 5,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingLeft: 10,
  },
  actionButton: {
    padding: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#7F8C8D',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 20,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 5,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#8E44AD',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E8DAEF',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#8E44AD',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});