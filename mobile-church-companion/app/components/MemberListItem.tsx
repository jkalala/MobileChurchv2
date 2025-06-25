import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Member } from './MemberList';

interface MemberListItemProps {
  member: Member;
  selected: boolean;
  selectionMode: boolean;
  onPress: () => void;
  onLongPress: () => void;
  onSelect: () => void;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function MemberListItem({ member, selected, selectionMode, onPress, onLongPress, onSelect }: MemberListItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: selected ? '#eef2ff' : '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderColor: '#f1f5f9',
        minHeight: 64,
      }}
    >
      {/* Avatar */}
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: '#c7d2fe',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 14,
          overflow: 'hidden',
        }}
      >
        {member.photo ? (
          <Image source={{ uri: member.photo }} style={{ width: 44, height: 44, borderRadius: 22 }} />
        ) : (
          <Text style={{ color: '#3730a3', fontWeight: 'bold', fontSize: 18 }}>{getInitials(member.name)}</Text>
        )}
      </View>
      {/* Info */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#1e293b', marginBottom: 2 }} numberOfLines={1}>
          {member.name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Role pill */}
          <View style={{ backgroundColor: '#6366f1', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginRight: 6 }}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{member.role}</Text>
          </View>
          {/* Department pill */}
          {member.department ? (
            <View style={{ backgroundColor: '#fbbf24', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginRight: 6 }}>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{member.department}</Text>
            </View>
          ) : null}
          {/* Status dot */}
          {member.status && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: member.status === 'active' ? '#22c55e' : '#f87171',
                  marginRight: 4,
                }}
              />
              <Text style={{ color: '#64748b', fontSize: 12 }}>{member.status}</Text>
            </View>
          )}
        </View>
      </View>
      {/* Selection checkbox (if in selection mode) */}
      {selectionMode && (
        <TouchableOpacity
          onPress={onSelect}
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: selected ? '#6366f1' : '#cbd5e1',
            backgroundColor: selected ? '#6366f1' : '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 10,
          }}
        >
          {selected ? (
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#fff' }} />
          ) : null}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
} 