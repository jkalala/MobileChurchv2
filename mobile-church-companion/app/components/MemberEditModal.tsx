import React from 'react';
import { View, Text, Modal, Button } from 'react-native';
import { Member } from './MemberList';

interface MemberEditModalProps {
  visible: boolean;
  member: Member | null;
  onClose: () => void;
  onSave: () => void;
}

export default function MemberEditModal({ visible, member, onClose, onSave }: MemberEditModalProps) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Member Edit Modal (stub)</Text>
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
} 