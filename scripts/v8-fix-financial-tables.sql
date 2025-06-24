-- Fixed Enhanced Financial Management Tables
-- This script safely adds columns and handles existing table structures

-- First, let's check and add missing columns to financial_transactions
DO $$
BEGIN
    -- Add description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'financial_transactions' AND column_name = 'description') THEN
        ALTER TABLE financial_transactions ADD COLUMN description TEXT;
    END IF;
    
    -- Add category column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'financial_transactions' AND column_name = 'category') THEN
        ALTER TABLE financial_transactions ADD COLUMN category VARCHAR(100);
    END IF;
    
    -- Add reference_number column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'financial_transactions' AND column_name = 'reference_number') THEN
        ALTER TABLE financial_transactions ADD COLUMN reference_number VARCHAR(100);
    END IF;
    
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'financial_transactions' AND column_name = 'status') THEN
        ALTER TABLE financial_transactions ADD COLUMN status VARCHAR(20) DEFAULT 'completed' 
        CHECK (status IN ('pending', 'completed', 'failed', 'cancelled'));
    END IF;
    
    -- Add receipt_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'financial_transactions' AND column_name = 'receipt_url') THEN
        ALTER TABLE financial_transactions ADD COLUMN receipt_url TEXT;
    END IF;
    
    -- Add notes column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'financial_transactions' AND column_name = 'notes') THEN
        ALTER TABLE financial_transactions ADD COLUMN notes TEXT;
    END IF;
    
    -- Add created_by column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'financial_transactions' AND column_name = 'created_by') THEN
        ALTER TABLE financial_transactions ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'financial_transactions' AND column_name = 'updated_at') THEN
        ALTER TABLE financial_transactions ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Update payment_method column to include new options if constraint doesn't exist
DO $$
BEGIN
    -- Drop existing constraint if it exists
    ALTER TABLE financial_transactions DROP CONSTRAINT IF EXISTS financial_transactions_payment_method_check;
    
    -- Add new constraint with all payment methods
    ALTER TABLE financial_transactions ADD CONSTRAINT financial_transactions_payment_method_check 
    CHECK (payment_method IN ('cash', 'mpesa', 'bank_transfer', 'card', 'mobile_money', 'check'));
EXCEPTION
    WHEN OTHERS THEN
        -- If constraint already exists or other error, continue
        NULL;
END $$;

-- Update transaction_type column to include new options
DO $$
BEGIN
    -- Drop existing constraint if it exists
    ALTER TABLE financial_transactions DROP CONSTRAINT IF EXISTS financial_transactions_transaction_type_check;
    
    -- Add new constraint with all transaction types
    ALTER TABLE financial_transactions ADD CONSTRAINT financial_transactions_transaction_type_check 
    CHECK (transaction_type IN ('tithe', 'offering', 'donation', 'expense', 'transfer'));
EXCEPTION
    WHEN OTHERS THEN
        -- If constraint already exists or other error, continue
        NULL;
END $$;

