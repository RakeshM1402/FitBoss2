export const colors = {
  primary: '#4ADE80', // Vibrant Green
  background: '#111827', // Dark Gray/Black
  card: '#1F2937', 
  text: '#F9FAFB',
  textMuted: '#9CA3AF',
  border: '#374151',
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  huge: { fontSize: 32, fontWeight: '700' as const, color: colors.text },
  h1: { fontSize: 24, fontWeight: '700' as const, color: colors.text },
  h2: { fontSize: 18, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 16, color: colors.text },
  caption: { fontSize: 14, color: colors.textMuted },
};
