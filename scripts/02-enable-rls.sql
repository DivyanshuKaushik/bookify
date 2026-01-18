-- Enable Row Level Security on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ORGANIZATIONS POLICIES
-- ============================================

-- Super admins can view all organizations
CREATE POLICY "super_admins_view_all_organizations" ON organizations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

-- Users can view their own organization
CREATE POLICY "users_view_own_organization" ON organizations
  FOR SELECT
  USING (
    id = (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- Only super admins can update organizations
CREATE POLICY "super_admins_update_organizations" ON organizations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

-- Only super admins can delete organizations
CREATE POLICY "super_admins_delete_organizations" ON organizations
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can view profiles in their organization
CREATE POLICY "users_view_org_profiles" ON profiles
  FOR SELECT
  USING (
    organization_id = (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- Super admins can view all profiles
CREATE POLICY "super_admins_view_all_profiles" ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

-- Only owners can insert profiles in their organization
CREATE POLICY "owners_insert_profiles" ON profiles
  FOR INSERT
  WITH CHECK (
    organization_id = (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
    AND (
      SELECT role FROM profiles
      WHERE profiles.id = auth.uid()
    ) = 'owner'
  );

-- Super admins can insert any profile
CREATE POLICY "super_admins_insert_profiles" ON profiles
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
  );

-- ============================================
-- VENUES POLICIES
-- ============================================

-- Users can view venues in their organization
CREATE POLICY "users_view_venues" ON venues
  FOR SELECT
  USING (
    organization_id = (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- Owners can insert venues
CREATE POLICY "owners_insert_venues" ON venues
  FOR INSERT
  WITH CHECK (
    organization_id = (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
    AND (
      SELECT role FROM profiles
      WHERE profiles.id = auth.uid()
    ) = 'owner'
  );

-- Owners can update venues
CREATE POLICY "owners_update_venues" ON venues
  FOR UPDATE
  USING (
    organization_id = (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
    AND (
      SELECT role FROM profiles
      WHERE profiles.id = auth.uid()
    ) = 'owner'
  );

-- ============================================
-- BOOKINGS POLICIES
-- ============================================

-- Users can view bookings in their organization
CREATE POLICY "users_view_bookings" ON bookings
  FOR SELECT
  USING (
    organization_id = (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- Users can insert bookings in their organization
CREATE POLICY "users_insert_bookings" ON bookings
  FOR INSERT
  WITH CHECK (
    organization_id = (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- Users can update bookings in their organization
CREATE POLICY "users_update_bookings" ON bookings
  FOR UPDATE
  USING (
    organization_id = (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- ============================================
-- INQUIRIES POLICIES
-- ============================================

-- Users can view inquiries in their organization
CREATE POLICY "users_view_inquiries" ON inquiries
  FOR SELECT
  USING (
    organization_id = (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- Users can insert inquiries
CREATE POLICY "users_insert_inquiries" ON inquiries
  FOR INSERT
  WITH CHECK (
    organization_id = (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- Users can update inquiries in their organization
CREATE POLICY "users_update_inquiries" ON inquiries
  FOR UPDATE
  USING (
    organization_id = (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- ============================================
-- PAYMENTS POLICIES
-- ============================================

-- Users can view payments in their organization
CREATE POLICY "users_view_payments" ON payments
  FOR SELECT
  USING (
    organization_id = (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- Owners can view all payments
CREATE POLICY "owners_view_all_payments" ON payments
  FOR SELECT
  USING (
    organization_id = (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
    AND (
      SELECT role FROM profiles
      WHERE profiles.id = auth.uid()
    ) = 'owner'
  );

-- Users can insert payments
CREATE POLICY "users_insert_payments" ON payments
  FOR INSERT
  WITH CHECK (
    organization_id = (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- ============================================
-- INVOICES POLICIES
-- ============================================

-- Users can view invoices in their organization
CREATE POLICY "users_view_invoices" ON invoices
  FOR SELECT
  USING (
    organization_id = (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- Users can insert invoices
CREATE POLICY "users_insert_invoices" ON invoices
  FOR INSERT
  WITH CHECK (
    organization_id = (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

-- Users can update invoices in their organization
CREATE POLICY "users_update_invoices" ON invoices
  FOR UPDATE
  USING (
    organization_id = (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );
