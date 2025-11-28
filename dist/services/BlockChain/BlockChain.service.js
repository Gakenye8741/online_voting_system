"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlockFromVote = exports.getLastBlock = exports.computeHash = void 0;
const crypto_1 = __importDefault(require("crypto"));
const db_1 = __importDefault(require("../../drizzle/db"));
const schema_1 = require("../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
// ---------------------------------------------
// SHA256 helper
// ---------------------------------------------
const computeHash = (data) => {
    return crypto_1.default.createHash("sha256").update(data).digest("hex");
};
exports.computeHash = computeHash;
// ---------------------------------------------
// Fetch the last block for a specific election
// ---------------------------------------------
const getLastBlock = async (election_id) => {
    return db_1.default.query.blockchain.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.blockchain.election_id, election_id),
        orderBy: [(0, drizzle_orm_1.desc)(schema_1.blockchain.index)],
    });
};
exports.getLastBlock = getLastBlock;
// ---------------------------------------------
// Create blockchain block from vote
// ---------------------------------------------
const createBlockFromVote = async (vote) => {
    // 1️⃣ Get previous block
    const lastBlock = await (0, exports.getLastBlock)(vote.election_id);
    const index = lastBlock ? lastBlock.index + 1 : 1;
    const previous_hash = lastBlock ? lastBlock.hash : "0";
    // 2️⃣ Hash voter (anonymization)
    const voterHash = (0, exports.computeHash)(vote.voter_id);
    // 3️⃣ Hash the entire block payload
    const blockHash = (0, exports.computeHash)(`${index}${voterHash}${vote.candidate_id}${vote.position_id}${vote.election_id}${previous_hash}${vote.timestamp}`);
    // 4️⃣ Prepare block
    const newBlock = {
        index,
        voter_hash: voterHash,
        candidate_id: vote.candidate_id,
        position_id: vote.position_id,
        election_id: vote.election_id,
        previous_hash,
        hash: blockHash,
        timestamp: vote.timestamp, // assuming your schema has timestamp
    };
    // 5️⃣ Insert block
    const [insertedBlock] = await db_1.default
        .insert(schema_1.blockchain)
        .values(newBlock)
        .returning();
    return insertedBlock;
};
exports.createBlockFromVote = createBlockFromVote;
