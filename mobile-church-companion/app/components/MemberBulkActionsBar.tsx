import React from 'react';
import { View, Text } from 'react-native';

interface MemberBulkActionsBarProps {
  selectedIds: string[];
  onCancelSelection: () => void;
  onBulkDelete: () => void;
  onBulkStatus: (status: 'active' | 'inactive') => void;
  onBulkAssignDept: () => void;
  onBulkAssignRole: () => void;
  onBulkSendMessage: () => void;
  onExportMembers: () => void;
  onExportMembersPDF: () => void;
}

export default function MemberBulkActionsBar({ selectedIds, onCancelSelection, onBulkDelete, onBulkStatus, onBulkAssignDept, onBulkAssignRole, onBulkSendMessage, onExportMembers, onExportMembersPDF }: MemberBulkActionsBarProps) {
  return (
    <View style={{ padding: 16, backgroundColor: '#eef2ff' }}>
      <Text>Bulk Actions Bar (stub) - {selectedIds.length} selected</Text>
    </View>
  );
} 