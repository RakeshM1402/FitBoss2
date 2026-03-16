import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../context/store';
import { colors, spacing, typography } from '../theme';

export default function DashboardScreen() {
  const profile = useAppStore(state => state.profile);
  const totalScore = useAppStore(state => state.totalScore);
  const currentStreak = useAppStore(state => state.currentStreak);
  const navigation = useNavigation<any>();

  // In a real app we would compute these from today's foodLogs
  const caloriesConsumed = 0; 
  const caloriesRemaining = (profile?.dailyCalorieGoal || 2000) - caloriesConsumed;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {profile?.name}!</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Icon name="zap" size={16} color={colors.warning} />
            <Text style={styles.streakText}>{currentStreak} Days</Text>
          </View>
        </View>

        {/* Global Score Card */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Total Fitness Score</Text>
          <Text style={styles.scoreValue}>{totalScore.toLocaleString()}</Text>
          <Text style={styles.scoreSub}>Top 15% this week</Text>
        </View>

        {/* Daily Macros (Simplified) */}
        <Text style={styles.sectionTitle}>Today's Nutrition</Text>
        <View style={styles.macroRow}>
          <View style={styles.macroCard}>
            <Text style={styles.macroValue}>{caloriesConsumed}</Text>
            <Text style={styles.macroLabel}>Consumed</Text>
          </View>
          <View style={styles.macroCard}>
            <Text style={[styles.macroValue, { color: colors.primary }]}>{caloriesRemaining}</Text>
            <Text style={styles.macroLabel}>Remaining</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddFood')}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(74, 222, 128, 0.15)' }]}>
              <Icon name="coffee" size={24} color={colors.primary} />
            </View>
            <Text style={styles.actionText}>Log Food</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('WorkoutMode')}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
              <Icon name="activity" size={24} color={colors.danger} />
            </View>
            <Text style={styles.actionText}>Workout</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.m },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.l },
  greeting: { ...typography.h1 },
  date: { ...typography.caption, marginTop: 2 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.warning },
  streakText: { color: colors.warning, fontWeight: '700', marginLeft: 4 },
  
  scoreCard: { backgroundColor: colors.primary, padding: spacing.l, borderRadius: 16, marginBottom: spacing.l, alignItems: 'center' },
  scoreLabel: { color: colors.background, fontWeight: '600', opacity: 0.8 },
  scoreValue: { color: colors.background, fontSize: 48, fontWeight: '800', marginVertical: spacing.xs },
  scoreSub: { color: colors.background, fontWeight: '500', opacity: 0.9 },
  
  sectionTitle: { ...typography.h2, marginBottom: spacing.m, marginTop: spacing.s },
  macroRow: { flexDirection: 'row', gap: spacing.m, marginBottom: spacing.l },
  macroCard: { flex: 1, backgroundColor: colors.card, padding: spacing.m, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  macroValue: { ...typography.h1 },
  macroLabel: { ...typography.caption, marginTop: 4 },
  
  actionRow: { flexDirection: 'row', gap: spacing.m },
  actionButton: { flex: 1, backgroundColor: colors.card, padding: spacing.l, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  iconWrapper: { padding: 16, borderRadius: 32, marginBottom: spacing.m },
  actionText: { ...typography.h2 },
});
