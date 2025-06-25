import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../lib/api';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface DashboardStats {
  totalMembers: number;
  totalEvents: number;
  totalBudget: number;
  recentActivity?: any[];
}

export default function DashboardScreen() {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    totalEvents: 0,
    totalBudget: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadDashboardData();
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      );
      
      const apiPromise = apiService.getAnalytics();
      
      const { data, error } = await Promise.race([apiPromise, timeoutPromise]) as any;
      
      if (error) {
        setError(error);
        console.log('Analytics API error, using fallback data:', error);
        // Fallback to mock data
        setStats({
          totalMembers: 150,
          totalEvents: 12,
          totalBudget: 5240,
        });
      } else {
        setStats(data as DashboardStats || {
          totalMembers: 150,
          totalEvents: 12,
          totalBudget: 5240,
        });
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error loading dashboard data:', err);
      // Always provide fallback data
      setStats({
        totalMembers: 150,
        totalEvents: 12,
        totalBudget: 5240,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleQuickAction = (action: string) => {
    Alert.alert('Quick Action', `${action} feature coming soon!`);
  };

  // Loading skeletons for stats
  const renderStatsSkeleton = () => (
    <View style={styles.statsContainer}>
      {[1, 2, 3].map(i => (
        <View key={i} style={styles.skeletonStatCard}>
          <View style={styles.skeletonStatIcon} />
          <View style={styles.skeletonStatLine} />
          <View style={styles.skeletonStatLineShort} />
        </View>
      ))}
    </View>
  );

  // Error state UI
  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Failed to load dashboard data.</Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadDashboardData}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
        {renderStatsSkeleton()}
      </View>
    );
  }
  if (error) {
    return renderError();
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Header with Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.heroHeader}
      >
        <View style={styles.headerContent}>
          <View style={styles.userSection}>
            <LinearGradient
              colors={['#ff6b6b', '#ee5a24']}
              style={styles.userAvatar}
            >
              <Text style={styles.avatarText}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </LinearGradient>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>Welcome back!</Text>
              <Text style={styles.userName}>{user?.email}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.refreshButton} onPress={loadDashboardData}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.refreshGradient}
            >
              <Text style={styles.refreshIcon}>🔄</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Stats Cards with Gradients */}
      <Animated.View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        opacity: cardAnim,
        transform: [{ translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
      }}>
        <LinearGradient
          colors={['#4facfe', '#00f2fe']}
          style={styles.statCard}
        >
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>👥</Text>
          </View>
          <Text style={styles.statNumber}>{stats.totalMembers}</Text>
          <Text style={styles.statLabel}>Members</Text>
        </LinearGradient>
        <LinearGradient
          colors={['#43e97b', '#38f9d7']}
          style={styles.statCard}
        >
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>📅</Text>
          </View>
          <Text style={styles.statNumber}>{stats.totalEvents}</Text>
          <Text style={styles.statLabel}>Events</Text>
        </LinearGradient>
        <LinearGradient
          colors={['#fa709a', '#fee140']}
          style={styles.statCard}
        >
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>💰</Text>
          </View>
          <Text style={styles.statNumber}>${stats.totalBudget.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Budget</Text>
        </LinearGradient>
      </Animated.View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => handleQuickAction('View Members')}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionIcon}>👥</Text>
            </LinearGradient>
            <Text style={styles.actionTitle}>Members</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => handleQuickAction('Add Event')}
          >
            <LinearGradient
              colors={['#f093fb', '#f5576c']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionIcon}>➕</Text>
            </LinearGradient>
            <Text style={styles.actionTitle}>Add Event</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => handleQuickAction('Bible Study')}
          >
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionIcon}>📖</Text>
            </LinearGradient>
            <Text style={styles.actionTitle}>Bible Study</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => handleQuickAction('Financial Report')}
          >
            <LinearGradient
              colors={['#43e97b', '#38f9d7']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionIcon}>📊</Text>
            </LinearGradient>
            <Text style={styles.actionTitle}>Reports</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.activityIcon}
            >
              <Text style={styles.activityEmoji}>🎉</Text>
            </LinearGradient>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New member joined</Text>
              <Text style={styles.activitySubtitle}>Sarah Wilson joined the church</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <LinearGradient
              colors={['#f093fb', '#f5576c']}
              style={styles.activityIcon}
            >
              <Text style={styles.activityEmoji}>📅</Text>
            </LinearGradient>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Event created</Text>
              <Text style={styles.activitySubtitle}>Sunday Service scheduled</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <LinearGradient
          colors={['#ff6b6b', '#ee5a24']}
          style={styles.signOutGradient}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
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
  heroHeader: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 2,
  },
  refreshButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  refreshGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIcon: {
    fontSize: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 20,
    marginHorizontal: 5,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 20,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  actionGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 28,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityEmoji: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  signOutButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 16,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  signOutGradient: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  signOutText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  skeletonStatCard: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  skeletonStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e5e7eb',
    marginBottom: 12,
  },
  skeletonStatLine: {
    height: 18,
    backgroundColor: '#e5e7eb',
    borderRadius: 9,
    width: 60,
    marginBottom: 8,
  },
  skeletonStatLineShort: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    width: 40,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 