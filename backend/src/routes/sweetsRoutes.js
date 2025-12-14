const express = require('express');
const router = express.Router();
const {
      getSweets,
      createSweet,
      purchaseSweet,
      restockSweet,
      updateSweet,
      deleteSweet,
      searchSweets
} = require('../controllers/sweetsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getSweets);
router.get('/search', searchSweets);
router.post('/', protect, admin, createSweet);
router.put('/:id', protect, admin, updateSweet);
router.delete('/:id', protect, admin, deleteSweet);
router.post('/:id/purchase', protect, purchaseSweet);
router.post('/:id/restock', protect, admin, restockSweet);

module.exports = router;
