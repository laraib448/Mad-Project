import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Switch, FlatList, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const initialAlerts = [
  {
    id: '1',
    title: 'Serena\'s Birthday Today!',
    time: '9:00 AM',
    type: 'today',
    enabled: true,
    repeat: 'Daily',
    sound: 'Default',
  },
  {
    id: '2',
    title: 'Debbie\'s Birthday in 5 days',
    time: '9:00 AM',
    type: 'upcoming',
    enabled: true,
    repeat: 'Once',
    sound: 'Gentle',
  },
  {
    id: '3',
    title: 'Weekly Birthday Summary',
    time: 'Every Monday 10:00 AM',
    type: 'weekly',
    enabled: true,
    repeat: 'Weekly',
    sound: 'Default',
  },
  {
    id: '4',
    title: 'Monthly Preview',
    time: '1st of every month',
    type: 'monthly',
    enabled: false,
    repeat: 'Monthly',
    sound: 'Default',
  },
];

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailReminders, setEmailReminders] = useState(true);
  const [advanceNotice, setAdvanceNotice] = useState('7');

  const toggleAlert = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };

  const deleteAlert = (id) => {
    Alert.alert(
      'Delete Alert',
      'Are you sure you want to delete this alert?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            const updatedAlerts = alerts.filter(alert => alert.id !== id);
            setAlerts(updatedAlerts);
            Alert.alert('Success', 'Alert deleted successfully');
          }
        }
      ]
    );
  };

  const addNewAlert = () => {
    Alert.prompt(
      'New Alert',
      'Enter alert title:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (title) => {
            if (title && title.trim()) {
              const newAlert = {
                id: (alerts.length + 1).toString(),
                title: title.trim(),
                time: '8:00 AM',
                type: 'general',
                enabled: true,
                repeat: 'Daily',
                sound: 'Default',
              };
              setAlerts([...alerts, newAlert]);
            }
          }
        }
      ]
    );
  };

  const renderAlertItem = ({ item }) => (
    <View style={[styles.alertCard, { borderLeftColor: getAlertColor(item.type) }]}>
      <View style={styles.alertHeader}>
        <View style={styles.alertTitleContainer}>
          <Icon 
            name={getAlertIcon(item.type)} 
            size={20} 
            color={getAlertColor(item.type)} 
            style={styles.alertIcon}
          />
          <View>
            <Text style={styles.alertTitle}>{item.title}</Text>
            <Text style={styles.alertTime}>{item.time}</Text>
          </View>
        </View>
        <Switch
          value={item.enabled}
          onValueChange={() => toggleAlert(item.id)}
          trackColor={{ false: '#BDC3C7', true: getAlertColor(item.type) }}
        />
      </View>

      <View style={styles.alertDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Repeat:</Text>
          <Text style={styles.detailValue}>{item.repeat}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Sound:</Text>
          <Text style={styles.detailValue}>{item.sound}</Text>
        </View>
      </View>

      <View style={styles.alertActions}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => Alert.alert('Edit', 'Edit functionality would be here')}
        >
          <Icon name="create-outline" size={18} color="#8E44AD" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteAlert(item.id)}
        >
          <Icon name="trash-outline" size={18} color="#E74C3C" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getAlertColor = (type) => {
    switch(type) {
      case 'today': return '#E74C3C';
      case 'upcoming': return '#F39C12';
      case 'weekly': return '#3498DB';
      case 'monthly': return '#9B59B6';
      default: return '#2ECC71';
    }
  };

  const getAlertIcon = (type) => {
    switch(type) {
      case 'today': return 'today';
      case 'upcoming': return 'notifications';
      case 'weekly': return 'calendar';
      case 'monthly': return 'calendar-number';
      default: return 'alarm';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notification Alerts</Text>
        <Text style={styles.headerSubtitle}>Manage your birthday reminders</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Alert Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="notifications-outline" size={24} color="#8E44AD" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive birthday reminders</Text>
              </View>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#BDC3C7', true: '#8E44AD' }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="mail-outline" size={24} color="#8E44AD" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Email Reminders</Text>
                <Text style={styles.settingDescription}>Get emails for upcoming birthdays</Text>
              </View>
            </View>
            <Switch
              value={emailReminders}
              onValueChange={setEmailReminders}
              trackColor={{ false: '#BDC3C7', true: '#8E44AD' }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Icon name="time-outline" size={24} color="#8E44AD" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Advance Notice</Text>
                <Text style={styles.settingDescription}>Days before birthday</Text>
              </View>
            </View>
            <Text style={styles.advanceNoticeValue}>{advanceNotice} days</Text>
          </View>

          <View style={styles.noticeOptions}>
            {['1', '3', '7', '14', '30'].map((days) => (
              <TouchableOpacity
                key={days}
                style={[
                  styles.noticeOption,
                  advanceNotice === days && styles.selectedNoticeOption
                ]}
                onPress={() => setAdvanceNotice(days)}
              >
                <Text style={[
                  styles.noticeOptionText,
                  advanceNotice === days && styles.selectedNoticeOptionText
                ]}>
                  {days} day{days !== '1' ? 's' : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.alertsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Scheduled Alerts</Text>
            <TouchableOpacity style={styles.addButton} onPress={addNewAlert}>
              <Icon name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add New</Text>
            </TouchableOpacity>
          </View>

          {alerts.length > 0 ? (
            <FlatList
              data={alerts}
              renderItem={renderAlertItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.alertsList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Icon name="notifications-off-outline" size={60} color="#BDC3C7" />
              <Text style={styles.emptyStateText}>No alerts set up</Text>
              <Text style={styles.emptyStateSubtext}>Add your first alert!</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E8DAEF',
  },
  settingsSection: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  advanceNoticeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8E44AD',
  },
  noticeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  noticeOption: {
    backgroundColor: '#F7F1FF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
    minWidth: '18%',
  },
  selectedNoticeOption: {
    backgroundColor: '#8E44AD',
  },
  noticeOptionText: {
    fontSize: 14,
    color: '#8E44AD',
    textAlign: 'center',
  },
  selectedNoticeOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  alertsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8E44AD',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  alertsList: {
    paddingBottom: 10,
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  alertTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertIcon: {
    marginRight: 10,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  alertTime: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  alertDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginRight: 5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  alertActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F1FF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  editButtonText: {
    color: '#8E44AD',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  deleteButtonText: {
    color: '#E74C3C',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
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
});