import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import { apiService } from '../../lib/api';

const CHURCH_LOCATION = {
  latitude: -8.8137,
  longitude: 13.2302,
  radius: 100, // meters
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // meters
}

export default function AttendanceScreen() {
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [error, setError] = useState('');

  const handleCheckIn = async () => {
    setCheckingIn(true);
    setError('');
    setStatusMsg('');
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied.');
        setCheckingIn(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      const distance = calculateDistance(
        loc.coords.latitude,
        loc.coords.longitude,
        CHURCH_LOCATION.latitude,
        CHURCH_LOCATION.longitude
      );
      if (distance > CHURCH_LOCATION.radius) {
        setError('You are not at the church location.');
        setCheckingIn(false);
        return;
      }
      // Call API to record attendance
      const { error: apiError } = await apiService.recordAttendance({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        timestamp: Date.now(),
      });
      if (apiError) {
        setError('Failed to record attendance.');
      } else {
        setCheckedIn(true);
        setStatusMsg('Check-in successful!');
      }
    } catch (e) {
      setError('Check-in failed.');
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F6F7', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#222', marginBottom: 16 }}>Attendance & Check-in</Text>
      <Text style={{ fontSize: 16, color: '#64748b', marginBottom: 32 }}>
        {checkedIn ? 'You have checked in for today.' : 'Check in when you arrive at church.'}
      </Text>
      {statusMsg ? (
        <Text style={{ color: '#22c55e', fontSize: 16, marginBottom: 16 }}>{statusMsg}</Text>
      ) : null}
      {error ? (
        <Text style={{ color: '#ef4444', fontSize: 16, marginBottom: 16 }}>{error}</Text>
      ) : null}
      <TouchableOpacity
        onPress={handleCheckIn}
        disabled={checkingIn || checkedIn}
        style={{
          backgroundColor: checkedIn ? '#22c55e' : '#6366f1',
          borderRadius: 24,
          paddingHorizontal: 36,
          paddingVertical: 16,
          marginBottom: 24,
          shadowColor: '#6366f1',
          shadowOpacity: 0.15,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }}
      >
        {checkingIn ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
            {checkedIn ? 'Checked In' : 'Check In Now'}
          </Text>
        )}
      </TouchableOpacity>
      {/* Placeholder for future stats/history */}
      <View style={{ marginTop: 32, alignItems: 'center' }}>
        <Text style={{ color: '#64748b', fontSize: 15, marginBottom: 8 }}>Attendance history and stats coming soon.</Text>
      </View>
    </View>
  );
} 