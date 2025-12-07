import { Router } from "express";

import {
  createNotificationController,
  sendBulkNotificationsController,
  sendNotificationToAllUsersController,
  getAllNotificationsController,
  getNotificationsForUserController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
  deleteNotificationController,
  deleteAllNotificationsForUserController,
} from "./Notification.controller";

import { adminAuth, anyAuthenticatedUser } from "../../middlewares/bearAuth";

const NotificationsRouter = Router();

/* ----------------------------------
   Admin Create / Broadcast
----------------------------------- */

// Create a single notification (admin)
NotificationsRouter.post("/create", adminAuth, createNotificationController);

// Send notification to MANY users
NotificationsRouter.post("/bulk", adminAuth, sendBulkNotificationsController);

// Send notification to ALL users
NotificationsRouter.post("/broadcast", adminAuth, sendNotificationToAllUsersController);

/* ----------------------------------
   Admin Read
----------------------------------- */

// Get ALL notifications (admin)
NotificationsRouter.get("/", adminAuth, getAllNotificationsController);

/* ----------------------------------
   User Read
----------------------------------- */

// Get notifications for a specific user
NotificationsRouter.get("/user/:userId", anyAuthenticatedUser, getNotificationsForUserController);

/* ----------------------------------
   Mark as Read
----------------------------------- */

// Mark ONE notification as read
NotificationsRouter.put("/mark-read/:id", anyAuthenticatedUser, markNotificationAsReadController);

// Mark ALL notifications as read (user)
NotificationsRouter.put(
  "/mark-all-read/:userId",
  anyAuthenticatedUser,
  markAllNotificationsAsReadController
);

/* ----------------------------------
   Delete Notifications
----------------------------------- */

// Delete a SINGLE notification
NotificationsRouter.delete("/delete/:id", adminAuth, deleteNotificationController);

// Delete ALL notifications for a user
NotificationsRouter.delete(
  "/delete-all/:userId",
  adminAuth,
  deleteAllNotificationsForUserController
);

export default NotificationsRouter;
