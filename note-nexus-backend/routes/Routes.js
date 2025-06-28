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
  newPassword,
  getNotifications,
  resetNotificationCount
} from '../controllers/userController.js';

const router = express.Router();

router.route('/').get((req, res) => {
  res.send('Welcome to the NoteNexus!');
});

router.post('/register', signup);
router.post('/login', signin);
router.post('/add-note', add_note);
router.get('/view-notes', view_notes);
router.get('/note/:noteid', view_note_by_id);
router.put('/edit-note', edit_note);
router.delete('/delete-note/:id', delete_note);
router.get('/profile/:uname', getUserProfile);
router.put('/update-password/:uname', updatePassword);
router.put('/update-profile/:uname', updateUserProfile);
router.post('/reset-password', resetPassword);
router.post('/verify-code', verifyCode);
router.put('/new-password', newPassword);

router.get('/notifications/:username', getNotifications);
router.post('/notifications/reset/:username', resetNotificationCount);

export default router;
