import { 
  pgTable, uuid, varchar, timestamp, text, uniqueIndex, pgEnum, boolean, integer
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/* ===============================
   1️⃣ ENUMS
=============================== */
export const userRole = pgEnum("user_role", ["voter", "admin" ,  "Dean_of_Science",
  "Dean_of_Education",
  "Dean_of_Business",
  "Dean_of_Humanities_and_Developmental_Studies",
  "Dean_of_TVET",
  "Dean_of_Students",
  "Accountants"
]);
export const electionStatus = pgEnum("election_status", ["upcoming", "ongoing", "finished"]);
export const positionTier = pgEnum("position_tier", ["school", "university"]);
export const School = pgEnum("school", [
  "Science",
  "Education",
  "Business",
  "Humanities and Developmental_Studies",  
  "TVET"
]);

export const DeanRole = pgEnum("dean_role", [
  "Dean_of_Science",
  "Dean_of_Education",
  "Dean_of_Business",
  "Dean_of_Humanities_and_Developmental_Studies",
  "Dean_of_TVET",
  "Dean_of_Students"
]);

export const graduationStatus = pgEnum("graduation_status", [
  "active",
  "graduated",
  "deferred",
  "inactive"
]);

export const approvalStatus = pgEnum("approval_status", ["PENDING", "APPROVED", "REJECTED"]);

/* 🔔 Notification Type Enum */
export const notificationTypeEnum = pgEnum("notification_type", [
  "SYSTEM",
  "ANNOUNCEMENT",
  "ELECTION",
  "REMINDER",
  "WARNING",
]);

/* ===============================
   2️⃣ TABLES
=============================== */

// Users Table
export const users = pgTable("users", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  reg_no: varchar("reg_no", { length: 20 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: userRole("role").notNull().default("voter"),
  expected_graduation: varchar("expected_graduation", { length: 7 }).notNull(),
  graduation_status: graduationStatus("graduation_status").default("active"),
  school: School("school"),

  profile_complete: boolean("profile_complete").notNull().default(false),
  secret_code_hash: varchar("secret_code_hash", { length: 255 }),
  has_secret_code: boolean("has_secret_code").notNull().default(false),
  face_embedding: text("face_embedding"),
  has_face_verification: boolean("has_face_verification").notNull().default(false),
  created_at: timestamp("created_at").defaultNow(),
});

// Sessions Table
export const sessions = pgTable("sessions", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  token: text("token").notNull(),
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// Elections Table
export const elections = pgTable("elections", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  start_date: timestamp("start_date").notNull(),
  end_date: timestamp("end_date").notNull(),
  created_by: uuid("created_by").notNull().references(() => users.id),
  status: electionStatus("status").default("upcoming"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Election Settings Table
export const election_settings = pgTable("election_settings", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  election_id: uuid("election_id").notNull().references(() => elections.id),
  max_votes_per_voter: varchar("max_votes_per_voter", { length: 10 }).default("1"),
  anonymous: boolean("anonymous").default(true),
});

// Coalitions Table
export const coalitions = pgTable("coalitions", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// Positions Table
export const positions = pgTable("positions", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  election_id: uuid("election_id").notNull().references(() => elections.id),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  school: School("school"),
  tier: positionTier("tier").notNull(),
  coalition_id: uuid("coalition_id").references(() => coalitions.id),
}, (table) => ({
  coalitionConstraint: sql`CHECK (tier != 'school' OR coalition_id IS NULL)`
}));

// Candidates Table
export const candidates = pgTable("candidates", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  position_id: uuid("position_id").notNull().references(() => positions.id),
  election_id: uuid("election_id").notNull().references(() => elections.id),
  name: varchar("name", { length: 255 }).notNull(),
  photo_url: varchar("photo_url", { length: 255 }),
  bio: text("bio"),
  coalition_id: uuid("coalition_id").references(() => coalitions.id),
  school: School("school"),
});

// Candidate Applications Table
export const candidate_applications = pgTable("candidate_applications", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  student_id: uuid("student_id").notNull().references(() => users.id),
  position_id: uuid("position_id").notNull().references(() => positions.id),
  election_id: uuid("election_id").notNull().references(() => elections.id),
  manifesto: text("manifesto"),
  documents_url: text("documents_url"),
  school: School("school").notNull(),

  school_dean_status: approvalStatus("school_dean_status").notNull().default("PENDING"),
  school_dean_id: uuid("school_dean_id").references(() => users.id),
  school_dean_comment: text("school_dean_comment"),

  accounts_status: approvalStatus("accounts_status").notNull().default("PENDING"),
  accounts_officer_id: uuid("accounts_officer_id").references(() => users.id),
  accounts_comment: text("accounts_comment"),

  dean_of_students_status: approvalStatus("dean_of_students_status").notNull().default("PENDING"),
  dean_of_students_id: uuid("dean_of_students_id").references(() => users.id),
  dean_of_students_comment: text("dean_of_students_comment"),

  overall_status: approvalStatus("overall_status").notNull().default("PENDING"),

  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
}, (table) => ({
  uniqueApplication: uniqueIndex("unique_application_per_position_per_election")
    .on(table.student_id, table.position_id, table.election_id),
}));

// Votes Table
export const votes = pgTable("votes", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  voter_id: uuid("voter_id").notNull().references(() => users.id),
  candidate_id: uuid("candidate_id").notNull().references(() => candidates.id),
  position_id: uuid("position_id").notNull().references(() => positions.id),
  election_id: uuid("election_id").notNull().references(() => elections.id),
  timestamp: timestamp("timestamp").defaultNow(),
}, (table) => ({
  uniqueVote: uniqueIndex("unique_vote_per_position").on(table.voter_id, table.position_id),
}));

// Blockchain Table
export const blockchain = pgTable("blockchain", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  index: integer("index").notNull(),
  voter_hash: varchar("voter_hash", { length: 255 }).notNull(),
  candidate_id: uuid("candidate_id").notNull().references(() => candidates.id),
  position_id: uuid("position_id").notNull().references(() => positions.id),
  election_id: uuid("election_id").notNull().references(() => elections.id),
  previous_hash: varchar("previous_hash", { length: 255 }).notNull(),
  hash: varchar("hash", { length: 255 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Audit Logs Table
export const audit_logs = pgTable("audit_logs", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  admin_id: uuid("admin_id").notNull().references(() => users.id),
  action: text("action").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});


/* ===============================
   🔔 NEW — Notifications Table
=============================== */
export const notifications = pgTable("notifications", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),

  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),

  type: notificationTypeEnum("type").default("SYSTEM").notNull(),

  sender_id: uuid("sender_id").references(() => users.id, { onDelete: "set null" }),
  user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),

  election_id: uuid("election_id").references(() => elections.id, { onDelete: "set null" }),

  is_read: boolean("is_read").default(false).notNull(),

  created_at: timestamp("created_at").defaultNow().notNull(),
});


