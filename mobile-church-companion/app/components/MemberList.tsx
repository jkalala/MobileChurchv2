import React from 'react';
import { FlatList, View } from 'react-native';
import MemberListItem from './MemberListItem';

export interface Member {
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

interface MemberListProps {
  members: Member[];
  selectionMode: boolean;
  selectedIds: string[];
  onMemberPress: (member: Member) => void;
  onLongPressMember: (member: Member) => void;
  onSelectMember: (id: string) => void;
}

export default function MemberList({ members, selectionMode, selectedIds, onMemberPress, onLongPressMember, onSelectMember }: MemberListProps) {
  return (
    <FlatList
      data={members}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <MemberListItem
          member={item}
          selected={selectedIds?.includes(item.id)}
          selectionMode={selectionMode}
          onPress={() => onMemberPress(item)}
          onLongPress={() => onLongPressMember(item)}
          onSelect={() => onSelectMember(item.id)}
        />
      )}
      contentContainerStyle={{ paddingBottom: 80 }}
    />
  );
} 