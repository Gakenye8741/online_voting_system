import { Router } from "express";
import { adminAuth } from "../../middlewares/bearAuth";
import { 
  getElectionBlockchain 
} from "./BlockChain.controller";

const BlockchainRouter = Router();

/* ============================================================
   🔗 GET FULL BLOCKCHAIN FOR A SPECIFIC ELECTION (ADMIN ONLY)
   Endpoint: GET /blockchain/elections/:election_id
   Returns: blocks[] + chain integrity
============================================================ */
BlockchainRouter.get(
  "/elections/:election_id",
  adminAuth,
  getElectionBlockchain
);

export default BlockchainRouter;
