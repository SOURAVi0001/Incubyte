const Sweet = require('../models/Sweet');
const cloudinary = require('../config/cloudinary');

const uploadImageToCloudinary = (file) => {
      if (!file) {
            return Promise.resolve(null);
      }

      return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                  { folder: 'sweet-shop/sweets' },
                  (error, result) => {
                        if (error) {
                              return reject(error);
                        }
                        return resolve(result.secure_url);
                  }
            );

            uploadStream.end(file.buffer);
      });
};

// const testUpload = async (req, res) => {
//       try {
//             console.log("1. Test upload route hit");
            
//             if (!req.file) {
//                   console.log("2. No file received by Multer");
//                   return res.status(400).json({ message: 'No file uploaded. Check Multer config.' });
//             }

//             console.log("2. File received:", req.file.originalname);
//             console.log("3. Attempting upload to Cloudinary...");

//             // Use the existing helper function
//             const url = await uploadImageToCloudinary(req.file);
            
//             console.log("4. Upload success! URL:", url);
            
//             res.json({ 
//                   success: true, 
//                   message: 'Cloudinary connection is working!', 
//                   imageUrl: url 
//             });

//       } catch (error) {
//             console.error("❌ Upload Error Details:", error);
//             res.status(500).json({ 
//                   success: false, 
//                   message: 'Upload failed', 
//                   error: error.message 
//             });
//       }
// };

const getSweets = async (req, res) => {
      try {
            const sweets = await Sweet.find({});
            res.json(sweets);
      } catch (error) {
            res.status(500).json({ message: 'Something went wrong. Please try again later.' });
      }
};

const createSweet = async (req, res) => {
      try {
            const { name, price, description, imageUrl, quantity, category } = req.body;

            const normalizedCategory = typeof category === 'string' ? category.trim() : category;

            if (!name || !price || !description) {
                  return res.status(400).json({ message: 'Invalid request. Please check your input.' });
            }

            const parsedPrice = parseFloat(price);
            if (Number.isNaN(parsedPrice)) {
                  return res.status(400).json({ message: 'Invalid request. Please provide a valid price.' });
            }

            const parsedQuantity = quantity !== undefined && quantity !== ''
                  ? Number(quantity)
                  : 0;

            if (Number.isNaN(parsedQuantity) || parsedQuantity < 0) {
                  return res.status(400).json({ message: 'Invalid request. Quantity must be zero or greater.' });
            }

            let finalImageUrl = imageUrl;

            if (req.file) {
                  finalImageUrl = await uploadImageToCloudinary(req.file);
            }

            if (!finalImageUrl) {
                  return res.status(400).json({ message: 'Invalid request. An image is required.' });
            }

            const sweet = await Sweet.create({
                  name,
                  price: parsedPrice,
                  description,
                  imageUrl: finalImageUrl,
                  category: normalizedCategory || 'General',
                  quantity: parsedQuantity
            });

            res.status(201).json(sweet);
      } catch (error) {
            res.status(500).json({ message: 'Something went wrong. Please try again later.' });
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
            res.status(500).json({ message: 'Something went wrong. Please try again later.' });
      }
};

const restockSweet = async (req, res) => {
      try {
            const { quantity } = req.body;
            const sweet = await Sweet.findById(req.params.id);

            if (!sweet) {
                  return res.status(404).json({ message: 'Sweet not found' });
            }

            const amount = Number(quantity);

            if (Number.isNaN(amount) || amount <= 0) {
                  return res.status(400).json({ message: 'Invalid request. Quantity must be greater than zero.' });
            }

            sweet.quantity += amount;
            await sweet.save();

            res.json(sweet);
      } catch (error) {
            res.status(500).json({ message: 'Something went wrong. Please try again later.' });
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

            if (price !== undefined) {
                  const parsedPrice = parseFloat(price);
                  if (Number.isNaN(parsedPrice)) {
                        return res.status(400).json({ message: 'Invalid request. Please provide a valid price.' });
                  }
                  sweet.price = parsedPrice;
            }

            if (description !== undefined) {
                  sweet.description = description;
            }

            let finalImageUrl = imageUrl || sweet.imageUrl;
            if (req.file) {
                  finalImageUrl = await uploadImageToCloudinary(req.file);
            }
            sweet.imageUrl = finalImageUrl;

            if (quantity !== undefined) {
                  const parsedQuantity = Number(quantity);
                  if (Number.isNaN(parsedQuantity) || parsedQuantity < 0) {
                        return res.status(400).json({ message: 'Invalid request. Quantity must be zero or greater.' });
                  }
                  sweet.quantity = parsedQuantity;
            }

            if (category !== undefined) {
                  const normalizedCategory = typeof category === 'string' ? category.trim() : category;
                  sweet.category = normalizedCategory || 'General';
            }

            await sweet.save();
            res.json(sweet);
      } catch (error) {
            res.status(500).json({ message: 'Something went wrong. Please try again later.' });
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
            res.status(500).json({ message: 'Something went wrong. Please try again later.' });
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
            res.status(500).json({ message: 'Something went wrong. Please try again later.' });
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
      //testUpload
};
