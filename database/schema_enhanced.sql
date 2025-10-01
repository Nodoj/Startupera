-- ============================================================================
-- TORAFLOW ENHANCED DATABASE SCHEMA
-- Enterprise-Grade Security with Billing & AI Credits Management
-- ============================================================================

-- This file extends the base schema with:
-- 1. Audit logging for security events
-- 2. Billing and subscription management
-- 3. AI credits and usage tracking
-- 4. Enhanced security features

-- ============================================================================
-- AUDIT LOGGING SYSTEM
-- ============================================================================

-- Audit logs table for security and compliance
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- signin, signout, signup, failed_signin, password_reset, etc.
  resource_type TEXT, -- auth, profile, flow, booking, etc.
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity);

-- ============================================================================
-- BILLING & SUBSCRIPTION MANAGEMENT
-- ============================================================================

-- Subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE, -- free, starter, professional, enterprise
  display_name TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10, 2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10, 2) NOT NULL DEFAULT 0,
  ai_credits_monthly INTEGER NOT NULL DEFAULT 0, -- Monthly AI credit allocation
  max_flows INTEGER DEFAULT NULL, -- NULL = unlimited
  max_team_members INTEGER DEFAULT 1,
  features JSONB DEFAULT '[]', -- Array of feature flags
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  plan_id UUID REFERENCES subscription_plans(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due', 'trialing')),
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment history table
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_invoice_id TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- AI CREDITS MANAGEMENT
-- ============================================================================

-- User AI credits balance
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  balance INTEGER NOT NULL DEFAULT 0, -- Current available credits
  total_earned INTEGER NOT NULL DEFAULT 0, -- Lifetime earned credits
  total_used INTEGER NOT NULL DEFAULT 0, -- Lifetime used credits
  last_refill_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT positive_balance CHECK (balance >= 0)
);

-- Credit transactions log
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Positive for credits added, negative for credits used
  balance_after INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN (
    'subscription_refill', 'purchase', 'bonus', 'refund', 
    'ai_generation', 'api_call', 'admin_adjustment'
  )),
  description TEXT,
  reference_id UUID, -- Reference to related resource (flow, generation, etc.)
  reference_type TEXT, -- Type of related resource
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI usage tracking
CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL, -- 'rag_chatbot', 'image_generation', 'youtube_automation', etc.
  credits_used INTEGER NOT NULL DEFAULT 0,
  input_tokens INTEGER,
  output_tokens INTEGER,
  model_used TEXT, -- e.g., 'gpt-4', 'claude-3', 'dall-e-3'
  request_metadata JSONB DEFAULT '{}',
  response_metadata JSONB DEFAULT '{}',
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  duration_ms INTEGER, -- Request duration in milliseconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SECURITY ENHANCEMENTS
-- ============================================================================

-- Failed login attempts tracking (for rate limiting and security)
CREATE TABLE IF NOT EXISTS failed_login_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT idx_email_ip UNIQUE (email, ip_address, attempted_at)
);

-- Account lockouts
CREATE TABLE IF NOT EXISTS account_lockouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  reason TEXT NOT NULL, -- 'too_many_failed_attempts', 'suspicious_activity', 'admin_action'
  locked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  locked_until TIMESTAMP WITH TIME ZONE,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  unlocked_by UUID REFERENCES profiles(id),
  metadata JSONB DEFAULT '{}'
);

-- Active sessions tracking
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  device_info JSONB DEFAULT '{}',
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Subscription indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_status ON payment_history(status);

-- Credits indexes
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_id ON ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_service_type ON ai_usage_logs(service_type);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created_at ON ai_usage_logs(created_at);

