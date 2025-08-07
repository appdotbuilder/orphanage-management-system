
import { z } from 'zod';

// User role enum
export const userRoleSchema = z.enum(['admin', 'caregiver', 'donor', 'child']);
export type UserRole = z.infer<typeof userRoleSchema>;

// User schema
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  role: userRoleSchema,
  phone: z.string().nullable(),
  address: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Child schema
export const childSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  date_of_birth: z.coerce.date(),
  gender: z.enum(['male', 'female', 'other']),
  guardian_name: z.string().nullable(),
  guardian_contact: z.string().nullable(),
  admission_date: z.coerce.date(),
  education_level: z.string().nullable(),
  school_name: z.string().nullable(),
  health_conditions: z.string().nullable(),
  emergency_contact: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Child = z.infer<typeof childSchema>;

// Donation type enum
export const donationTypeSchema = z.enum(['money', 'item']);
export type DonationType = z.infer<typeof donationTypeSchema>;

// Donation schema
export const donationSchema = z.object({
  id: z.number(),
  donor_id: z.number(),
  type: donationTypeSchema,
  amount: z.number().nullable(),
  item_name: z.string().nullable(),
  item_quantity: z.number().int().nullable(),
  item_value: z.number().nullable(),
  description: z.string().nullable(),
  donation_date: z.coerce.date(),
  created_at: z.coerce.date()
});

export type Donation = z.infer<typeof donationSchema>;

// Expense category enum
export const expenseCategorySchema = z.enum(['food', 'education', 'healthcare', 'utilities', 'maintenance', 'staff', 'activities', 'other']);
export type ExpenseCategory = z.infer<typeof expenseCategorySchema>;

// Expense schema
export const expenseSchema = z.object({
  id: z.number(),
  category: expenseCategorySchema,
  amount: z.number(),
  description: z.string(),
  receipt_number: z.string().nullable(),
  vendor: z.string().nullable(),
  expense_date: z.coerce.date(),
  approved_by: z.number().nullable(),
  created_at: z.coerce.date()
});

export type Expense = z.infer<typeof expenseSchema>;

// Activity schema
export const activitySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  activity_date: z.coerce.date(),
  location: z.string().nullable(),
  organizer_id: z.number(),
  max_participants: z.number().int().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Activity = z.infer<typeof activitySchema>;

// Activity participation schema
export const activityParticipationSchema = z.object({
  id: z.number(),
  activity_id: z.number(),
  user_id: z.number(),
  participation_date: z.coerce.date(),
  notes: z.string().nullable()
});

export type ActivityParticipation = z.infer<typeof activityParticipationSchema>;

// Activity photo schema
export const activityPhotoSchema = z.object({
  id: z.number(),
  activity_id: z.number(),
  photo_url: z.string(),
  caption: z.string().nullable(),
  uploaded_by: z.number(),
  created_at: z.coerce.date()
});

export type ActivityPhoto = z.infer<typeof activityPhotoSchema>;

// Audit log schema
export const auditLogSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  action: z.string(),
  entity_type: z.string(),
  entity_id: z.number().nullable(),
  old_values: z.string().nullable(),
  new_values: z.string().nullable(),
  ip_address: z.string().nullable(),
  created_at: z.coerce.date()
});

export type AuditLog = z.infer<typeof auditLogSchema>;

// Input schemas for creating entities

export const createUserInputSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  first_name: z.string(),
  last_name: z.string(),
  role: userRoleSchema,
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional()
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const createChildInputSchema = z.object({
  user_id: z.number(),
  date_of_birth: z.coerce.date(),
  gender: z.enum(['male', 'female', 'other']),
  guardian_name: z.string().nullable().optional(),
  guardian_contact: z.string().nullable().optional(),
  admission_date: z.coerce.date(),
  education_level: z.string().nullable().optional(),
  school_name: z.string().nullable().optional(),
  health_conditions: z.string().nullable().optional(),
  emergency_contact: z.string().nullable().optional()
});

export type CreateChildInput = z.infer<typeof createChildInputSchema>;

export const createDonationInputSchema = z.object({
  donor_id: z.number(),
  type: donationTypeSchema,
  amount: z.number().positive().nullable().optional(),
  item_name: z.string().nullable().optional(),
  item_quantity: z.number().int().positive().nullable().optional(),
  item_value: z.number().positive().nullable().optional(),
  description: z.string().nullable().optional(),
  donation_date: z.coerce.date()
});

export type CreateDonationInput = z.infer<typeof createDonationInputSchema>;

export const createExpenseInputSchema = z.object({
  category: expenseCategorySchema,
  amount: z.number().positive(),
  description: z.string(),
  receipt_number: z.string().nullable().optional(),
  vendor: z.string().nullable().optional(),
  expense_date: z.coerce.date(),
  approved_by: z.number().nullable().optional()
});

export type CreateExpenseInput = z.infer<typeof createExpenseInputSchema>;

export const createActivityInputSchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  activity_date: z.coerce.date(),
  location: z.string().nullable().optional(),
  organizer_id: z.number(),
  max_participants: z.number().int().positive().nullable().optional()
});

export type CreateActivityInput = z.infer<typeof createActivityInputSchema>;

export const createActivityParticipationInputSchema = z.object({
  activity_id: z.number(),
  user_id: z.number(),
  notes: z.string().nullable().optional()
});

export type CreateActivityParticipationInput = z.infer<typeof createActivityParticipationInputSchema>;

export const createActivityPhotoInputSchema = z.object({
  activity_id: z.number(),
  photo_url: z.string().url(),
  caption: z.string().nullable().optional(),
  uploaded_by: z.number()
});

export type CreateActivityPhotoInput = z.infer<typeof createActivityPhotoInputSchema>;

// Update schemas
export const updateUserInputSchema = z.object({
  id: z.number(),
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  role: userRoleSchema.optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  is_active: z.boolean().optional()
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

export const updateChildInputSchema = z.object({
  id: z.number(),
  date_of_birth: z.coerce.date().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  guardian_name: z.string().nullable().optional(),
  guardian_contact: z.string().nullable().optional(),
  education_level: z.string().nullable().optional(),
  school_name: z.string().nullable().optional(),
  health_conditions: z.string().nullable().optional(),
  emergency_contact: z.string().nullable().optional()
});

export type UpdateChildInput = z.infer<typeof updateChildInputSchema>;

// Dashboard data schemas
export const adminDashboardSchema = z.object({
  total_children: z.number(),
  total_donors: z.number(),
  total_donations_this_month: z.number(),
  total_expenses_this_month: z.number(),
  upcoming_activities: z.number(),
  recent_donations: z.array(donationSchema),
  recent_expenses: z.array(expenseSchema)
});

export type AdminDashboard = z.infer<typeof adminDashboardSchema>;

export const donorDashboardSchema = z.object({
  total_donations: z.number(),
  total_amount_donated: z.number(),
  recent_donations: z.array(donationSchema),
  donation_history: z.array(donationSchema)
});

export type DonorDashboard = z.infer<typeof donorDashboardSchema>;
