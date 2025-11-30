"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relations = exports.audit_logs = exports.blockchain = exports.votes = exports.candidate_applications = exports.candidates = exports.positions = exports.coalitions = exports.election_settings = exports.elections = exports.sessions = exports.users = exports.approvalStatus = exports.graduationStatus = exports.DeanRole = exports.School = exports.positionTier = exports.electionStatus = exports.userRole = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
/* ===============================
   1️⃣ ENUMS
=============================== */
exports.userRole = (0, pg_core_1.pgEnum)("user_role", ["voter", "admin", "Dean_of_Science",
    "Dean_of_Education",
    "Dean_of_Business",
    "Dean_of_Humanities_and_Developmental_Studies",
    "Dean_of_TVET",
    "Dean_of_Students"]);
exports.electionStatus = (0, pg_core_1.pgEnum)("election_status", ["upcoming", "ongoing", "finished"]);
exports.positionTier = (0, pg_core_1.pgEnum)("position_tier", ["school", "university"]);
exports.School = (0, pg_core_1.pgEnum)("school", [
    "Science",
    "Education",
    "Business",
    "Humanities and Developmental_Studies",
    "TVET"
]);
// Deans Enum (5 School Deans + Dean of Students)
exports.DeanRole = (0, pg_core_1.pgEnum)("dean_role", [
    "Dean_of_Science",
    "Dean_of_Education",
    "Dean_of_Business",
    "Dean_of_Humanities_and_Developmental_Studies",
    "Dean_of_TVET",
    "Dean_of_Students"
]);
// Graduation Status Enum
exports.graduationStatus = (0, pg_core_1.pgEnum)("graduation_status", [
    "active", // currently enrolled, eligible to vote
    "graduated", // finished school
    "deferred", // postponed graduation
    "inactive" // dropped out / expelled
]);
// Approval status for candidate applications
exports.approvalStatus = (0, pg_core_1.pgEnum)("approval_status", ["PENDING", "APPROVED", "REJECTED"]);
/* ===============================
   2️⃣ TABLES
=============================== */
// Users Table
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").default((0, drizzle_orm_1.sql) `gen_random_uuid()`).primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }),
    reg_no: (0, pg_core_1.varchar)("reg_no", { length: 20 }).notNull(),
    password: (0, pg_core_1.varchar)("password", { length: 255 }).notNull(),
    role: (0, exports.userRole)("role").notNull().default("voter"),
    expected_graduation: (0, pg_core_1.varchar)("expected_graduation", { length: 7 }).notNull(), // MM/YYYY format
    graduation_status: (0, exports.graduationStatus)("graduation_status").default("active"),
    school: (0, exports.School)("school"),
    profile_complete: (0, pg_core_1.boolean)("profile_complete").notNull().default(false), // <-- new column
    // Security fields
    secret_code_hash: (0, pg_core_1.varchar)("secret_code_hash", { length: 255 }),
    has_secret_code: (0, pg_core_1.boolean)("has_secret_code").notNull().default(false),
    face_embedding: (0, pg_core_1.text)("face_embedding"), // store encrypted/serialized embedding (e.g. base64 or JSON string)
    has_face_verification: (0, pg_core_1.boolean)("has_face_verification").notNull().default(false),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Sessions Table
