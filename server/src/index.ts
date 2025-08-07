
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createUserInputSchema,
  updateUserInputSchema,
  createChildInputSchema,
  updateChildInputSchema,
  createDonationInputSchema,
  createExpenseInputSchema,
  expenseCategorySchema,
  createActivityInputSchema,
  createActivityParticipationInputSchema,
  createActivityPhotoInputSchema
} from './schema';

// Import handlers
import { createUser } from './handlers/create_user';
import { getUsers } from './handlers/get_users';
import { updateUser } from './handlers/update_user';
import { deleteUser } from './handlers/delete_user';
import { createChild } from './handlers/create_child';
import { getChildren } from './handlers/get_children';
import { updateChild } from './handlers/update_child';
import { createDonation } from './handlers/create_donation';
import { getDonations } from './handlers/get_donations';
import { getDonationsByDonor } from './handlers/get_donations_by_donor';
import { createExpense } from './handlers/create_expense';
import { getExpenses } from './handlers/get_expenses';
import { getExpensesByCategory } from './handlers/get_expenses_by_category';
import { createActivity } from './handlers/create_activity';
import { getActivities } from './handlers/get_activities';
import { addActivityParticipant } from './handlers/add_activity_participant';
import { getActivityParticipants } from './handlers/get_activity_participants';
import { addActivityPhoto } from './handlers/add_activity_photo';
import { getActivityPhotos } from './handlers/get_activity_photos';
import { getAdminDashboard } from './handlers/get_admin_dashboard';
import { getDonorDashboard } from './handlers/get_donor_dashboard';
import { createAuditLog } from './handlers/create_audit_log';
import { getAuditLogs } from './handlers/get_audit_logs';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // User management routes
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),
  
  getUsers: publicProcedure
    .query(() => getUsers()),
  
  updateUser: publicProcedure
    .input(updateUserInputSchema)
    .mutation(({ input }) => updateUser(input)),
  
  deleteUser: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteUser(input.id)),

  // Child management routes
  createChild: publicProcedure
    .input(createChildInputSchema)
    .mutation(({ input }) => createChild(input)),
  
  getChildren: publicProcedure
    .query(() => getChildren()),
  
  updateChild: publicProcedure
    .input(updateChildInputSchema)
    .mutation(({ input }) => updateChild(input)),

  // Donation management routes
  createDonation: publicProcedure
    .input(createDonationInputSchema)
    .mutation(({ input }) => createDonation(input)),
  
  getDonations: publicProcedure
    .query(() => getDonations()),
  
  getDonationsByDonor: publicProcedure
    .input(z.object({ donorId: z.number() }))
    .query(({ input }) => getDonationsByDonor(input.donorId)),

  // Expense management routes
  createExpense: publicProcedure
    .input(createExpenseInputSchema)
    .mutation(({ input }) => createExpense(input)),
  
  getExpenses: publicProcedure
    .query(() => getExpenses()),
  
  getExpensesByCategory: publicProcedure
    .input(z.object({ category: expenseCategorySchema }))
    .query(({ input }) => getExpensesByCategory(input.category)),

  // Activity management routes
  createActivity: publicProcedure
    .input(createActivityInputSchema)
    .mutation(({ input }) => createActivity(input)),
  
  getActivities: publicProcedure
    .query(() => getActivities()),
  
  addActivityParticipant: publicProcedure
    .input(createActivityParticipationInputSchema)
    .mutation(({ input }) => addActivityParticipant(input)),
  
  getActivityParticipants: publicProcedure
    .input(z.object({ activityId: z.number() }))
    .query(({ input }) => getActivityParticipants(input.activityId)),
  
  addActivityPhoto: publicProcedure
    .input(createActivityPhotoInputSchema)
    .mutation(({ input }) => addActivityPhoto(input)),
  
  getActivityPhotos: publicProcedure
    .input(z.object({ activityId: z.number() }))
    .query(({ input }) => getActivityPhotos(input.activityId)),

  // Dashboard routes
  getAdminDashboard: publicProcedure
    .query(() => getAdminDashboard()),
  
  getDonorDashboard: publicProcedure
    .input(z.object({ donorId: z.number() }))
    .query(({ input }) => getDonorDashboard(input.donorId)),

  // Audit log routes
  createAuditLog: publicProcedure
    .input(z.object({
      userId: z.number(),
      action: z.string(),
      entityType: z.string(),
      entityId: z.number().optional(),
      oldValues: z.string().optional(),
      newValues: z.string().optional(),
      ipAddress: z.string().optional()
    }))
    .mutation(({ input }) => createAuditLog(
      input.userId,
      input.action,
      input.entityType,
      input.entityId,
      input.oldValues,
      input.newValues,
      input.ipAddress
    )),
  
  getAuditLogs: publicProcedure
    .query(() => getAuditLogs())
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
