import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TabType } from '../types/user';
import { Colors } from '../constants/colors';

interface TabButtonProps {
  tab: TabType;
  active: boolean;
  onPress: () => void;
}

export const TabButton: React.FC<TabButtonProps> = ({ tab, active, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, active && styles.activeText]}>{tab}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    fontSize: 15,
    color: Colors.textLight,
    fontWeight: '500',
    textAlign:'center',
    paddingVertical: 4
  },
  activeText: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
