-- VibeFello Database Schema
-- Supabase PostgreSQL

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'expert', 'admin')),
    user_tier TEXT DEFAULT 'free' CHECK (user_tier IN ('free', 'pro', 'max')),
    expert_verification_status TEXT DEFAULT 'none' CHECK (expert_verification_status IN ('none', 'pending', 'approved', 'rejected')),
    expert_bio TEXT,
    expert_skills TEXT[],
    expert_hourly_rate INTEGER,
    remaining_consults INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expert applications
CREATE TABLE expert_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    years_of_experience INTEGER,
    primary_skills TEXT[] NOT NULL,
    portfolio_links TEXT[],
    github_url TEXT,
    linkedin_url TEXT,
    availability_hours INTEGER,
    hourly_rate_range TEXT,
    bio TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES profiles(id)
);

-- ============================================
-- ORDERS & REQUESTS
-- ============================================

-- Service requests (Vibe Requests)
CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT[],
    budget_min INTEGER,
    budget_max INTEGER,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'matching', 'in_progress', 'completed', 'cancelled')),
    urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'urgent')),
    github_url TEXT,
    ai_diagnosis JSONB,
    assigned_expert_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Expert bids on requests
CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES requests(id) ON DELETE CASCADE NOT NULL,
    expert_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    analysis TEXT NOT NULL,
    solution TEXT NOT NULL,
    price INTEGER NOT NULL,
    delivery_hours INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders (when a bid is accepted)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES requests(id) ON DELETE CASCADE NOT NULL,
    bid_id UUID REFERENCES bids(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    expert_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    price INTEGER NOT NULL,
    platform_fee INTEGER NOT NULL,
    total_amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'paid', 'in_progress', 'delivered', 'completed', 'disputed', 'refunded')),
    escrow_released BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- COMMUNICATION
-- ============================================

-- Chat rooms for orders
CREATE TABLE chat_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    request_id UUID REFERENCES requests(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    expert_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'code')),
    file_url TEXT,
    file_name TEXT,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PAYMENTS & TRANSACTIONS
-- ============================================

-- Transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('deposit', 'payment', 'refund', 'payout', 'platform_fee')),
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'CNY',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    payment_method TEXT,
    payment_provider_id TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- User wallet/balance
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    balance INTEGER DEFAULT 0,
    frozen_balance INTEGER DEFAULT 0,
    total_earned INTEGER DEFAULT 0,
    total_spent INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- REVIEWS & RATINGS
-- ============================================

-- Reviews for experts
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    request_id UUID REFERENCES requests(id) ON DELETE CASCADE NOT NULL,
    reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    expert_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, update only their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Expert Applications: Users can view own applications, admins can view all
CREATE POLICY "Users can view own applications" ON expert_applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications" ON expert_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Requests: Publicly viewable, only owner can modify
CREATE POLICY "Requests are viewable by everyone" ON requests
    FOR SELECT USING (true);

CREATE POLICY "Users can create requests" ON requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own requests" ON requests
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Experts can update assigned requests" ON requests
    FOR UPDATE USING (auth.uid() = assigned_expert_id);

-- Bids: Experts can view their own bids, request owners can view all bids on their requests
CREATE POLICY "Experts can view own bids" ON bids
    FOR SELECT USING (auth.uid() = expert_id);

CREATE POLICY "Request owners can view bids" ON bids
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM requests WHERE requests.id = bids.request_id AND requests.user_id = auth.uid()
        )
    );

CREATE POLICY "Experts can create bids" ON bids
    FOR INSERT WITH CHECK (auth.uid() = expert_id);

-- Orders: Both parties can view
CREATE POLICY "Order participants can view" ON orders
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = expert_id);

-- Chat: Participants can view and send messages
CREATE POLICY "Chat participants can view" ON chat_rooms
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = expert_id);

CREATE POLICY "Chat participants can send messages" ON messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM chat_rooms WHERE chat_rooms.id = messages.room_id 
            AND (chat_rooms.user_id = auth.uid() OR chat_rooms.expert_id = auth.uid())
        )
    );

CREATE POLICY "Chat participants can view messages" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_rooms WHERE chat_rooms.id = messages.room_id 
            AND (chat_rooms.user_id = auth.uid() OR chat_rooms.expert_id = auth.uid())
        )
    );

-- Wallets: Users can only view own wallet
CREATE POLICY "Users can view own wallet" ON wallets
    FOR SELECT USING (auth.uid() = user_id);

-- Transactions: Users can view own transactions
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Reviews: Publicly viewable
CREATE POLICY "Reviews are viewable by everyone" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for completed orders" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    -- Create wallet for new user
    INSERT INTO public.wallets (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update expert average rating
CREATE OR REPLACE FUNCTION update_expert_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles
    SET 
        expert_rating = (
            SELECT AVG(rating)::DECIMAL(3,2)
            FROM reviews
            WHERE expert_id = NEW.expert_id
        ),
        expert_reviews_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE expert_id = NEW.expert_id
        )
    WHERE id = NEW.expert_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_created
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_expert_rating();