-- Security indexes
CREATE INDEX IF NOT EXISTS idx_failed_login_attempts_email ON failed_login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_failed_login_attempts_ip ON failed_login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_failed_login_attempts_attempted_at ON failed_login_attempts(attempted_at);
CREATE INDEX IF NOT EXISTS idx_account_lockouts_user_id ON account_lockouts(user_id);
CREATE INDEX IF NOT EXISTS idx_account_lockouts_email ON account_lockouts(email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE failed_login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_lockouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Audit logs policies (admin only)
CREATE POLICY "Admins can view all audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Subscription plans policies (public read, admin write)
CREATE POLICY "Anyone can view active subscription plans" ON subscription_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage subscription plans" ON subscription_plans
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- User subscriptions policies
CREATE POLICY "Users can view their own subscription" ON user_subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all subscriptions" ON user_subscriptions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Payment history policies
CREATE POLICY "Users can view their own payment history" ON payment_history
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all payment history" ON payment_history
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- User credits policies
CREATE POLICY "Users can view their own credits" ON user_credits
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all credits" ON user_credits
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Credit transactions policies
CREATE POLICY "Users can view their own credit transactions" ON credit_transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all credit transactions" ON credit_transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- AI usage logs policies
CREATE POLICY "Users can view their own AI usage" ON ai_usage_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all AI usage" ON ai_usage_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- User sessions policies
CREATE POLICY "Users can view their own sessions" ON user_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can revoke their own sessions" ON user_sessions
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to automatically create user credits on profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, balance, total_earned)
  VALUES (NEW.id, 100, 100); -- Start with 100 free credits
  
  -- Log the initial credit grant
  INSERT INTO public.credit_transactions (
    user_id, amount, balance_after, transaction_type, description
  ) VALUES (
    NEW.id, 100, 100, 'bonus', 'Welcome bonus: 100 free AI credits'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic credit creation
DROP TRIGGER IF EXISTS on_profile_created_credits ON profiles;
CREATE TRIGGER on_profile_created_credits
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_credits();

-- Function to deduct credits with transaction logging
CREATE OR REPLACE FUNCTION public.deduct_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_transaction_type TEXT,
  p_description TEXT DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL,
  p_reference_type TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Get current balance with row lock
  SELECT balance INTO v_current_balance
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;
  
  -- Check if user has enough credits
  IF v_current_balance < p_amount THEN
    RETURN FALSE;
  END IF;
  
  -- Calculate new balance
  v_new_balance := v_current_balance - p_amount;
  
  -- Update balance
  UPDATE user_credits
  SET 
    balance = v_new_balance,
    total_used = total_used + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Log transaction
  INSERT INTO credit_transactions (
    user_id, amount, balance_after, transaction_type, 
    description, reference_id, reference_type
  ) VALUES (
    p_user_id, -p_amount, v_new_balance, p_transaction_type,
    p_description, p_reference_id, p_reference_type
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add credits with transaction logging
CREATE OR REPLACE FUNCTION public.add_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_transaction_type TEXT,
  p_description TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Get current balance with row lock
  SELECT balance INTO v_current_balance
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;
  
  -- Calculate new balance
  v_new_balance := v_current_balance + p_amount;
  
  -- Update balance
  UPDATE user_credits
  SET 
    balance = v_new_balance,
    total_earned = total_earned + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Log transaction
  INSERT INTO credit_transactions (
    user_id, amount, balance_after, transaction_type, description
  ) VALUES (
    p_user_id, p_amount, v_new_balance, p_transaction_type, p_description
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old failed login attempts (run daily)
CREATE OR REPLACE FUNCTION public.cleanup_old_failed_attempts()
RETURNS void AS $$
BEGIN
  DELETE FROM failed_login_attempts
  WHERE attempted_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM user_sessions
  WHERE expires_at < NOW() AND revoked_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert default subscription plans
INSERT INTO subscription_plans (name, display_name, description, price_monthly, price_yearly, ai_credits_monthly, max_flows, max_team_members, features)
VALUES
  ('free', 'Free', 'Perfect for trying out TORAFLOW', 0, 0, 100, 3, 1, '["basic_flows", "community_support"]'),
  ('starter', 'Starter', 'For individuals and small projects', 29, 290, 1000, 10, 3, '["all_flows", "email_support", "priority_processing"]'),
  ('professional', 'Professional', 'For growing businesses', 99, 990, 5000, 50, 10, '["all_flows", "priority_support", "custom_branding", "api_access", "advanced_analytics"]'),
  ('enterprise', 'Enterprise', 'For large organizations', 299, 2990, 20000, NULL, NULL, '["all_flows", "dedicated_support", "custom_branding", "api_access", "advanced_analytics", "sla_guarantee", "custom_integrations"]')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE audit_logs IS 'Security and compliance audit trail for all system actions';
COMMENT ON TABLE subscription_plans IS 'Available subscription tiers with pricing and features';
COMMENT ON TABLE user_subscriptions IS 'User subscription status and billing information';
COMMENT ON TABLE payment_history IS 'Complete payment transaction history';
COMMENT ON TABLE user_credits IS 'User AI credit balance and usage summary';
COMMENT ON TABLE credit_transactions IS 'Detailed log of all credit additions and deductions';
COMMENT ON TABLE ai_usage_logs IS 'Detailed tracking of AI service usage for billing and analytics';
COMMENT ON TABLE failed_login_attempts IS 'Failed authentication attempts for security monitoring';
COMMENT ON TABLE account_lockouts IS 'Account lockout records for security';
COMMENT ON TABLE user_sessions IS 'Active user sessions for security and session management';
