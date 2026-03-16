-- fitboss schema setup

-- 1. ENUMS
CREATE TYPE activity_level AS ENUM ('sedentary', 'light', 'moderate', 'active', 'very_active');
CREATE TYPE nutrition_source AS ENUM ('usda', 'openfoodfacts', 'manual');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE score_reason AS ENUM ('daily_rollup', 'workout_bonus', 'calorie_goal_met', 'manual');

-- 2. TABLES

-- Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY, -- Maps to local UUID
  email TEXT,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender gender_type NOT NULL,
  height_cm NUMERIC NOT NULL,
  weight_kg NUMERIC NOT NULL,
  activity_level activity_level NOT NULL,
  body_fat_percentage NUMERIC,
  bmr NUMERIC NOT NULL,
  daily_calorie_goal NUMERIC NOT NULL,
  onboarding_completed BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Food Logs Table
CREATE TABLE IF NOT EXISTS public.food_logs (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL, -- Storing as TEXT to accommodate guest IDs or Auth IDs
  food_name TEXT NOT NULL,
  calories NUMERIC NOT NULL,
  protein_g NUMERIC NOT NULL,
  carbs_g NUMERIC NOT NULL,
  fat_g NUMERIC NOT NULL,
  serving_size_g NUMERIC NOT NULL,
  source nutrition_source NOT NULL,
  date_key TEXT NOT NULL, -- Format: YYYY-MM-DD
  consumed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Workouts Table
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  calories_burned NUMERIC,
  date_key TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Fitness Scores Table
CREATE TABLE IF NOT EXISTS public.fitness_scores (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  date_key TEXT NOT NULL,
  score INTEGER NOT NULL,
  reason score_reason NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. INDEXES for fast querying
CREATE INDEX idx_food_logs_user_date ON public.food_logs(user_id, date_key);
CREATE INDEX idx_workouts_user_date ON public.workouts(user_id, date_key);
CREATE INDEX idx_scores_user_date ON public.fitness_scores(user_id, date_key);

-- 4. RPC FUNCTIONS (Leaderboards)

-- Weekly Leaderboard RPC
CREATE OR REPLACE FUNCTION get_weekly_leaderboard(target_date_key TEXT)
RETURNS TABLE (
    user_id TEXT,
    name TEXT,
    total_score BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fs.user_id,
    u.name,
    SUM(fs.score) as total_score
  FROM public.fitness_scores fs
  JOIN public.users u ON fs.user_id = u.id::text
  -- Assuming target_date_key is within the current week, a real impl would filter by a date range
  WHERE fs.date_key >= (current_date - interval '7 days')::text
  GROUP BY fs.user_id, u.name
  ORDER BY total_score DESC
  LIMIT 100;
END;
$$;

-- All Time Leaderboard RPC
CREATE OR REPLACE FUNCTION get_all_time_leaderboard()
RETURNS TABLE (
    user_id TEXT,
    name TEXT,
    total_score BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fs.user_id,
    u.name,
    SUM(fs.score) as total_score
  FROM public.fitness_scores fs
  JOIN public.users u ON fs.user_id = u.id::text
  GROUP BY fs.user_id, u.name
  ORDER BY total_score DESC
  LIMIT 100;
END;
$$;

-- 5. ROW LEVEL SECURITY (RLS)

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_scores ENABLE ROW LEVEL SECURITY;

-- Note: Because we are currently allowing "guest" string IDs, standard auth.uid() checks 
-- won't work out of the box unless users are signed in via Supabase Auth.
-- For a true offline-first Guest mode with Supabase syncing, you either need to globally
-- allow inserts, or require actual Anonymous Auth sessions from Supabase.

-- Policy: Allow anyone to insert (since we have guest mode for now)
CREATE POLICY "Enable insert for all users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON public.food_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON public.workouts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON public.fitness_scores FOR INSERT WITH CHECK (true);

-- Policy: Allow reading own data (if we passed user_id)
CREATE POLICY "Enable read for own data" ON public.users FOR SELECT USING (true); 
CREATE POLICY "Enable read for own data" ON public.food_logs FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id LIKE 'guest-%');
CREATE POLICY "Enable read for own data" ON public.workouts FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id LIKE 'guest-%');
CREATE POLICY "Enable read for own data" ON public.fitness_scores FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR user_id LIKE 'guest-%');
