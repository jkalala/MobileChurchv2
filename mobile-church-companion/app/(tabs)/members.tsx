import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, TextInput, Dimensions, Modal, ScrollView, Animated, Pressable, Easing, Image } from 'react-native';
import { apiService } from '../../lib/api';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView as RNScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';
import Papa from 'papaparse';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import MemberList from '../components/MemberList';
import MemberFiltersBar from '../components/MemberFiltersBar';
import MemberBulkActionsBar from '../components/MemberBulkActionsBar';
import MemberDetailsModal from '../components/MemberDetailsModal';
import MemberEditModal from '../components/MemberEditModal';

const { width } = Dimensions.get('window');

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  join_date?: string;
  department?: string;
  status?: 'active' | 'inactive';
  age?: number;
  family_size?: number;
  photo?: string;
}

type ViewMode = 'list' | 'grid';
type FilterType = 'all' | 'leaders' | 'volunteers' | 'members' | 'active' | 'inactive';

export default function MembersScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Add member form state
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Member',
    department: '',
    address: '',
  });

  // Add photo state for new member
  const [newMemberPhoto, setNewMemberPhoto] = useState<string | null>(null);

  // Add photo state for editing member
  const [editMemberPhoto, setEditMemberPhoto] = useState<string | null>(null);

  // Filter options
  const filterOptions: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Leaders', value: 'leaders' },
    { label: 'Volunteers', value: 'volunteers' },
    { label: 'Members', value: 'members' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  // Bulk selection state
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Add assign department modal state
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptOptions, setDeptOptions] = useState<string[]>(['Worship', 'Youth', 'Outreach', 'Children', 'Music', 'Prayer']); // Replace with API fetch if available
  const [selectedDept, setSelectedDept] = useState<string>('');

  // Assign role modal state
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleOptions, setRoleOptions] = useState<string[]>(['Leader', 'Volunteer', 'Member']);
  const [selectedRole, setSelectedRole] = useState<string>('');

  // Send message modal state
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [messageText, setMessageText] = useState('');

  // Animation state for card selection
  const [selectedAnim] = useState<{ [id: string]: Animated.Value }>({});

  // Animate card selection
  const animateCard = (id: string, selected: boolean) => {
    if (!selectedAnim[id]) selectedAnim[id] = new Animated.Value(1);
    Animated.timing(selectedAnim[id], {
      toValue: selected ? 0.97 : 1,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [searchQuery, members, activeFilter]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 5000)
      );

      const apiPromise = apiService.getMembers();

      const { data, error: apiError } = await Promise.race([apiPromise, timeoutPromise]) as any;

      if (apiError) {
        setError(apiError);
        // Fallback to mock data for demo purposes
        const mockMembers: Member[] = [
          { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Member', phone: '+1 234-567-8900', department: 'Worship', status: 'active', age: 35, family_size: 4 },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Leader', phone: '+1 234-567-8901', department: 'Youth', status: 'active', age: 28, family_size: 2 },
          { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Member', phone: '+1 234-567-8902', department: 'Outreach', status: 'active', age: 42, family_size: 3 },
          { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Volunteer', phone: '+1 234-567-8903', department: 'Children', status: 'active', age: 31, family_size: 5 },
          { id: '5', name: 'David Brown', email: 'david@example.com', role: 'Member', phone: '+1 234-567-8904', department: 'Music', status: 'inactive', age: 55, family_size: 2 },
          { id: '6', name: 'Emily Davis', email: 'emily@example.com', role: 'Leader', phone: '+1 234-567-8905', department: 'Prayer', status: 'active', age: 39, family_size: 3 },
        ];
        setMembers(mockMembers);
      } else {
        setMembers(data as Member[] || []);
      }
    } catch (err) {
      setError('Failed to load members');
      // Always provide fallback data
      const mockMembers: Member[] = [
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Member', phone: '+1 234-567-8900', department: 'Worship', status: 'active', age: 35, family_size: 4 },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Leader', phone: '+1 234-567-8901', department: 'Youth', status: 'active', age: 28, family_size: 2 },
        { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Member', phone: '+1 234-567-8902', department: 'Outreach', status: 'active', age: 42, family_size: 3 },
        { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Volunteer', phone: '+1 234-567-8903', department: 'Children', status: 'active', age: 31, family_size: 5 },
        { id: '5', name: 'David Brown', email: 'david@example.com', role: 'Member', phone: '+1 234-567-8904', department: 'Music', status: 'inactive', age: 55, family_size: 2 },
        { id: '6', name: 'Emily Davis', email: 'emily@example.com', role: 'Leader', phone: '+1 234-567-8905', department: 'Prayer', status: 'active', age: 39, family_size: 3 },
      ];
      setMembers(mockMembers);
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;

    // Apply role/department filter
    switch (activeFilter) {
      case 'leaders':
        filtered = filtered.filter(member => member.role.toLowerCase() === 'leader');
        break;
      case 'volunteers':
        filtered = filtered.filter(member => member.role.toLowerCase() === 'volunteer');
        break;
      case 'members':
        filtered = filtered.filter(member => member.role.toLowerCase() === 'member');
        break;
      case 'active':
        filtered = filtered.filter(member => member.status === 'active');
        break;
      case 'inactive':
        filtered = filtered.filter(member => member.status === 'inactive');
        break;
      default:
        break;
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.department?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMembers(filtered);
  };

  // Helper: upload image to Supabase Storage
  const uploadMemberPhoto = async (uri: string, memberId: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileExt = uri.split('.').pop();
    const filePath = `members/${memberId}.${fileExt}`;
    const { data, error } = await supabase.storage.from('members').upload(filePath, blob, { upsert: true });
    if (error) throw error;
    const { data: publicUrl } = supabase.storage.from('members').getPublicUrl(filePath);
    return publicUrl.publicUrl;
  };

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.email) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }
    setActionLoading(true);
    try {
      let photoUrl = null;
      if (newMemberPhoto) {
        photoUrl = await uploadMemberPhoto(newMemberPhoto, newMember.email.replace(/[^a-zA-Z0-9]/g, ''));
      }
      const { data, error: apiError } = await apiService.createMember({ ...newMember, photo: photoUrl });
      if (apiError) {
        Alert.alert('Error', apiError);
      } else {
        setShowAddModal(false);
        setNewMember({ name: '', email: '', phone: '', role: 'Member', department: '', address: '' });
        setNewMemberPhoto(null);
        await loadMembers();
        Alert.alert('Success', 'Member added successfully!');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to add member');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditMember = async (updatedMember: Member) => {
    setActionLoading(true);
    try {
      const { data, error: apiError } = await apiService.updateMember(updatedMember.id, updatedMember);
      if (apiError) {
        Alert.alert('Error', apiError);
      } else {
        setSelectedMember(null);
        await loadMembers();
        Alert.alert('Success', 'Member updated successfully!');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update member');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    Alert.alert(
      'Delete Member',
      'Are you sure you want to delete this member?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setActionLoading(true);
            try {
              const { error: apiError } = await apiService.deleteMember(memberId);
              if (apiError) {
                Alert.alert('Error', apiError);
              } else {
                setSelectedMember(null);
                await loadMembers();
                Alert.alert('Deleted', 'Member deleted successfully!');
              }
            } catch (err) {
              Alert.alert('Error', 'Failed to delete member');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleMemberPress = (member: Member) => {
    setSelectedMember(member);
    setShowDetailsModal(true);
  };

  // Enter selection mode by long-press or button
  const handleLongPressMember = (member: Member) => {
    setSelectionMode(true);
    setSelectedIds([member.id]);
  };
  const handleSelectButton = () => {
    setSelectionMode(true);
    setSelectedIds([]);
  };
  const handleSelectMember = (memberId: string) => {
    setSelectedIds(ids => ids.includes(memberId) ? ids.filter(id => id !== memberId) : [...ids, memberId]);
  };
  const handleCancelSelection = () => {
    setSelectionMode(false);
    setSelectedIds([]);
  };
  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    Alert.alert('Delete Members', `Delete ${selectedIds.length} selected members?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        setActionLoading(true);
        try {
          await Promise.all(selectedIds.map(id => apiService.deleteMember(id)));
          await loadMembers();
          setSelectionMode(false);
          setSelectedIds([]);
          Alert.alert('Deleted', 'Selected members deleted.');
        } catch {
          Alert.alert('Error', 'Failed to delete selected members.');
        } finally {
          setActionLoading(false);
        }
      }}
    ]);
  };
  // Bulk status change
  const handleBulkStatus = async (status: 'active' | 'inactive') => {
    if (selectedIds.length === 0) return;
    setActionLoading(true);
    try {
      await Promise.all(selectedIds.map(id => {
        const member = members.find(m => m.id === id);
        if (!member) return Promise.resolve();
        return apiService.updateMember(id, { ...member, status });
      }));
      await loadMembers();
      setSelectionMode(false);
      setSelectedIds([]);
      Alert.alert('Updated', `Status set to ${status} for selected members.`);
    } catch {
      Alert.alert('Error', 'Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  // Bulk assign department
  const handleBulkAssignDept = async () => {
    if (!selectedDept || selectedIds.length === 0) return;
    setActionLoading(true);
    try {
      await Promise.all(selectedIds.map(id => {
        const member = members.find(m => m.id === id);
        if (!member) return Promise.resolve();
        return apiService.updateMember(id, { ...member, department: selectedDept });
      }));
      await loadMembers();
      setSelectionMode(false);
      setSelectedIds([]);
      setShowDeptModal(false);
      setSelectedDept('');
      Alert.alert('Updated', `Assigned department to selected members.`);
    } catch {
      Alert.alert('Error', 'Failed to assign department.');
    } finally {
      setActionLoading(false);
    }
  };

  // Bulk assign role
  const handleBulkAssignRole = async () => {
    if (!selectedRole || selectedIds.length === 0) return;
    setActionLoading(true);
    try {
      await Promise.all(selectedIds.map(id => {
        const member = members.find(m => m.id === id);
        if (!member) return Promise.resolve();
        return apiService.updateMember(id, { ...member, role: selectedRole });
      }));
      await loadMembers();
      setSelectionMode(false);
      setSelectedIds([]);
      setShowRoleModal(false);
      setSelectedRole('');
      Alert.alert('Updated', `Assigned role to selected members.`);
    } catch {
      Alert.alert('Error', 'Failed to assign role.');
    } finally {
      setActionLoading(false);
    }
  };

  // Bulk send message (demo)
  const handleBulkSendMessage = () => {
    if (!messageText.trim() || selectedIds.length === 0) return;
    setShowMsgModal(false);
    setMessageText('');
    Alert.alert('Message Sent', `Message sent to ${selectedIds.length} members (demo)`);
  };

  // Export members to CSV
  const handleExportMembers = async () => {
    try {
      const exportList = selectionMode && selectedIds.length > 0
        ? members.filter(m => selectedIds.includes(m.id))
        : filteredMembers;
      if (exportList.length === 0) {
        Alert.alert('No members to export');
        return;
      }
      const csv = Papa.unparse(exportList.map(({ id, name, email, role, phone, department, status }) => ({ id, name, email, role, phone, department, status })));
      const fileUri = FileSystem.cacheDirectory + `members_export_${Date.now()}.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });
      await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: 'Export Members CSV' });
    } catch (err) {
      Alert.alert('Export failed', err.message || String(err));
    }
  };

  // Export members to PDF
  const handleExportMembersPDF = async () => {
    try {
      const exportList = selectionMode && selectedIds.length > 0
        ? members.filter(m => selectedIds.includes(m.id))
        : filteredMembers;
      if (exportList.length === 0) {
        Alert.alert('No members to export');
        return;
      }
      // Generate HTML table for PDF
      const tableRows = exportList.map(m => `
        <tr>
          <td>${m.name}</td>
          <td>${m.email}</td>
          <td>${m.role}</td>
          <td>${m.phone || ''}</td>
          <td>${m.department || ''}</td>
          <td>${m.status || ''}</td>
        </tr>
      `).join('');
      const html = `
        <html>
          <head>
            <meta charset=\"utf-8\" />
            <style>
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ccc; padding: 8px; font-size: 12px; }
              th { background: #f1f5f9; }
            </style>
          </head>
          <body>
            <h2>Members Export</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </body>
        </html>
      `;
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Export Members PDF' });
    } catch (err: unknown) {
      const error = err as Error;
      Alert.alert('Export failed', error.message || String(error));
    }
  };

  const getRoleColor = (role: string): [string, string] => {
    switch (role.toLowerCase()) {
      case 'leader': return ['#10b981', '#059669'];
      case 'volunteer': return ['#f59e0b', '#d97706'];
      case 'member': return ['#6366f1', '#4f46e5'];
      default: return ['#6b7280', '#4b5563'];
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'leader': return '👑';
      case 'volunteer': return '🤝';
      case 'member': return '👤';
      default: return '👤';
    }
  };

  const renderMemberList = ({ item }: { item: Member }) => {
    const isSelected = selectionMode && selectedIds.includes(item.id);
    if (!selectedAnim[item.id]) selectedAnim[item.id] = new Animated.Value(1);
    return (
      <Pressable
        onPress={() => {
          if (selectionMode) {
            handleSelectMember(item.id);
            animateCard(item.id, !isSelected);
          } else {
            handleMemberPress(item);
          }
        }}
        onLongPress={() => {
          handleLongPressMember(item);
          animateCard(item.id, true);
        }}
        android_ripple={{ color: '#e0e7ff' }}
      >
        <Animated.View
          style={[
            { transform: [{ scale: selectedAnim[item.id] || 1 }] },
            styles.memberCard,
            isSelected && styles.memberCardSelected,
          ]}
        >
          {selectionMode && (
            <View style={styles.checkboxContainer}>
              {isSelected ? (
                <MaterialCommunityIcons name="checkbox-marked" size={24} color="#667eea" />
              ) : (
                <MaterialCommunityIcons name="checkbox-blank-outline" size={24} color="#cbd5e1" />
              )}
            </View>
          )}
          <View style={styles.memberHeader}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.memberAvatar}
            >
              {item.photo ? (
                <Image source={{ uri: item.photo }} style={styles.memberAvatar} />
              ) : (
                <Text style={styles.avatarText}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              )}
            </LinearGradient>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{item.name}</Text>
              <View style={styles.badgeRow}>
                <View style={[styles.roleBadge, { backgroundColor: '#eef2ff' }]}> 
                  <Text style={styles.roleBadgeText}>{item.role}</Text>
                </View>
                {item.department ? (
                  <View style={[styles.deptBadge, { backgroundColor: '#f0fdf4' }]}> 
                    <Text style={styles.deptBadgeText}>{item.department}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
          <View style={styles.memberMetaRow}>
            {item.status && (
              <Text style={[styles.statusText, { color: item.status === 'active' ? '#10b981' : '#f59e42' }]}>
                {item.status === 'active' ? 'Active' : 'Inactive'}
              </Text>
            )}
            {item.email && <Text style={styles.metaText}>{item.email}</Text>}
            {item.phone && <Text style={styles.metaText}>{item.phone}</Text>}
          </View>
        </Animated.View>
      </Pressable>
    );
  };

  const renderMemberGrid = ({ item }: { item: Member }) => (
    <TouchableOpacity 
      style={styles.memberGridCard}
      onPress={() => handleMemberPress(item)}
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gridAvatar}
      >
        {item.photo ? (
          <Image source={{ uri: item.photo }} style={styles.gridAvatar} />
        ) : (
          <Text style={styles.gridAvatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        )}
      </LinearGradient>
      <Text style={styles.gridMemberName}>{item.name}</Text>
      <Text style={styles.gridMemberRole}>{item.role}</Text>
      {item.department && <Text style={styles.gridMemberDepartment}>{item.department}</Text>}
    </TouchableOpacity>
  );

  // Loading skeletons
  const renderSkeleton = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonAvatar} />
      <View style={styles.skeletonInfo}>
        <View style={styles.skeletonLine} />
        <View style={styles.skeletonLineShort} />
      </View>
    </View>
  );

  // Custom empty state
  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="account-search-outline" size={64} color="#cbd5e1" />
      <Text style={styles.emptyText}>No members found</Text>
      <Text style={styles.emptySubtext}>Try adjusting your search or filters.</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading members...</Text>
      </View>
    );
  }

  // Show error message only if there are no members to display
  const showError = error && filteredMembers.length === 0;

  return (
    <View style={styles.container}>
      {showError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadMembers}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.retryGradient}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Members</Text>
        {!selectionMode && (
          <>
            <TouchableOpacity onPress={handleExportMembers} style={styles.exportButton}>
              <MaterialCommunityIcons name="file-export-outline" size={22} color="#667eea" />
              <Text style={styles.exportButtonText}>Export CSV</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleExportMembersPDF} style={styles.exportButton}>
              <MaterialCommunityIcons name="file-pdf-box" size={22} color="#e63946" />
              <Text style={[styles.exportButtonText, { color: '#e63946' }]}>Export PDF</Text>
            </TouchableOpacity>
          </>
        )}
        {!selectionMode && (
          <TouchableOpacity onPress={handleSelectButton} style={styles.selectButton}>
            <MaterialCommunityIcons name="checkbox-multiple-marked-outline" size={22} color="#667eea" />
            <Text style={styles.selectButtonText}>Select</Text>
          </TouchableOpacity>
        )}
        {selectionMode && (
          <TouchableOpacity onPress={handleCancelSelection} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <MaterialIcons name="search" size={22} color="#64748b" style={{ marginLeft: 12 }} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search members..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Pill Filters */}
      <RNScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterScrollContent}>
        {filterOptions.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.filterPill, activeFilter === opt.value && styles.filterPillActive]}
            onPress={() => setActiveFilter(opt.value)}
          >
            <Text style={[styles.filterPillText, activeFilter === opt.value && styles.filterPillTextActive]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </RNScrollView>

      {/* Members List (Shopify style) */}
      <MemberList
        members={filteredMembers}
        selectionMode={selectionMode}
        selectedIds={selectedIds}
        onMemberPress={handleMemberPress}
        onLongPressMember={handleLongPressMember}
        onSelectMember={handleSelectMember}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.shopifyFab} onPress={() => setShowAddModal(true)}>
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Member Modal */}
      <MemberEditModal
        visible={showAddModal}
        member={null}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddMember}
      />

      {/* Member Details Modal */}
      <MemberDetailsModal
        visible={showDetailsModal}
        member={selectedMember}
        onClose={() => setShowDetailsModal(false)}
        onEdit={() => {/* open edit modal */}}
        onDelete={handleDeleteMember}
      />

      {/* Floating bulk action bar */}
      {selectionMode && selectedIds.length > 0 && (
        <MemberBulkActionsBar
          selectedIds={selectedIds}
          onCancelSelection={handleCancelSelection}
          onBulkDelete={handleBulkDelete}
          onBulkStatus={handleBulkStatus}
          onBulkAssignDept={() => setShowDeptModal(true)}
          onBulkAssignRole={() => setShowRoleModal(true)}
          onBulkSendMessage={() => setShowMsgModal(true)}
          onExportMembers={handleExportMembers}
          onExportMembersPDF={handleExportMembersPDF}
        />
      )}

      {/* Assign Department Modal */}
      <Modal
        visible={showDeptModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDeptModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign Department</Text>
              <TouchableOpacity onPress={() => setShowDeptModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </LinearGradient>
            <ScrollView style={styles.modalBody}>
              {deptOptions.map(dept => (
                <TouchableOpacity
                  key={dept}
                  style={[styles.deptOption, selectedDept === dept && styles.deptOptionSelected]}
                  onPress={() => setSelectedDept(dept)}
                >
                  <Text style={[styles.deptOptionText, selectedDept === dept && styles.deptOptionTextSelected]}>{dept}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.saveButton} onPress={handleBulkAssignDept} disabled={actionLoading || !selectedDept}>
                <LinearGradient colors={['#667eea', '#764ba2']} style={styles.saveButtonGradient}>
                  <Text style={styles.saveButtonText}>{actionLoading ? 'Assigning...' : 'Assign Department'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Assign Role Modal */}
      <Modal
        visible={showRoleModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRoleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign Role</Text>
              <TouchableOpacity onPress={() => setShowRoleModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </LinearGradient>
            <ScrollView style={styles.modalBody}>
              {roleOptions.map(role => (
                <TouchableOpacity
                  key={role}
                  style={[styles.deptOption, selectedRole === role && styles.deptOptionSelected]}
                  onPress={() => setSelectedRole(role)}
                >
                  <Text style={[styles.deptOptionText, selectedRole === role && styles.deptOptionTextSelected]}>{role}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.saveButton} onPress={handleBulkAssignRole} disabled={actionLoading || !selectedRole}>
                <LinearGradient colors={['#667eea', '#764ba2']} style={styles.saveButtonGradient}>
                  <Text style={styles.saveButtonText}>{actionLoading ? 'Assigning...' : 'Assign Role'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Send Message Modal */}
      <Modal
        visible={showMsgModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMsgModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Message</Text>
              <TouchableOpacity onPress={() => setShowMsgModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </LinearGradient>
            <View style={styles.modalBody}>
              <TextInput
                style={styles.input}
                placeholder="Type your message..."
                value={messageText}
                onChangeText={setMessageText}
                multiline
                numberOfLines={4}
              />
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.saveButton} onPress={handleBulkSendMessage} disabled={!messageText.trim()}>
                <LinearGradient colors={['#667eea', '#764ba2']} style={styles.saveButtonGradient}>
                  <Text style={styles.saveButtonText}>Send</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F7',
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 0,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  selectButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '500',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderRadius: 24,
    backgroundColor: 'transparent',
    color: '#1e293b',
    fontSize: 16,
    marginLeft: 8,
    paddingHorizontal: 0,
  },
  filterScroll: {
    marginBottom: 8,
    marginLeft: 8,
  },
  filterScrollContent: {
    paddingRight: 16,
    alignItems: 'center',
  },
  filterPill: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterPillActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  filterPillText: {
    color: '#64748b',
    fontWeight: '500',
    fontSize: 15,
  },
  filterPillTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  shopifyList: {
    flex: 1,
    backgroundColor: '#fff',
  },
  shopifyListContent: {
    paddingBottom: 80,
  },
  shopifyDivider: {
    height: 1,
    backgroundColor: '#F0F1F3',
    marginLeft: 16,
  },
  shopifyFab: {
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
  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
    transitionProperty: 'box-shadow',
    transitionDuration: '200ms',
  },
  memberCardSelected: {
    backgroundColor: '#eef2ff',
    borderColor: '#667eea',
    shadowColor: '#667eea',
    shadowOpacity: 0.15,
    elevation: 8,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    padding: 4,
    borderRadius: 12,
    marginRight: 4,
  },
  roleBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deptBadge: {
    padding: 4,
    borderRadius: 12,
  },
  deptBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  memberMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  metaText: {
    fontSize: 12,
    color: '#64748b',
  },
  memberGridCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  gridAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  gridAvatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  gridMemberName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  gridMemberRole: {
    fontSize: 14,
    color: '#64748b',
  },
  gridMemberDepartment: {
    fontSize: 12,
    color: '#94a3b8',
  },
  checkboxContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
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
    width: '80%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  modalTitle: {
    fontSize: 24,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  roleSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleOption: {
    borderRadius: 12,
    overflow: 'hidden',
    padding: 8,
    marginRight: 8,
  },
  roleOptionActive: {
    backgroundColor: '#667eea',
  },
  roleOptionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  roleOptionTextActive: {
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
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
  detailsAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  avatarTextLarge: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  detailsName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailsLabel: {
    fontSize: 12,
    color: '#64748b',
    marginRight: 8,
  },
  detailsValue: {
    fontSize: 12,
    color: '#1e293b',
  },
  deleteButton: {
    borderRadius: 10,
    overflow: 'hidden',
    padding: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  bulkActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    // Add gradient and shadow
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  bulkActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#667eea',
    marginHorizontal: 8,
    marginVertical: 12,
    shadowColor: '#667eea',
    shadowOpacity: 0.15,
    elevation: 2,
  },
  bulkActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  deptOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  deptOptionSelected: {
    backgroundColor: '#eef2ff',
  },
  deptOptionText: {
    fontSize: 16,
    color: '#222',
  },
  deptOptionTextSelected: {
    color: '#667eea',
    fontWeight: 'bold',
  },
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 14,
  },
  skeletonAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e5e7eb',
    marginRight: 16,
  },
  skeletonInfo: {
    flex: 1,
  },
  skeletonLine: {
    height: 14,
    backgroundColor: '#e5e7eb',
    borderRadius: 7,
    marginBottom: 8,
    width: '80%',
  },
  skeletonLineShort: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    width: '50%',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 64,
  },
  emptyText: {
    fontSize: 20,
    color: '#64748b',
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#94a3b8',
    marginTop: 4,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    marginLeft: 8,
  },
  exportButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
}); 