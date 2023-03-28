const express = require('express');
const noteController = require('../controller/note.controller');
const authMiddleware = require('../middleware/jwt.auth');
const router = express.Router();




router.get('/view_all',authMiddleware,noteController.viewAllNotes);
router.post('/create',authMiddleware,noteController.createNote);
router.patch('/edit/:id',authMiddleware,noteController.editNote);
router.delete('/delete/:id',authMiddleware,noteController.deleteNote);





module.exports = router;