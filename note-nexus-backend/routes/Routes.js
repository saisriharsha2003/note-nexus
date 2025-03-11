import express from 'express';
import { 
  signup, 
  signin, 
  add_note, 
  view_notes, 
  view_note_by_id, 
  edit_note, 
  delete_note, 
  getUserProfile, 
  updatePassword, 
  updateUserProfile, 
  resetPassword, 
  verifyCode, 
  newPassword 
} from '../controllers/userController.js';  

const router = express.Router();

router.route('/').get((req, res) => {
    res.send('Welcome to the NoteNexus!');
});

router.route('/register').post(signup);
router.route('/login').post(signin);
router.route('/add-note').post(add_note);
router.route('/view-notes').get(view_notes);
router.route('/note/:noteid').get(view_note_by_id);
router.route('/edit-note').put(edit_note);
router.route("/delete-note/:id").delete(delete_note);
router.route('/profile/:uname').get(getUserProfile);
router.route('/update-password/:uname').put(updatePassword);
router.route('/update-profile/:uname').put(updateUserProfile);
router.route("/reset-password").post(resetPassword);
router.route("/verify-code").post(verifyCode);
router.route("/new-password").put(newPassword);

export default router;  
