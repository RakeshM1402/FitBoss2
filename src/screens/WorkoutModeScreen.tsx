import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme';

export default function WorkoutModeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Workout Timer goes here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  text: { ...typography.body, color: colors.textMuted },
});
