import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Dimensions, Modal, TextInput, ScrollView } from 'react-native';
import { apiService } from '../../lib/api';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import * as ExpoCalendar from 'expo-calendar';

const { width } = Dimensions.get('window');

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location?: string;
  event_type?: string;
  attendees_count?: number;
}

// Calendar locale config (optional, can be customized)
LocaleConfig.locales['en'] = {
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  monthNamesShort: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],
  dayNames: [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};
LocaleConfig.defaultLocale = 'en';

export default function EventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    event_type: '',
  });
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<{ [eventId: string]: boolean }>({});
  const [actionLoading, setActionLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      );

      const apiPromise = apiService.getEvents();

      const { data, error: apiError } = await Promise.race([apiPromise, timeoutPromise]) as any;

      if (apiError) {
        setError(apiError);
        // Fallback to mock data for demo purposes
        const mockEvents: Event[] = [
          {
            id: '1',
            title: 'Sunday Service',
            description: 'Weekly Sunday worship service',
            start_date: '2024-01-21T09:00:00Z',
            end_date: '2024-01-21T11:00:00Z',
            location: 'Main Sanctuary',
            event_type: 'Worship',
            attendees_count: 120,
          },
          {
            id: '2',
            title: 'Bible Study',
            description: 'Wednesday evening Bible study group',
            start_date: '2024-01-24T19:00:00Z',
            end_date: '2024-01-24T20:30:00Z',
            location: 'Fellowship Hall',
            event_type: 'Study',
            attendees_count: 25,
          },
          {
            id: '3',
            title: 'Youth Group',
            description: 'Friday night youth activities',
            start_date: '2024-01-26T18:00:00Z',
            end_date: '2024-01-26T21:00:00Z',
            location: 'Youth Center',
            event_type: 'Youth',
            attendees_count: 35,
          },
          {
            id: '4',
            title: 'Prayer Meeting',
            description: 'Community prayer gathering',
            start_date: '2024-01-25T19:00:00Z',
            end_date: '2024-01-25T20:00:00Z',
            location: 'Prayer Room',
            event_type: 'Prayer',
            attendees_count: 15,
          },
          {
            id: '5',
            title: 'Choir Practice',
            description: 'Weekly choir rehearsal',
            start_date: '2024-01-23T19:30:00Z',
            end_date: '2024-01-23T21:00:00Z',
            location: 'Choir Room',
            event_type: 'Music',
            attendees_count: 20,
          },
        ];
        setEvents(mockEvents);
      } else {
        setEvents(data as Event[] || []);
      }
    } catch (err) {
      setError('Failed to load events');
      // Always provide fallback data
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Sunday Service',
          description: 'Weekly Sunday worship service',
          start_date: '2024-01-21T09:00:00Z',
          end_date: '2024-01-21T11:00:00Z',
          location: 'Main Sanctuary',
          event_type: 'Worship',
          attendees_count: 120,
        },
        {
          id: '2',
          title: 'Bible Study',
          description: 'Wednesday evening Bible study group',
          start_date: '2024-01-24T19:00:00Z',
          end_date: '2024-01-24T20:30:00Z',
          location: 'Fellowship Hall',
          event_type: 'Study',
          attendees_count: 25,
        },
        {
          id: '3',
          title: 'Youth Group',
          description: 'Friday night youth activities',
          start_date: '2024-01-26T18:00:00Z',
          end_date: '2024-01-26T21:00:00Z',
          location: 'Youth Center',
          event_type: 'Youth',
          attendees_count: 35,
        },
        {
          id: '4',
          title: 'Prayer Meeting',
          description: 'Community prayer gathering',
          start_date: '2024-01-25T19:00:00Z',
          end_date: '2024-01-25T20:00:00Z',
          location: 'Prayer Room',
          event_type: 'Prayer',
          attendees_count: 15,
        },
        {
          id: '5',
          title: 'Choir Practice',
          description: 'Weekly choir rehearsal',
          start_date: '2024-01-23T19:30:00Z',
          end_date: '2024-01-23T21:00:00Z',
          location: 'Choir Room',
          event_type: 'Music',
          attendees_count: 20,
        },
      ];
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.start_date || !newEvent.end_date) {
      Alert.alert('Error', 'Title, start date, and end date are required');
      return;
    }
    setActionLoading(true);
    try {
      const { data, error: apiError } = await apiService.createEvent(newEvent);
      if (apiError) {
        Alert.alert('Error', apiError);
      } else {
        setShowAddModal(false);
        setNewEvent({ title: '', description: '', start_date: '', end_date: '', location: '', event_type: '' });
        await loadEvents();
        Alert.alert('Success', 'Event added successfully!');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to add event');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditEvent = async () => {
    if (!editEvent) return;
    if (!editEvent.title || !editEvent.start_date || !editEvent.end_date) {
      Alert.alert('Error', 'Title, start date, and end date are required');
      return;
    }
    setActionLoading(true);
    try {
      const { data, error: apiError } = await apiService.updateEvent(editEvent.id, editEvent);
      if (apiError) {
        Alert.alert('Error', apiError);
      } else {
        setEditEvent(null);
        await loadEvents();
        Alert.alert('Success', 'Event updated successfully!');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update event');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!editEvent) return;
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(true);
            try {
              const { error: apiError } = await apiService.deleteEvent(editEvent.id);
              if (apiError) {
                Alert.alert('Error', apiError);
              } else {
                setEditEvent(null);
                await loadEvents();
                Alert.alert('Deleted', 'Event deleted successfully!');
              }
            } catch (err) {
              Alert.alert('Error', 'Failed to delete event');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleToggleRsvp = (eventId: string) => {
    setRsvpStatus(prev => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays > 1 && diffDays <= 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getEventTypeColor = (type: string | undefined): [string, string] => {
    switch (type?.toLowerCase()) {
      case 'worship': return ['#10b981', '#059669'];
      case 'study': return ['#6366f1', '#4f46e5'];
      case 'youth': return ['#f59e0b', '#d97706'];
      case 'prayer': return ['#8b5cf6', '#7c3aed'];
      case 'music': return ['#ec4899', '#db2777'];
      default: return ['#6b7280', '#4b5563'];
    }
  };

  const getEventTypeIcon = (type: string | undefined) => {
    switch (type?.toLowerCase()) {
      case 'worship': return '🙏';
      case 'study': return '📖';
      case 'youth': return '👥';
      case 'prayer': return '🤲';
      case 'music': return '🎵';
      default: return '📅';
    }
  };

  const handleEventPress = (event: Event) => {
    Alert.alert(
      event.title,
      `${event.description}\n\nDate: ${formatDate(event.start_date)}\nTime: ${formatTime(event.start_date)} - ${formatTime(event.end_date)}\nLocation: ${event.location || 'TBD'}\nAttendees: ${event.attendees_count || 0}`,
      [
        { text: 'RSVP', onPress: () => console.log('RSVP to event:', event.id) },
        { text: 'Share', onPress: () => console.log('Share event:', event.id) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity 
      style={styles.eventCard}
      onPress={() => setEditEvent(item)}
    >
      <View style={styles.eventHeader}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDate(item.start_date)}</Text>
          <Text style={styles.timeText}>{formatTime(item.start_date)}</Text>
        </View>
        <LinearGradient
          colors={getEventTypeColor(item.event_type)}
          style={styles.typeBadge}
        >
          <Text style={styles.typeIcon}>{getEventTypeIcon(item.event_type)}</Text>
          <Text style={styles.typeText}>{item.event_type}</Text>
        </LinearGradient>
      </View>
      
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
      
      <View style={styles.eventFooter}>
        {item.location && (
          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        )}
        {item.attendees_count !== undefined && (
          <View style={styles.attendeesContainer}>
            <Text style={styles.attendeesIcon}>👥</Text>
            <Text style={styles.attendeesText}>{item.attendees_count} attending</Text>
          </View>
        )}
      </View>
      <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          style={[styles.rsvpButton, rsvpStatus[item.id] && styles.rsvpButtonActive]}
          onPress={() => handleToggleRsvp(item.id)}
        >
          <Text style={[styles.rsvpButtonText, rsvpStatus[item.id] && styles.rsvpButtonTextActive]}>
            {rsvpStatus[item.id] ? 'Going' : 'RSVP'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Get events for selected date
  const eventsForSelectedDate = events.filter(ev => ev.start_date.slice(0, 10) === selectedDate);

  // Add to Calendar handler
  const handleAddToCalendar = async (event: Event) => {
    try {
      const { status } = await ExpoCalendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Calendar permission is required.');
        return;
      }
      const calendars = await ExpoCalendar.getCalendarsAsync(ExpoCalendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find((cal: any) => cal.allowsModifications) || calendars[0];
      if (!defaultCalendar) {
        Alert.alert('No calendar found', 'No modifiable calendar found on device.');
        return;
      }
      await ExpoCalendar.createEventAsync(defaultCalendar.id, {
        title: event.title,
        startDate: new Date(event.start_date),
        endDate: new Date(event.end_date),
        location: event.location,
        notes: event.description,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      Alert.alert('Added to Calendar', 'Event was added to your device calendar.');
    } catch (err: unknown) {
      const error = err as Error;
      Alert.alert('Calendar Error', error.message || String(error));
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  // Show error message only if there are no events to display
  const showError = error && events.length === 0;

  return (
    <View style={styles.container}>
      {showError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadEvents}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.retryGradient}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>Events</Text>
            <Text style={styles.subtitle}>{events.length} upcoming events</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.addButtonGradient}
            >
              <Text style={styles.addButtonText}>+</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Add view toggle buttons above event list/calendar */}
      <View style={styles.viewToggleRow}>
        <TouchableOpacity
          style={[styles.viewToggleBtn, viewMode === 'list' && styles.viewToggleBtnActive]}
          onPress={() => setViewMode('list')}
        >
          <MaterialIcons name="list" size={20} color={viewMode === 'list' ? '#fff' : '#667eea'} />
          <Text style={[styles.viewToggleText, viewMode === 'list' && styles.viewToggleTextActive]}>List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewToggleBtn, viewMode === 'calendar' && styles.viewToggleBtnActive]}
          onPress={() => setViewMode('calendar')}
        >
          <MaterialIcons name="calendar-today" size={20} color={viewMode === 'calendar' ? '#fff' : '#667eea'} />
          <Text style={[styles.viewToggleText, viewMode === 'calendar' && styles.viewToggleTextActive]}>Calendar</Text>
        </TouchableOpacity>
      </View>

      {/* Render calendar or list view */}
      {viewMode === 'calendar' ? (
        <View>
          <Calendar
            markedDates={events.reduce((acc, ev) => {
              const date = ev.start_date.slice(0, 10);
              acc[date] = acc[date] || { marked: true, dots: [{ color: '#667eea' }] };
              return acc;
            }, {} as any)}
            onDayPress={day => setSelectedDate(day.dateString)}
            current={selectedDate}
            theme={{
              selectedDayBackgroundColor: '#667eea',
              todayTextColor: '#764ba2',
              arrowColor: '#667eea',
              dotColor: '#667eea',
            }}
            style={styles.calendar}
          />
          <Text style={styles.selectedDateLabel}>Events on {selectedDate}</Text>
          {eventsForSelectedDate.length === 0 ? (
            <Text style={styles.noEventsText}>No events for this date.</Text>
          ) : (
            <FlatList
              data={eventsForSelectedDate}
              keyExtractor={item => item.id}
              renderItem={renderEvent}
              contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}
            />
          )}
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={item => item.id}
          renderItem={renderEvent}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)}>
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Event Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.modalHeader}
            >
              <Text style={styles.modalTitle}>Add Event</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </LinearGradient>
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Title *</Text>
                <TextInput
                  style={styles.input}
                  value={newEvent.title}
                  onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
                  placeholder="Enter event title"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newEvent.description}
                  onChangeText={(text) => setNewEvent({ ...newEvent, description: text })}
                  placeholder="Enter event description"
                  multiline
                  numberOfLines={3}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Start Date *</Text>
                <TextInput
                  style={styles.input}
                  value={newEvent.start_date}
                  onChangeText={(text) => setNewEvent({ ...newEvent, start_date: text })}
                  placeholder="YYYY-MM-DDTHH:mm:ssZ"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>End Date *</Text>
                <TextInput
                  style={styles.input}
                  value={newEvent.end_date}
                  onChangeText={(text) => setNewEvent({ ...newEvent, end_date: text })}
                  placeholder="YYYY-MM-DDTHH:mm:ssZ"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={newEvent.location}
                  onChangeText={(text) => setNewEvent({ ...newEvent, location: text })}
                  placeholder="Enter location"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Type</Text>
                <TextInput
                  style={styles.input}
                  value={newEvent.event_type}
                  onChangeText={(text) => setNewEvent({ ...newEvent, event_type: text })}
                  placeholder="e.g. Worship, Study, Youth, etc."
                />
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddModal(false)} disabled={actionLoading}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddEvent} disabled={actionLoading}>
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>{actionLoading ? 'Saving...' : 'Add Event'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        visible={!!editEvent}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditEvent(null)}
      >
        {editEvent && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.modalHeader}
              >
                <Text style={styles.modalTitle}>Edit Event</Text>
                <TouchableOpacity onPress={() => setEditEvent(null)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </LinearGradient>
              <ScrollView style={styles.modalBody}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Title *</Text>
                  <TextInput
                    style={styles.input}
                    value={editEvent.title}
                    onChangeText={(text) => setEditEvent({ ...editEvent, title: text })}
                    placeholder="Enter event title"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={editEvent.description}
                    onChangeText={(text) => setEditEvent({ ...editEvent, description: text })}
                    placeholder="Enter event description"
                    multiline
                    numberOfLines={3}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Start Date *</Text>
                  <TextInput
                    style={styles.input}
                    value={editEvent.start_date}
                    onChangeText={(text) => setEditEvent({ ...editEvent, start_date: text })}
                    placeholder="YYYY-MM-DDTHH:mm:ssZ"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>End Date *</Text>
                  <TextInput
                    style={styles.input}
                    value={editEvent.end_date}
                    onChangeText={(text) => setEditEvent({ ...editEvent, end_date: text })}
                    placeholder="YYYY-MM-DDTHH:mm:ssZ"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Location</Text>
                  <TextInput
                    style={styles.input}
                    value={editEvent.location}
                    onChangeText={(text) => setEditEvent({ ...editEvent, location: text })}
                    placeholder="Enter location"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Type</Text>
                  <TextInput
                    style={styles.input}
                    value={editEvent.event_type}
                    onChangeText={(text) => setEditEvent({ ...editEvent, event_type: text })}
                    placeholder="e.g. Worship, Study, Youth, etc."
                  />
                </View>
              </ScrollView>
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setEditEvent(null)} disabled={actionLoading}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleEditEvent} disabled={actionLoading}>
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.saveButtonGradient}
                  >
                    <Text style={styles.saveButtonText}>{actionLoading ? 'Saving...' : 'Save Changes'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteEvent} disabled={actionLoading}>
                  <Text style={styles.deleteButtonText}>{actionLoading ? 'Deleting...' : 'Delete'}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.addToCalendarBtn} onPress={() => handleAddToCalendar(editEvent)} disabled={actionLoading}>
                <MaterialIcons name="event-available" size={22} color="#fff" />
                <Text style={styles.addToCalendarText}>Add to Calendar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  retryGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  addButton: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  addButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    marginVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#64748b',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  typeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  locationText: {
    fontSize: 12,
    color: '#64748b',
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  attendeesText: {
    fontSize: 12,
    color: '#64748b',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: '#007AFF',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    width: '90%',
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalClose: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 12,
    fontSize: 15,
    color: '#1e293b',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  cancelButton: {
    borderRadius: 10,
    overflow: 'hidden',
    padding: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  saveButton: {
    borderRadius: 10,
    overflow: 'hidden',
    padding: 8,
  },
  saveButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  rsvpButton: {
    backgroundColor: '#F0F1F3',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
  },
  rsvpButtonActive: {
    backgroundColor: '#007AFF',
  },
  rsvpButtonText: {
    color: '#222',
    fontWeight: '500',
  },
  rsvpButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#fff0f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#ff4d4f',
  },
  deleteButtonText: {
    color: '#ff4d4f',
    fontWeight: 'bold',
    fontSize: 16,
  },
  viewToggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  viewToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 8,
  },
  viewToggleBtnActive: {
    backgroundColor: '#667eea',
  },
  viewToggleText: {
    color: '#667eea',
    fontWeight: '500',
    marginLeft: 6,
    fontSize: 16,
  },
  viewToggleTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  calendar: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 2,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  selectedDateLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
    marginLeft: 20,
    marginTop: 8,
  },
  noEventsText: {
    fontSize: 15,
    color: '#94a3b8',
    marginLeft: 20,
    marginTop: 8,
  },
  addToCalendarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 12,
    alignSelf: 'center',
  },
  addToCalendarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
}); 