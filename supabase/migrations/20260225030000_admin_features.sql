-- Admin Features: Billing and Permissions

-- 1. Permissions Roles Table
CREATE TABLE IF NOT EXISTS public.permissions_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  level TEXT DEFAULT 'custom',
  users_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.permissions_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage roles" 
  ON public.permissions_roles FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- 2. Billing Invoices Table
CREATE TABLE IF NOT EXISTS public.billing_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id TEXT NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  due_date TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.billing_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage invoices" 
  ON public.billing_invoices FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. Seed Default Roles
INSERT INTO public.permissions_roles (name, description, level, users_count) VALUES
('Super Admin', 'Full system access', 'Full access', 3),
('Content Manager', 'Can manage courses and categories', 'Course management', 12),
('Support Agent', 'Can view user data and handle tickets', 'Support access', 8)
ON CONFLICT (name) DO NOTHING;

-- 4. Seed Sample Invoices
INSERT INTO public.billing_invoices (invoice_id, amount, status, due_date) VALUES
('INV-2026-001', 2499.00, 'paid', '2026-01-15'),
('INV-2026-002', 2499.00, 'paid', '2026-02-15'),
('INV-2026-003', 2499.00, 'pending', '2026-03-15')
ON CONFLICT (invoice_id) DO NOTHING;
