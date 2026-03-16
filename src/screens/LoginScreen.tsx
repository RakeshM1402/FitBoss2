import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useAppStore } from '../context/store';
import { colors, spacing, typography } from '../theme';

export default function LoginScreen() {
  const loginAsGuest = useAppStore(state => state.loginAsGuest);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Icon name="activity" size={64} color={colors.primary} />
          <Text style={styles.title}>Fit Boss</Text>
          <Text style={styles.subtitle}>Own your fitness journey</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={loginAsGuest}
          >
            <Icon name="user" size={20} color={colors.background} style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.huge,
    marginTop: spacing.m,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  buttonContainer: {
    gap: spacing.m,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.m,
    borderRadius: 12,
  },
  buttonIcon: {
    marginRight: spacing.s,
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '700',
  },
});
