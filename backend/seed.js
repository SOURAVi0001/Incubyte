const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Sweet = require('./src/models/Sweet');
const User = require('./src/models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sweet-shop')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const seedData = async () => {
  try {
    // Clear existing sweets
    await Sweet.deleteMany({});

    const sweets = [
      {
        name: 'Chocolate Truffle',
        price: 2.50,
        description: 'Rich dark chocolate ganache coated in cocoa powder.',
        imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=800&q=80',
        category: 'Chocolate',
        quantity: 50
      },
      {
        name: 'Macarons',
        price: 15.00,
        description: 'Assorted french macarons with various fillings.',
        imageUrl: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80',
        category: 'Pastry',
        quantity: 30
      },
      {
        name: 'Strawberry Cheesecake',
        price: 4.50,
        description: 'Creamy cheesecake with fresh strawberry topping.',
        imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
        category: 'Cheesecake',
        quantity: 20
      },
      {
        name: 'Glazed Donuts',
        price: 1.50,
        description: 'Classic fluffy donuts with sugar glaze.',
        imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
        category: 'Donut',
        quantity: 100
      },
      {
        name: 'Red Velvet Cupcake',
        price: 3.00,
        description: 'Moist red velvet cake with cream cheese frosting.',
        imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=800&q=80',
        category: 'Cupcake',
        quantity: 45
      },
      {
        name: 'Lemon Tart',
        price: 3.50,
        description: 'Zesty lemon curd in a buttery pastry shell.',
        imageUrl: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80',
        category: 'Tart',
        quantity: 15
      }
    ];

    await Sweet.insertMany(sweets);
    console.log('Sweets seeded successfully!');

    // Check if admin exists, if not create one
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('Admin user created: admin@example.com / password123');
    } else {
      console.log('Admin user already exists.');
    }

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
