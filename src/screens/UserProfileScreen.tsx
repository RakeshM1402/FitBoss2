import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppStore } from '../context/store';
import { colors, typography, spacing } from '../theme';

export default function UserProfileScreen() {
  const logout = useAppStore(state => state.logout);
  const profile = useAppStore(state => state.profile);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.text}>{profile?.name}</Text>
      <Text style={styles.text}>{profile?.email}</Text>
      
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.l, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  title: { ...typography.h1, marginBottom: spacing.m },
  text: { ...typography.body, color: colors.textMuted, marginBottom: spacing.s },
  button: {
    backgroundColor: colors.card,
    padding: spacing.m,
    borderRadius: 8,
    marginTop: spacing.xl,
    borderWidth: 1, 
    borderColor: colors.danger
  },
  buttonText: { color: colors.danger, fontWeight: '700' },
});
