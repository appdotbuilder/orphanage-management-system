
import { serial, text, pgTable, timestamp, numeric, integer, boolean, pgEnum, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'caregiver', 'donor', 'child']);
export const genderEnum = pgEnum('gender', ['male', 'female', 'other']);
export const donationTypeEnum = pgEnum('donation_type', ['money', 'item']);
export const expenseCategoryEnum = pgEnum('expense_category', ['food', 'education', 'healthcare', 'utilities', 'maintenance', 'staff', 'activities', 'other']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  role: userRoleEnum('role').notNull(),
  phone: text('phone'),
  address: text('address'),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Children table
export const childrenTable = pgTable('children', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  date_of_birth: date('date_of_birth').notNull(),
  gender: genderEnum('gender').notNull(),
  guardian_name: text('guardian_name'),
  guardian_contact: text('guardian_contact'),
  admission_date: date('admission_date').notNull(),
  education_level: text('education_level'),
  school_name: text('school_name'),
  health_conditions: text('health_conditions'),
  emergency_contact: text('emergency_contact'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Donations table
export const donationsTable = pgTable('donations', {
  id: serial('id').primaryKey(),
  donor_id: integer('donor_id').notNull().references(() => usersTable.id),
  type: donationTypeEnum('type').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }),
  item_name: text('item_name'),
  item_quantity: integer('item_quantity'),
  item_value: numeric('item_value', { precision: 12, scale: 2 }),
  description: text('description'),
  donation_date: date('donation_date').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Expenses table
export const expensesTable = pgTable('expenses', {
  id: serial('id').primaryKey(),
  category: expenseCategoryEnum('category').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  description: text('description').notNull(),
  receipt_number: text('receipt_number'),
  vendor: text('vendor'),
  expense_date: date('expense_date').notNull(),
  approved_by: integer('approved_by').references(() => usersTable.id),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Activities table
export const activitiesTable = pgTable('activities', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  activity_date: date('activity_date').notNull(),
  location: text('location'),
  organizer_id: integer('organizer_id').notNull().references(() => usersTable.id),
  max_participants: integer('max_participants'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Activity participation table
export const activityParticipationTable = pgTable('activity_participation', {
  id: serial('id').primaryKey(),
  activity_id: integer('activity_id').notNull().references(() => activitiesTable.id),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  participation_date: timestamp('participation_date').defaultNow().notNull(),
  notes: text('notes')
});

// Activity photos table
export const activityPhotosTable = pgTable('activity_photos', {
  id: serial('id').primaryKey(),
  activity_id: integer('activity_id').notNull().references(() => activitiesTable.id),
  photo_url: text('photo_url').notNull(),
  caption: text('caption'),
  uploaded_by: integer('uploaded_by').notNull().references(() => usersTable.id),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Audit log table
export const auditLogTable = pgTable('audit_log', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  action: text('action').notNull(),
  entity_type: text('entity_type').notNull(),
  entity_id: integer('entity_id'),
  old_values: text('old_values'),
  new_values: text('new_values'),
  ip_address: text('ip_address'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(usersTable, ({ one, many }) => ({
  child: one(childrenTable, {
    fields: [usersTable.id],
    references: [childrenTable.user_id]
  }),
  donations: many(donationsTable),
  organizedActivities: many(activitiesTable),
  activityParticipations: many(activityParticipationTable),
  uploadedPhotos: many(activityPhotosTable),
  auditLogs: many(auditLogTable)
}));

export const childrenRelations = relations(childrenTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [childrenTable.user_id],
    references: [usersTable.id]
  })
}));

export const donationsRelations = relations(donationsTable, ({ one }) => ({
  donor: one(usersTable, {
    fields: [donationsTable.donor_id],
    references: [usersTable.id]
  })
}));

export const expensesRelations = relations(expensesTable, ({ one }) => ({
  approver: one(usersTable, {
    fields: [expensesTable.approved_by],
    references: [usersTable.id]
  })
}));

export const activitiesRelations = relations(activitiesTable, ({ one, many }) => ({
  organizer: one(usersTable, {
    fields: [activitiesTable.organizer_id],
    references: [usersTable.id]
  }),
  participants: many(activityParticipationTable),
  photos: many(activityPhotosTable)
}));

export const activityParticipationRelations = relations(activityParticipationTable, ({ one }) => ({
  activity: one(activitiesTable, {
    fields: [activityParticipationTable.activity_id],
    references: [activitiesTable.id]
  }),
  user: one(usersTable, {
    fields: [activityParticipationTable.user_id],
    references: [usersTable.id]
  })
}));

export const activityPhotosRelations = relations(activityPhotosTable, ({ one }) => ({
  activity: one(activitiesTable, {
    fields: [activityPhotosTable.activity_id],
    references: [activitiesTable.id]
  }),
  uploader: one(usersTable, {
    fields: [activityPhotosTable.uploaded_by],
    references: [usersTable.id]
  })
}));

export const auditLogRelations = relations(auditLogTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [auditLogTable.user_id],
    references: [usersTable.id]
  })
}));

// Export all tables for relation queries
export const tables = {
  users: usersTable,
  children: childrenTable,
  donations: donationsTable,
  expenses: expensesTable,
  activities: activitiesTable,
  activityParticipation: activityParticipationTable,
  activityPhotos: activityPhotosTable,
  auditLog: auditLogTable
};
