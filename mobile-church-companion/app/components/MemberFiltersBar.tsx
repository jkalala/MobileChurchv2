import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';

interface MemberFiltersBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  filterOptions: { label: string; value: string }[];
}

export default function MemberFiltersBar({ searchQuery, setSearchQuery, activeFilter, setActiveFilter, filterOptions }: MemberFiltersBarProps) {
  return (
    <View style={{ backgroundColor: 'transparent', paddingTop: 8, paddingBottom: 4 }}>
      {/* Floating Search Bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: 24,
          marginHorizontal: 16,
          marginBottom: 8,
          paddingHorizontal: 16,
          paddingVertical: 6,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }}
      >
        <Text style={{ fontSize: 18, color: '#64748b', marginRight: 8 }}>🔍</Text>
        <TextInput
          style={{
            flex: 1,
            height: 36,
            fontSize: 16,
            color: '#1e293b',
            backgroundColor: 'transparent',
          }}
          placeholder="Search members..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
      </View>
      {/* Pill Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16, paddingRight: 8, alignItems: 'center' }}
        style={{ minHeight: 40 }}
      >
        {filterOptions.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            onPress={() => setActiveFilter(opt.value)}
            style={{
              backgroundColor: activeFilter === opt.value ? '#6366f1' : '#f1f5f9',
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 8,
              marginRight: 8,
              borderWidth: 1,
              borderColor: activeFilter === opt.value ? '#6366f1' : 'transparent',
            }}
          >
            <Text style={{ color: activeFilter === opt.value ? '#fff' : '#64748b', fontWeight: 'bold', fontSize: 15 }}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
} 