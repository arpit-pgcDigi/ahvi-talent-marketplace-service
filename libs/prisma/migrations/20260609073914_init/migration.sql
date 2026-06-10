-- CreateEnum
CREATE TYPE "Role" AS ENUM ('HIRING', 'TALENT', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "Portal" AS ENUM ('HIRING_PORTAL', 'TALENT_PORTAL', 'ADMIN_PORTAL');

-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('IMMEDIATE', 'IN_DAYS', 'ALLOCATED');

-- CreateEnum
CREATE TYPE "WorkModel" AS ENUM ('REMOTE', 'HYBRID', 'ONSITE');

-- CreateEnum
CREATE TYPE "TalentProfileStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('PRIMARY', 'SECONDARY');

-- CreateEnum
CREATE TYPE "ExperienceArea" AS ENUM ('FRONTEND', 'BACKEND', 'INTEGRATION', 'MIDDLEWARE');

-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('ACTIVE', 'CHECKED_OUT');

-- CreateEnum
CREATE TYPE "EngagementType" AS ENUM ('CONTRACT', 'MANAGED', 'PAYROLL');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PayModel" AS ENUM ('UPFRONT', 'PAY_LATER');

-- CreateEnum
CREATE TYPE "EngagementStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TimesheetStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "EarningType" AS ENUM ('EARNED', 'PENDING', 'PAID', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ApprovalAction" AS ENUM ('APPROVED', 'REJECTED', 'REVISION_REQUESTED');

-- CreateEnum
CREATE TYPE "SettingValueType" AS ENUM ('NUMBER', 'STRING', 'BOOLEAN', 'JSON');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "portal" "Portal" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "last_login_at" TIMESTAMP(3),
    "refresh_token_hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talent_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "title" TEXT,
    "bio" TEXT,
    "avatar_url" TEXT,
    "country_code" TEXT,
    "location_city" TEXT,
    "years_experience" INTEGER,
    "bill_rate_hourly" DECIMAL(10,2),
    "bill_rate_weekly" DECIMAL(10,2),
    "availability" "AvailabilityStatus" NOT NULL DEFAULT 'IMMEDIATE',
    "notice_period_days" INTEGER,
    "work_model" "WorkModel" NOT NULL DEFAULT 'REMOTE',
    "phone" TEXT,
    "linkedin_url" TEXT,
    "github_url" TEXT,
    "portfolio_url" TEXT,
    "resume_url" TEXT,
    "timezone" TEXT,
    "us_overlap_hours" DOUBLE PRECISION,
    "leetcode_url" TEXT,
    "ai_match_score" DOUBLE PRECISION,
    "vetted_tier" TEXT,
    "profile_score" INTEGER,
    "status" "TalentProfileStatus" NOT NULL DEFAULT 'DRAFT',
    "is_listed" BOOLEAN NOT NULL DEFAULT false,
    "submitted_at" TIMESTAMP(3),
    "approved_at" TIMESTAMP(3),
    "approved_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "business_categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "role_types" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "delivery_models" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "customer_rating" DOUBLE PRECISION,
    "rating_count" INTEGER NOT NULL DEFAULT 0,
    "urgency_expires_at" TIMESTAMP(3),

    CONSTRAINT "talent_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talent_skills" (
    "id" TEXT NOT NULL,
    "talent_id" TEXT NOT NULL,
    "skill_name" TEXT NOT NULL,
    "skill_type" "SkillType" NOT NULL DEFAULT 'PRIMARY',
    "category" TEXT,

    CONSTRAINT "talent_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talent_badges" (
    "id" TEXT NOT NULL,
    "talent_id" TEXT NOT NULL,
    "badge_type" TEXT NOT NULL,
    "badge_label" TEXT NOT NULL,

    CONSTRAINT "talent_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talent_previous_companies" (
    "id" TEXT NOT NULL,
    "talent_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "talent_previous_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talent_projects" (
    "id" TEXT NOT NULL,
    "talent_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "impact_statement" TEXT,
    "tech_tags" TEXT[],
    "github_url" TEXT,
    "live_demo_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "talent_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talent_skill_proficiency" (
    "id" TEXT NOT NULL,
    "talent_id" TEXT NOT NULL,
    "category_label" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "talent_skill_proficiency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talent_experience_snapshot" (
    "id" TEXT NOT NULL,
    "talent_id" TEXT NOT NULL,
    "area" "ExperienceArea" NOT NULL,
    "tech_list" TEXT[],

    CONSTRAINT "talent_experience_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlists" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "talent_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlist_adds" (
    "id" TEXT NOT NULL,
    "talent_id" TEXT NOT NULL,
    "added_by" TEXT NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlist_adds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "CartStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "talent_id" TEXT NOT NULL,
    "hours_per_week" INTEGER NOT NULL,
    "duration_weeks" INTEGER NOT NULL,
    "bill_rate_snapshot" DECIMAL(10,2) NOT NULL,
    "total_cost" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "gst_number" TEXT,
    "billing_address" JSONB NOT NULL,
    "contact_person" JSONB NOT NULL,
    "engagement_type" "EngagementType" NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "platform_fee" DECIMAL(10,2) NOT NULL,
    "total_payable" DECIMAL(10,2) NOT NULL,
    "coupon_code" TEXT,
    "discount_amount" DECIMAL(10,2),
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "talent_id" TEXT NOT NULL,
    "hours_per_week" INTEGER NOT NULL,
    "duration_weeks" INTEGER NOT NULL,
    "bill_rate" DECIMAL(10,2) NOT NULL,
    "total_cost" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "stripe_payment_intent_id" TEXT NOT NULL,
    "stripe_customer_id" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "pay_model" "PayModel" NOT NULL DEFAULT 'UPFRONT',
    "stripe_event_id" TEXT,
    "metadata" JSONB,
    "paid_at" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talent_engagements" (
    "id" TEXT NOT NULL,
    "order_item_id" TEXT NOT NULL,
    "talent_id" TEXT NOT NULL,
    "client_user_id" TEXT NOT NULL,
    "client_company_name" TEXT NOT NULL,
    "project_title" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "hours_per_week" INTEGER NOT NULL,
    "agreed_rate" DECIMAL(10,2) NOT NULL,
    "progress_pct" INTEGER NOT NULL DEFAULT 0,
    "status" "EngagementStatus" NOT NULL DEFAULT 'ACTIVE',
    "sow_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "talent_engagements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timesheets" (
    "id" TEXT NOT NULL,
    "engagement_id" TEXT NOT NULL,
    "talent_id" TEXT NOT NULL,
    "week_start_date" TIMESTAMP(3) NOT NULL,
    "hours_logged" DECIMAL(6,2) NOT NULL,
    "description" TEXT,
    "status" "TimesheetStatus" NOT NULL DEFAULT 'DRAFT',
    "submitted_at" TIMESTAMP(3),
    "approved_by" TEXT,
    "approved_at" TIMESTAMP(3),
    "rejection_reason" TEXT,

    CONSTRAINT "timesheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talent_earnings" (
    "id" TEXT NOT NULL,
    "talent_id" TEXT NOT NULL,
    "timesheet_id" TEXT,
    "engagement_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" "EarningType" NOT NULL DEFAULT 'PENDING',
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "payout_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "talent_earnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "engagement_id" TEXT NOT NULL,
    "talent_id" TEXT NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "hours_billed" DECIMAL(6,2) NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "pdf_url" TEXT,
    "client_review" TEXT,
    "client_rating" INTEGER,
    "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_views" (
    "id" TEXT NOT NULL,
    "talent_id" TEXT NOT NULL,
    "viewer_user_id" TEXT,
    "viewer_company" TEXT,
    "source" TEXT,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval_logs" (
    "id" TEXT NOT NULL,
    "talent_id" TEXT NOT NULL,
    "reviewed_by" TEXT NOT NULL,
    "action" "ApprovalAction" NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "approval_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_settings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "value_type" "SettingValueType" NOT NULL DEFAULT 'STRING',
    "description" TEXT,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discount_type" "DiscountType" NOT NULL,
    "discount_value" DECIMAL(10,2) NOT NULL,
    "max_uses" INTEGER,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_audit_logs" (
    "id" TEXT NOT NULL,
    "admin_user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "before_state" JSONB,
    "after_state" JSONB,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxonomy_skills" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "module_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "taxonomy_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taxonomy_badges" (
    "id" TEXT NOT NULL,
    "badge_key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "taxonomy_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talent_agreements" (
    "id" TEXT NOT NULL,
    "talent_id" TEXT NOT NULL,
    "agreed_at" TIMESTAMP(3) NOT NULL,
    "terms_version" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "talent_agreements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hirer_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "company_name" TEXT,
    "phone" TEXT,
    "company_size" TEXT,
    "industry" TEXT,
    "website" TEXT,
    "company_description" TEXT,
    "location" TEXT,
    "logo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hirer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "talent_profiles_user_id_key" ON "talent_profiles"("user_id");

-- CreateIndex
CREATE INDEX "talent_profiles_status_is_listed_idx" ON "talent_profiles"("status", "is_listed");

-- CreateIndex
CREATE INDEX "talent_profiles_country_code_idx" ON "talent_profiles"("country_code");

-- CreateIndex
CREATE INDEX "talent_profiles_availability_idx" ON "talent_profiles"("availability");

-- CreateIndex
CREATE INDEX "talent_profiles_work_model_idx" ON "talent_profiles"("work_model");

-- CreateIndex
CREATE INDEX "talent_profiles_ai_match_score_idx" ON "talent_profiles"("ai_match_score" DESC);

-- CreateIndex
CREATE INDEX "talent_profiles_bill_rate_hourly_idx" ON "talent_profiles"("bill_rate_hourly" DESC);

-- CreateIndex
CREATE INDEX "talent_profiles_customer_rating_idx" ON "talent_profiles"("customer_rating" DESC);

-- CreateIndex
CREATE INDEX "talent_profiles_years_experience_idx" ON "talent_profiles"("years_experience" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "wishlists_user_id_talent_id_key" ON "wishlists"("user_id", "talent_id");

-- CreateIndex
CREATE UNIQUE INDEX "carts_user_id_key" ON "carts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cart_id_talent_id_key" ON "cart_items"("cart_id", "talent_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_order_id_key" ON "payments"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripe_payment_intent_id_key" ON "payments"("stripe_payment_intent_id");

-- CreateIndex
CREATE UNIQUE INDEX "talent_engagements_order_item_id_key" ON "talent_engagements"("order_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "timesheets_engagement_id_week_start_date_key" ON "timesheets"("engagement_id", "week_start_date");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_engagement_id_period_start_key" ON "invoices"("engagement_id", "period_start");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- CreateIndex
CREATE UNIQUE INDEX "taxonomy_badges_badge_key_key" ON "taxonomy_badges"("badge_key");

-- CreateIndex
CREATE UNIQUE INDEX "hirer_profiles_user_id_key" ON "hirer_profiles"("user_id");

-- AddForeignKey
ALTER TABLE "talent_profiles" ADD CONSTRAINT "talent_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_profiles" ADD CONSTRAINT "talent_profiles_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_skills" ADD CONSTRAINT "talent_skills_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "talent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_badges" ADD CONSTRAINT "talent_badges_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "talent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_previous_companies" ADD CONSTRAINT "talent_previous_companies_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "talent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_projects" ADD CONSTRAINT "talent_projects_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "talent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_skill_proficiency" ADD CONSTRAINT "talent_skill_proficiency_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "talent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_experience_snapshot" ADD CONSTRAINT "talent_experience_snapshot_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "talent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "talent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_adds" ADD CONSTRAINT "wishlist_adds_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "talent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_adds" ADD CONSTRAINT "wishlist_adds_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "talent_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "talent_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_engagements" ADD CONSTRAINT "talent_engagements_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_engagements" ADD CONSTRAINT "talent_engagements_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "talent_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_engagements" ADD CONSTRAINT "talent_engagements_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_engagement_id_fkey" FOREIGN KEY ("engagement_id") REFERENCES "talent_engagements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "talent_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_earnings" ADD CONSTRAINT "talent_earnings_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "talent_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_earnings" ADD CONSTRAINT "talent_earnings_timesheet_id_fkey" FOREIGN KEY ("timesheet_id") REFERENCES "timesheets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_earnings" ADD CONSTRAINT "talent_earnings_engagement_id_fkey" FOREIGN KEY ("engagement_id") REFERENCES "talent_engagements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_engagement_id_fkey" FOREIGN KEY ("engagement_id") REFERENCES "talent_engagements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "talent_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_views" ADD CONSTRAINT "profile_views_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "talent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_views" ADD CONSTRAINT "profile_views_viewer_user_id_fkey" FOREIGN KEY ("viewer_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_logs" ADD CONSTRAINT "approval_logs_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "talent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_logs" ADD CONSTRAINT "approval_logs_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_settings" ADD CONSTRAINT "platform_settings_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talent_agreements" ADD CONSTRAINT "talent_agreements_talent_id_fkey" FOREIGN KEY ("talent_id") REFERENCES "talent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hirer_profiles" ADD CONSTRAINT "hirer_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
