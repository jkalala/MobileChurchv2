import React from 'react';
import { View, Text, Modal, Button } from 'react-native';
import { Member } from './MemberList';

interface MemberDetailsModalProps {
  visible: boolean;
  member: Member | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export default function MemberDetailsModal({ visible, member, onClose, onEdit, onDelete }: MemberDetailsModalProps) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Member Details Modal (stub)</Text>
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
} 