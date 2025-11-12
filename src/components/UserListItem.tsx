import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from '../types/user';
import { Avatar } from './Avatar';
import { Colors } from '../constants/colors';

interface UserListItemProps {
  user: User;
  onPress?: (user: User) => void;
}

export const UserListItem: React.FC<UserListItemProps> = ({ user, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(user)}
      activeOpacity={0.7}
    >
      <Avatar name={user.name} />
      <View style={styles.info}>
        <Text style={styles.name}>{user.name}</Text>
      </View>
      <Text style={styles.role}>{user.role}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 16, 
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    color: Colors.text,
  },
  role: {
    fontSize: 14,
    color: Colors.textLight,
  },
});