exports.sessions = (0, pg_core_1.pgTable)("sessions", {
    id: (0, pg_core_1.uuid)("id").default((0, drizzle_orm_1.sql) `gen_random_uuid()`).primaryKey(),
    user_id: (0, pg_core_1.uuid)("user_id").notNull().references(() => exports.users.id),
    token: (0, pg_core_1.text)("token").notNull(),
    expires_at: (0, pg_core_1.timestamp)("expires_at").notNull(),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Elections Table
exports.elections = (0, pg_core_1.pgTable)("elections", {
    id: (0, pg_core_1.uuid)("id").default((0, drizzle_orm_1.sql) `gen_random_uuid()`).primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    start_date: (0, pg_core_1.timestamp)("start_date").notNull(),
    end_date: (0, pg_core_1.timestamp)("end_date").notNull(),
    created_by: (0, pg_core_1.uuid)("created_by").notNull().references(() => exports.users.id),
    status: (0, exports.electionStatus)("status").default("upcoming"),
});
// Election Settings Table
exports.election_settings = (0, pg_core_1.pgTable)("election_settings", {
    id: (0, pg_core_1.uuid)("id").default((0, drizzle_orm_1.sql) `gen_random_uuid()`).primaryKey(),
    election_id: (0, pg_core_1.uuid)("election_id").notNull().references(() => exports.elections.id),
    max_votes_per_voter: (0, pg_core_1.varchar)("max_votes_per_voter", { length: 10 }).default("1"),
    anonymous: (0, pg_core_1.boolean)("anonymous").default(true),
});
// Coalitions Table
exports.coalitions = (0, pg_core_1.pgTable)("coalitions", {
    id: (0, pg_core_1.uuid)("id").default((0, drizzle_orm_1.sql) `gen_random_uuid()`).primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Positions Table
exports.positions = (0, pg_core_1.pgTable)("positions", {
    id: (0, pg_core_1.uuid)("id").default((0, drizzle_orm_1.sql) `gen_random_uuid()`).primaryKey(),
    election_id: (0, pg_core_1.uuid)("election_id").notNull().references(() => exports.elections.id),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    school: (0, exports.School)("school"),
    tier: (0, exports.positionTier)("tier").notNull(),
    coalition_id: (0, pg_core_1.uuid)("coalition_id").references(() => exports.coalitions.id),
}, (table) => ({
    // Ensure school-level positions cannot belong to a coalition
    coalitionConstraint: (0, drizzle_orm_1.sql) `CHECK (tier != 'school' OR coalition_id IS NULL)`
}));
// Candidates Table
exports.candidates = (0, pg_core_1.pgTable)("candidates", {
    id: (0, pg_core_1.uuid)("id").default((0, drizzle_orm_1.sql) `gen_random_uuid()`).primaryKey(),
    position_id: (0, pg_core_1.uuid)("position_id").notNull().references(() => exports.positions.id),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    photo_url: (0, pg_core_1.varchar)("photo_url", { length: 255 }),
    bio: (0, pg_core_1.text)("bio"),
    coalition_id: (0, pg_core_1.uuid)("coalition_id").references(() => exports.coalitions.id),
    school: (0, exports.School)("school"),
});
// Candidate Applications Table (multi-stage approvals)
exports.candidate_applications = (0, pg_core_1.pgTable)("candidate_applications", {
    id: (0, pg_core_1.uuid)("id").default((0, drizzle_orm_1.sql) `gen_random_uuid()`).primaryKey(),
    student_id: (0, pg_core_1.uuid)("student_id").notNull().references(() => exports.users.id),
    position_id: (0, pg_core_1.uuid)("position_id").notNull().references(() => exports.positions.id),
    manifesto: (0, pg_core_1.text)("manifesto"),
    documents_url: (0, pg_core_1.text)("documents_url"), // link to uploaded docs (could be json list)
    // Stage approvals in the new order: School Dean -> Accounts -> Dean of Students
    school_dean_status: (0, exports.approvalStatus)("school_dean_status").notNull().default("PENDING"),
    school_dean_id: (0, pg_core_1.uuid)("school_dean_id").references(() => exports.users.id),
    school_dean_comment: (0, pg_core_1.text)("school_dean_comment"),
    accounts_status: (0, exports.approvalStatus)("accounts_status").notNull().default("PENDING"),
    accounts_officer_id: (0, pg_core_1.uuid)("accounts_officer_id").references(() => exports.users.id),
    accounts_comment: (0, pg_core_1.text)("accounts_comment"),
    dean_of_students_status: (0, exports.approvalStatus)("dean_of_students_status").notNull().default("PENDING"),
    dean_of_students_id: (0, pg_core_1.uuid)("dean_of_students_id").references(() => exports.users.id),
    dean_of_students_comment: (0, pg_core_1.text)("dean_of_students_comment"),
    overall_status: (0, exports.approvalStatus)("overall_status").notNull().default("PENDING"),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
}, (table) => ({
    uniqueApplication: (0, pg_core_1.uniqueIndex)("unique_application_per_position").on(table.student_id, table.position_id),
}));
// Votes Table
exports.votes = (0, pg_core_1.pgTable)("votes", {
    id: (0, pg_core_1.uuid)("id").default((0, drizzle_orm_1.sql) `gen_random_uuid()`).primaryKey(),
    voter_id: (0, pg_core_1.uuid)("voter_id").notNull().references(() => exports.users.id),
    candidate_id: (0, pg_core_1.uuid)("candidate_id").notNull().references(() => exports.candidates.id),
    position_id: (0, pg_core_1.uuid)("position_id").notNull().references(() => exports.positions.id),
    election_id: (0, pg_core_1.uuid)("election_id").notNull().references(() => exports.elections.id),
    timestamp: (0, pg_core_1.timestamp)("timestamp").defaultNow(),
}, (table) => ({
    uniqueVote: (0, pg_core_1.uniqueIndex)("unique_vote_per_position").on(table.voter_id, table.position_id),
}));
// Blockchain Table (index -> integer)
exports.blockchain = (0, pg_core_1.pgTable)("blockchain", {
    id: (0, pg_core_1.uuid)("id").default((0, drizzle_orm_1.sql) `gen_random_uuid()`).primaryKey(),
    index: (0, pg_core_1.integer)("index").notNull(),
    voter_hash: (0, pg_core_1.varchar)("voter_hash", { length: 255 }).notNull(),
    candidate_id: (0, pg_core_1.uuid)("candidate_id").notNull().references(() => exports.candidates.id),
    position_id: (0, pg_core_1.uuid)("position_id").notNull().references(() => exports.positions.id),
    election_id: (0, pg_core_1.uuid)("election_id").notNull().references(() => exports.elections.id),
    previous_hash: (0, pg_core_1.varchar)("previous_hash", { length: 255 }).notNull(),
    hash: (0, pg_core_1.varchar)("hash", { length: 255 }).notNull(),
    timestamp: (0, pg_core_1.timestamp)("timestamp").defaultNow(),
});
// Audit Logs Table
exports.audit_logs = (0, pg_core_1.pgTable)("audit_logs", {
    id: (0, pg_core_1.uuid)("id").default((0, drizzle_orm_1.sql) `gen_random_uuid()`).primaryKey(),
    admin_id: (0, pg_core_1.uuid)("admin_id").notNull().references(() => exports.users.id),
    action: (0, pg_core_1.text)("action").notNull(),
    timestamp: (0, pg_core_1.timestamp)("timestamp").defaultNow(),
});
/* ===============================
   3️⃣ RELATIONSHIPS
=============================== */
exports.relations = {
    users: {
        sessions: () => exports.sessions.user_id,
        createdElections: () => exports.elections.created_by,
        votes: () => exports.votes.voter_id,
        auditLogs: () => exports.audit_logs.admin_id,
        applications: () => exports.candidate_applications.student_id,
    },
    elections: {
        settings: () => exports.election_settings.election_id,
        positions: () => exports.positions.election_id,
        votes: () => exports.votes.election_id,
    },
    positions: {
        candidates: () => exports.candidates.position_id,
        votes: () => exports.votes.position_id,
        coalition: () => exports.coalitions.id,
        election: () => exports.elections.id,
        applications: () => exports.candidate_applications.position_id,
    },
    candidates: {
        position: () => exports.positions.id,
        votes: () => exports.votes.candidate_id,
        coalition: () => exports.coalitions.id,
        blockchain: () => exports.blockchain.candidate_id,
    },
    coalitions: {
        positions: () => exports.positions.coalition_id,
        candidates: () => exports.candidates.coalition_id,
    },
    votes: {
        voter: () => exports.users.id,
        candidate: () => exports.candidates.id,
        position: () => exports.positions.id,
        election: () => exports.elections.id,
    },
    blockchain: {
        candidate: () => exports.candidates.id,
        position: () => exports.positions.id,
        election: () => exports.elections.id,
    },
    audit_logs: {
        admin: () => exports.users.id,
    },
    candidate_applications: {
        student: () => exports.users.id,
        position: () => exports.positions.id,
    }
};
