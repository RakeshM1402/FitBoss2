import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../context/store';
import { ActivityLevel, Gender } from '../types';
import { colors, spacing, typography } from '../theme';

export default function OnboardingSurveyScreen() {
  const saveProfile = useAppStore(state => state.saveProfile);
  
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');

  const handleComplete = () => {
    if (!name || !age || !weight || !height) return;
    
    saveProfile({
      name,
      age: parseInt(age, 10),
      weightKg: parseFloat(weight),
      heightCm: parseFloat(height),
      gender,
      activityLevel,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Let's get started</Text>
        <Text style={styles.subtitle}>Tell us about yourself to compute your goals.</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput 
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="John Doe"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: spacing.s }]}>
            <Text style={styles.label}>Age</Text>
            <TextInput 
              style={styles.input}
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              placeholder="30"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={[styles.formGroup, { flex: 1, marginLeft: spacing.s }]}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.pillContainer}>
              {(['male', 'female'] as Gender[]).map(g => (
                <TouchableOpacity 
                  key={g} 
                  style={[styles.pill, gender === g && styles.pillActive]}
                  onPress={() => setGender(g)}
                >
                  <Text style={[styles.pillText, gender === g && styles.pillTextActive]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: spacing.s }]}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput 
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              placeholder="75"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={[styles.formGroup, { flex: 1, marginLeft: spacing.s }]}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput 
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              keyboardType="decimal-pad"
              placeholder="180"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Activity Level</Text>
          <View style={styles.activityContainer}>
            {(['sedentary', 'light', 'moderate', 'active', 'very_active'] as ActivityLevel[]).map(level => (
              <TouchableOpacity 
                key={level} 
                style={[styles.activityPill, activityLevel === level && styles.activityPillActive]}
                onPress={() => setActivityLevel(level)}
              >
                <Text style={[styles.activityText, activityLevel === level && styles.activityTextActive]}>
                  {level.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.button, (!name || !age || !weight || !height) && styles.buttonDisabled]}
          onPress={handleComplete}
          disabled={!name || !age || !weight || !height}
        >
          <Text style={styles.buttonText}>Complete Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.l },
  title: { ...typography.h1, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textMuted, marginBottom: spacing.xl },
  formGroup: { marginBottom: spacing.l },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { ...typography.caption, marginBottom: spacing.s, fontWeight: '600' },
  input: { 
    backgroundColor: colors.card,
    color: colors.text,
    padding: spacing.m,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
  },
  pillContainer: { flexDirection: 'row', gap: spacing.s, height: 50 },
  pill: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: colors.card, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { color: colors.textMuted, textTransform: 'capitalize', fontWeight: '600' },
  pillTextActive: { color: colors.background },
  activityContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  activityPill: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  activityText: { color: colors.textMuted, textTransform: 'capitalize', fontSize: 14, fontWeight: '600' },
  activityTextActive: { color: colors.background },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.m,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: colors.background, fontSize: 18, fontWeight: '700' },
});
