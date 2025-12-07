import { z } from "zod";

export const notificationTypeEnum = z.enum([
  "SYSTEM",
  "ANNOUNCEMENT",
  "ELECTION",
  "REMINDER",
  "WARNING",
]);

export const createNotificationSchema = z.object({
  user_id: z.string().uuid().nullable().optional(), // allow null for broadcast

  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),

  type: notificationTypeEnum,

  election_id: z.string().uuid().nullable().optional(),
  candidate_id: z.string().uuid().nullable().optional(),
  position_id: z.string().uuid().nullable().optional(),

  is_read: z.boolean().optional().default(false),
});

export const updateNotificationSchema = z.object({
  is_read: z.boolean().optional(),
});
