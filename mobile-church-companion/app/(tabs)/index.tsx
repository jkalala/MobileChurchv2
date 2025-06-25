import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function IndexScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section with Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Connectus</Text>
            <Text style={styles.tagline}>Connecting hearts, building community</Text>
          </View>
          <View style={styles.userProfile}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#ff6b6b', '#ee5a24']}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </LinearGradient>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.userName}>{user?.email}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statsGrid}>
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            style={styles.statCard}
          >
            <Text style={styles.statNumber}>150</Text>
            <Text style={styles.statLabel}>Members</Text>
            <Text style={styles.statIcon}>👥</Text>
          </LinearGradient>
          
          <LinearGradient
            colors={['#43e97b', '#38f9d7']}
            style={styles.statCard}
          >
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Events</Text>
            <Text style={styles.statIcon}>📅</Text>
          </LinearGradient>
          
          <LinearGradient
            colors={['#fa709a', '#fee140']}
            style={styles.statCard}
          >
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Departments</Text>
            <Text style={styles.statIcon}>🏢</Text>
          </LinearGradient>
        </View>
      </View>

      {/* Features Grid */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.featuresGrid}>
          <TouchableOpacity style={styles.featureCard}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.featureGradient}
            >
              <Text style={styles.featureIcon}>👥</Text>
            </LinearGradient>
            <Text style={styles.featureTitle}>Members</Text>
            <Text style={styles.featureSubtitle}>Manage church members</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.featureCard}>
            <LinearGradient
              colors={['#f093fb', '#f5576c']}
              style={styles.featureGradient}
            >
              <Text style={styles.featureIcon}>📅</Text>
            </LinearGradient>
            <Text style={styles.featureTitle}>Events</Text>
            <Text style={styles.featureSubtitle}>View upcoming events</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.featureCard}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              style={styles.featureGradient}
            >
              <Text style={styles.featureIcon}>📖</Text>
            </LinearGradient>
            <Text style={styles.featureTitle}>Bible Study</Text>
            <Text style={styles.featureSubtitle}>Access study materials</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.featureCard}>
            <LinearGradient
              colors={['#43e97b', '#38f9d7']}
              style={styles.featureGradient}
            >
              <Text style={styles.featureIcon}>🎵</Text>
            </LinearGradient>
            <Text style={styles.featureTitle}>Music</Text>
            <Text style={styles.featureSubtitle}>Worship resources</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.featureCard}>
            <LinearGradient
              colors={['#fa709a', '#fee140']}
              style={styles.featureGradient}
            >
              <Text style={styles.featureIcon}>💰</Text>
            </LinearGradient>
            <Text style={styles.featureTitle}>Finance</Text>
            <Text style={styles.featureSubtitle}>Financial management</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.featureCard}>
            <LinearGradient
              colors={['#a8edea', '#fed6e3']}
              style={styles.featureGradient}
            >
              <Text style={styles.featureIcon}>📊</Text>
            </LinearGradient>
            <Text style={styles.featureTitle}>Analytics</Text>
            <Text style={styles.featureSubtitle}>Church insights</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.activitySection}>
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
          
          <View style={styles.activityItem}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              style={styles.activityIcon}
            >
              <Text style={styles.activityEmoji}>📊</Text>
            </LinearGradient>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Report generated</Text>
              <Text style={styles.activitySubtitle}>Monthly attendance report</Text>
              <Text style={styles.activityTime}>3 days ago</Text>
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
  heroSection: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    textAlign: 'center',
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 16,
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 2,
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 3,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
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
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 20,
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
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
  featureGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 28,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureSubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
  activitySection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
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
});