/* ===============================
   3️⃣ RELATIONSHIPS
=============================== */
export const relations = {
  users: {
    sessions: () => sessions.user_id,
    createdElections: () => elections.created_by,
    votes: () => votes.voter_id,
    auditLogs: () => audit_logs.admin_id,
    applications: () => candidate_applications.student_id,
  },
  elections: {
    settings: () => election_settings.election_id,
    positions: () => positions.election_id,
    votes: () => votes.election_id,
    candidates: () => candidates.election_id,
  },
  positions: {
    candidates: () => candidates.position_id,
    votes: () => votes.position_id,
    coalition: () => coalitions.id,
    election: () => elections.id,
    applications: () => candidate_applications.position_id,
  },
  candidates: {
    position: () => positions.id,
    votes: () => votes.candidate_id,
    coalition: () => coalitions.id,
    blockchain: () => blockchain.candidate_id,
  },
  coalitions: {
    positions: () => positions.coalition_id,
    candidates: () => candidates.coalition_id,
  },
  votes: {
    voter: () => users.id,
    candidate: () => candidates.id,
    position: () => positions.id,
    election: () => elections.id,
  },
  blockchain: {
    candidate: () => candidates.id,
    position: () => positions.id,
    election: () => elections.id,
  },
  audit_logs: {
    admin: () => users.id,
  },
  candidate_applications: {
    student: () => users.id,
    position: () => positions.id,
  },
  notifications: {
    user: () => users.id,
    election: () => elections.id,
  }
};


/* ===============================
   4️⃣ TYPE INFERENCES
=============================== */
export type UserSelect = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export type SessionSelect = typeof sessions.$inferSelect;
export type SessionInsert = typeof sessions.$inferInsert;

export type ElectionSelect = typeof elections.$inferSelect;
export type ElectionInsert = typeof elections.$inferInsert;

export type ElectionSettingsSelect = typeof election_settings.$inferSelect;
export type ElectionSettingsInsert = typeof election_settings.$inferInsert;

export type CoalitionSelect = typeof coalitions.$inferSelect;
export type CoalitionInsert = typeof coalitions.$inferInsert;

export type PositionSelect = typeof positions.$inferSelect;
export type PositionInsert = typeof positions.$inferInsert;

export type CandidateSelect = typeof candidates.$inferSelect;
export type CandidateInsert = typeof candidates.$inferInsert;

export type CandidateApplicationSelect = typeof candidate_applications.$inferSelect;
export type CandidateApplicationInsert = typeof candidate_applications.$inferInsert;

export type VoteSelect = typeof votes.$inferSelect;
export type VoteInsert = typeof votes.$inferInsert;

export type BlockSelect = typeof blockchain.$inferSelect;
export type BlockInsert = typeof blockchain.$inferInsert;

export type AuditLogSelect = typeof audit_logs.$inferSelect;
export type AuditLogInsert = typeof audit_logs.$inferInsert;

/* 🔔 Notification Types */
export type NotificationSelect = typeof notifications.$inferSelect;
export type NotificationInsert = typeof notifications.$inferInsert;
