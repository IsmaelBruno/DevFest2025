import express from "express";
import { registerUser, loginUser, verifyEmail ,getUserByRole,registerMultipleUsers,getPendingUsers,approveUser ,  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStatistics} from "../controllers/userController";
 

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);
router.get("/users/:role", getUserByRole);
router.post("/all",registerMultipleUsers);
router.get('/pending-users', getPendingUsers);
router.post('/approve-user', approveUser);
router.get('/users', getAllUsers); // GET /auth/users?page=1&limit=20&search=john
router.get('/users/:id', getUser); // GET /auth/users/:id
router.put('/users/:id', updateUser); // PUT /auth/users/:id
router.delete('/users/:id', deleteUser); // DELETE /auth/users/:id
router.get('/users-statistics', getUserStatistics); // GET /auth/users-statistics

export default router;