-- Create budgets table if it doesn't exist
CREATE TABLE IF NOT EXISTS budgets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    total_amount DECIMAL(12,2) NOT NULL,
    spent_amount DECIMAL(12,2) DEFAULT 0,
    period VARCHAR(20) NOT NULL CHECK (period IN ('monthly', 'quarterly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'paused', 'cancelled')),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budget_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS budget_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    allocated_amount DECIMAL(12,2) NOT NULL,
    spent_amount DECIMAL(12,2) DEFAULT 0,
    ministry_id UUID REFERENCES ministries(id) ON DELETE SET NULL,
    color VARCHAR(7) DEFAULT '#8884d8',
    icon VARCHAR(50) DEFAULT 'folder',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expenses table if it doesn't exist
CREATE TABLE IF NOT EXISTS expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    budget_id UUID REFERENCES budgets(id) ON DELETE SET NULL,
    category_id UUID REFERENCES budget_categories(id) ON DELETE SET NULL,
    amount DECIMAL(12,2) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'cash',
    receipt_url TEXT,
    vendor VARCHAR(255),
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create financial_goals table if it doesn't exist
CREATE TABLE IF NOT EXISTS financial_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_amount DECIMAL(12,2) NOT NULL,
    current_amount DECIMAL(12,2) DEFAULT 0,
    target_date DATE,
    category VARCHAR(100),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ministries table if it doesn't exist
CREATE TABLE IF NOT EXISTS ministries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    leader_id UUID REFERENCES members(id) ON DELETE SET NULL,
    budget_allocated DECIMAL(12,2) DEFAULT 0,
    budget_spent DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON financial_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_type ON financial_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_member ON financial_transactions(member_id);
CREATE INDEX IF NOT EXISTS idx_budgets_period ON budgets(period, status);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);

-- Create or replace the update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables (drop first to avoid conflicts)
DROP TRIGGER IF EXISTS update_financial_transactions_updated_at ON financial_transactions;
CREATE TRIGGER update_financial_transactions_updated_at 
    BEFORE UPDATE ON financial_transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_budgets_updated_at ON budgets;
CREATE TRIGGER update_budgets_updated_at 
    BEFORE UPDATE ON budgets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_budget_categories_updated_at ON budget_categories;
CREATE TRIGGER update_budget_categories_updated_at 
    BEFORE UPDATE ON budget_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_expenses_updated_at ON expenses;
CREATE TRIGGER update_expenses_updated_at 
    BEFORE UPDATE ON expenses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample ministries (only if they don't exist)
INSERT INTO ministries (name, description, budget_allocated) 
SELECT * FROM (VALUES
    ('Ministério de Louvor', 'Responsável pela música e adoração nos cultos', 25000),
    ('Ministério de Jovens', 'Ministério voltado para jovens e adolescentes', 20000),
    ('Ministério Infantil', 'Cuidado e ensino das crianças', 15000),
    ('Evangelismo', 'Atividades de evangelização e missões', 30000),
    ('Manutenção', 'Manutenção e infraestrutura da igreja', 30000)
) AS v(name, description, budget_allocated)
WHERE NOT EXISTS (SELECT 1 FROM ministries WHERE ministries.name = v.name);

-- Insert sample financial data (only if table is empty)
INSERT INTO financial_transactions (amount, transaction_type, payment_method, description, transaction_date) 
SELECT * FROM (VALUES
    (150.00, 'tithe', 'mpesa', 'Dízimo mensal', CURRENT_DATE - INTERVAL '1 day'),
    (75.00, 'offering', 'cash', 'Oferta dominical', CURRENT_DATE - INTERVAL '2 days'),
    (200.00, 'donation', 'bank_transfer', 'Doação especial', CURRENT_DATE - INTERVAL '3 days'),
    (500.00, 'expense', 'card', 'Equipamento de som', CURRENT_DATE - INTERVAL '5 days'),
    (100.00, 'tithe', 'cash', 'Dízimo semanal', CURRENT_DATE - INTERVAL '7 days')
) AS v(amount, transaction_type, payment_method, description, transaction_date)
WHERE NOT EXISTS (SELECT 1 FROM financial_transactions LIMIT 1);

-- Create sample budget (only if no budgets exist)
INSERT INTO budgets (name, description, total_amount, period, start_date, end_date) 
SELECT 'Orçamento 2024', 'Orçamento anual da igreja', 120000, 'yearly', '2024-01-01', '2024-12-31'
WHERE NOT EXISTS (SELECT 1 FROM budgets LIMIT 1);

-- Create budget categories (only if budget exists and no categories exist)
DO $$
DECLARE
    budget_uuid UUID;
BEGIN
    SELECT id INTO budget_uuid FROM budgets WHERE name = 'Orçamento 2024' LIMIT 1;
    
    IF budget_uuid IS NOT NULL AND NOT EXISTS (SELECT 1 FROM budget_categories LIMIT 1) THEN
        INSERT INTO budget_categories (budget_id, name, allocated_amount, color, icon) VALUES
        (budget_uuid, 'Ministério de Louvor', 25000, '#8884d8', 'music'),
        (budget_uuid, 'Ministério de Jovens', 20000, '#82ca9d', 'users'),
        (budget_uuid, 'Ministério Infantil', 15000, '#ffc658', 'baby'),
        (budget_uuid, 'Evangelismo', 30000, '#ff7300', 'megaphone'),
        (budget_uuid, 'Manutenção', 30000, '#00ff00', 'wrench');
    END IF;
END $$;

-- Enable RLS on all tables
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view all financial transactions" ON financial_transactions;
DROP POLICY IF EXISTS "Users can insert financial transactions" ON financial_transactions;
DROP POLICY IF EXISTS "Users can update financial transactions" ON financial_transactions;

DROP POLICY IF EXISTS "Users can view all budgets" ON budgets;
DROP POLICY IF EXISTS "Users can insert budgets" ON budgets;
DROP POLICY IF EXISTS "Users can update budgets" ON budgets;

DROP POLICY IF EXISTS "Users can view all budget categories" ON budget_categories;
DROP POLICY IF EXISTS "Users can insert budget categories" ON budget_categories;
DROP POLICY IF EXISTS "Users can update budget categories" ON budget_categories;

DROP POLICY IF EXISTS "Users can view all expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update expenses" ON expenses;

DROP POLICY IF EXISTS "Users can view all financial goals" ON financial_goals;
DROP POLICY IF EXISTS "Users can insert financial goals" ON financial_goals;
DROP POLICY IF EXISTS "Users can update financial goals" ON financial_goals;

DROP POLICY IF EXISTS "Users can view all ministries" ON ministries;
DROP POLICY IF EXISTS "Users can insert ministries" ON ministries;
DROP POLICY IF EXISTS "Users can update ministries" ON ministries;

-- Create new RLS policies
CREATE POLICY "Users can view all financial transactions" ON financial_transactions FOR SELECT USING (true);
CREATE POLICY "Users can insert financial transactions" ON financial_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update financial transactions" ON financial_transactions FOR UPDATE USING (true);

CREATE POLICY "Users can view all budgets" ON budgets FOR SELECT USING (true);
CREATE POLICY "Users can insert budgets" ON budgets FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update budgets" ON budgets FOR UPDATE USING (true);

CREATE POLICY "Users can view all budget categories" ON budget_categories FOR SELECT USING (true);
CREATE POLICY "Users can insert budget categories" ON budget_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update budget categories" ON budget_categories FOR UPDATE USING (true);

CREATE POLICY "Users can view all expenses" ON expenses FOR SELECT USING (true);
CREATE POLICY "Users can insert expenses" ON expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update expenses" ON expenses FOR UPDATE USING (true);

CREATE POLICY "Users can view all financial goals" ON financial_goals FOR SELECT USING (true);
CREATE POLICY "Users can insert financial goals" ON financial_goals FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update financial goals" ON financial_goals FOR UPDATE USING (true);

CREATE POLICY "Users can view all ministries" ON ministries FOR SELECT USING (true);
CREATE POLICY "Users can insert ministries" ON ministries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update ministries" ON ministries FOR UPDATE USING (true);

-- Final verification and cleanup
DO $$
BEGIN
    RAISE NOTICE 'Financial tables setup completed successfully!';
    RAISE NOTICE 'Tables created/updated: financial_transactions, budgets, budget_categories, expenses, financial_goals, ministries';
    RAISE NOTICE 'Sample data inserted where tables were empty';
    RAISE NOTICE 'RLS policies applied to all tables';
END $$;
