const Sweet = require('../models/Sweet');

const getSweets = async (req, res) => {
      try {
            const sweets = await Sweet.find({});
            res.json(sweets);
      } catch (error) {
            res.status(500).json({ message: error.message });
      }
};

const createSweet = async (req, res) => {
      try {
            const { name, price, description, imageUrl, quantity, category } = req.body;

            if (!name || !price || !description || !imageUrl) {
                  return res.status(400).json({ message: 'Please add all fields' });
            }

            const sweet = await Sweet.create({
                  name,
                  price,
                  description,
                  imageUrl,
                  category: category || 'General',
                  quantity: quantity || 0
            });

            res.status(201).json(sweet);
      } catch (error) {
            res.status(500).json({ message: error.message });
      }
};

const purchaseSweet = async (req, res) => {
      try {
            const sweet = await Sweet.findOneAndUpdate(
                  { _id: req.params.id, quantity: { $gt: 0 } },
                  { $inc: { quantity: -1 } },
                  { new: true }
            );

            if (!sweet) {
                  // Check if sweet exists but is out of stock, or doesn't exist
                  const sweetExists = await Sweet.findById(req.params.id);
                  if (!sweetExists) {
                        return res.status(404).json({ message: 'Sweet not found' });
                  }
                  return res.status(400).json({ message: 'Sweet is out of stock' });
            }
            res.json(sweet);
      } catch (error) {
            res.status(500).json({ message: error.message });
      }
};

const restockSweet = async (req, res) => {
      try {
            const { quantity } = req.body;
            const sweet = await Sweet.findById(req.params.id);

            if (!sweet) {
                  return res.status(404).json({ message: 'Sweet not found' });
            }

            sweet.quantity += Number(quantity);
            await sweet.save();

            res.json(sweet);
      } catch (error) {
            res.status(500).json({ message: error.message });
      }
};

const updateSweet = async (req, res) => {
      try {
            const { name, price, description, imageUrl, quantity, category } = req.body;
            const sweet = await Sweet.findById(req.params.id);

            if (!sweet) {
                  return res.status(404).json({ message: 'Sweet not found' });
            }

            if (name) sweet.name = name;
            if (price) sweet.price = price;
            if (description) sweet.description = description;
            if (imageUrl) sweet.imageUrl = imageUrl;
            if (quantity !== undefined) sweet.quantity = quantity;
            if (category !== undefined) sweet.category = category || 'General';

            await sweet.save();
            res.json(sweet);
      }
      catch (error) {
            res.status(500).json({ message: error.message });
      }
};

const deleteSweet = async (req, res) => {
      try {
            const sweet = await Sweet.findByIdAndDelete(req.params.id);

            if (!sweet) {
                  return res.status(404).json({ message: 'Sweet not found' });
            }

            res.json({ message: 'Sweet deleted successfully' });
      } catch (error) {
            res.status(500).json({ message: error.message });
      }
};

const searchSweets = async (req, res) => {
      try {
            const { name, category, minPrice, maxPrice } = req.query;
            const query = {};

            if (name) {
                  query.name = { $regex: name, $options: 'i' };
            }

            if (category) {
                  query.category = { $regex: category, $options: 'i' };
            }

            const hasMinPrice = typeof minPrice === 'string' && minPrice.trim() !== '';
            const hasMaxPrice = typeof maxPrice === 'string' && maxPrice.trim() !== '';

            if (hasMinPrice || hasMaxPrice) {
                  query.price = {};

                  let min;
                  if (hasMinPrice) {
                        min = parseFloat(minPrice);
                        if (Number.isNaN(min)) {
                              return res.status(400).json({ message: 'Invalid minPrice value' });
                        }
                        query.price.$gte = min;
                  }

                  let max;
                  if (hasMaxPrice) {
                        max = parseFloat(maxPrice);
                        if (Number.isNaN(max)) {
                              return res.status(400).json({ message: 'Invalid maxPrice value' });
                        }
                        query.price.$lte = max;
                  }

                  if (min !== undefined && max !== undefined && min > max) {
                        return res.status(400).json({ message: 'minPrice cannot be greater than maxPrice' });
                  }
            }

            const sweets = await Sweet.find(query);
            res.json(sweets);
      } catch (error) {
            res.status(500).json({ message: error.message });
      }
};

module.exports = {
      getSweets,
      createSweet,
      purchaseSweet,
      restockSweet,
      updateSweet,
      deleteSweet,
      searchSweets
};
