import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
import User from './models/User.js';
import SHG from './models/SHG.js';
import Product from './models/Product.js';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

// Sample data
const users = [
    {
        name: 'Admin User',
        email: 'admin@shgmart.com',
        password: 'admin123',
        phone: '9876543210',
        role: 'admin',
    },
    {
        name: 'Lakshmi SHG',
        email: 'lakshmi@shg.com',
        password: 'shg123',
        phone: '9876543211',
        role: 'shg',
    },
    {
        name: 'Durga SHG',
        email: 'durga@shg.com',
        password: 'shg123',
        phone: '9876543212',
        role: 'shg',
    },
    {
        name: 'Saraswati SHG',
        email: 'saraswati@shg.com',
        password: 'shg123',
        phone: '9876543213',
        role: 'shg',
    },
    {
        name: 'Customer One',
        email: 'customer@test.com',
        password: 'customer123',
        phone: '9876543214',
        role: 'customer',
    },
];

const shgs = [
    {
        shgName: 'Lakshmi Women Empowerment Group',
        registrationNumber: 'SHG2024001',
        description: 'Specializing in handmade textiles and traditional crafts',
        address: {
            street: 'MG Road',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001',
        },
        contactEmail: 'lakshmi@shg.com',
        contactPhone: '9876543211',
        bankDetails: {
            accountNumber: '1234567890',
            ifscCode: 'SBIN0001234',
            bankName: 'State Bank of India',
            branchName: 'MG Road Branch',
        },
        members: [
            { name: 'Lakshmi Devi', role: 'President', phone: '9876543211' },
            { name: 'Radha Bai', role: 'Secretary', phone: '9876543221' },
            { name: 'Sita Devi', role: 'Treasurer', phone: '9876543231' },
        ],
        approved: true,
    },
    {
        shgName: 'Durga Handicrafts Collective',
        registrationNumber: 'SHG2024002',
        description: 'Creating beautiful handicrafts and home decor items',
        address: {
            street: 'Anna Nagar',
            city: 'Chennai',
            state: 'Tamil Nadu',
            pincode: '600040',
        },
        contactEmail: 'durga@shg.com',
        contactPhone: '9876543212',
        bankDetails: {
            accountNumber: '2345678901',
            ifscCode: 'HDFC0001234',
            bankName: 'HDFC Bank',
            branchName: 'Anna Nagar Branch',
        },
        members: [
            { name: 'Durga Devi', role: 'President', phone: '9876543212' },
            { name: 'Parvati Bai', role: 'Secretary', phone: '9876543222' },
        ],
        approved: true,
    },
    {
        shgName: 'Saraswati Organic Products',
        registrationNumber: 'SHG2024003',
        description: 'Producing organic food products and natural cosmetics',
        address: {
            street: 'Civil Lines',
            city: 'Jaipur',
            state: 'Rajasthan',
            pincode: '302006',
        },
        contactEmail: 'saraswati@shg.com',
        contactPhone: '9876543213',
        bankDetails: {
            accountNumber: '3456789012',
            ifscCode: 'ICIC0001234',
            bankName: 'ICICI Bank',
            branchName: 'Civil Lines Branch',
        },
        members: [
            { name: 'Saraswati Devi', role: 'President', phone: '9876543213' },
            { name: 'Gayatri Bai', role: 'Secretary', phone: '9876543223' },
        ],
        approved: true,
    },
];

const products = [
    {
        name: 'Handwoven Cotton Saree',
        description: 'Beautiful handwoven cotton saree with traditional designs. Made with 100% pure cotton and natural dyes. Perfect for daily wear and special occasions.',
        price: 1499,
        category: 'Textiles',
        stock: 15,
        images: [
            { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600', publicId: 'saree1' },
            { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600', publicId: 'saree2' },
        ],
        rating: 4.5,
        numReviews: 12,
        isActive: true,
        isApproved: true,
    },
    {
        name: 'Bamboo Basket Set',
        description: 'Eco-friendly bamboo basket set of 3 pieces. Handcrafted with natural bamboo. Ideal for storage and home decoration.',
        price: 799,
        category: 'Handicrafts',
        stock: 25,
        images: [
            { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', publicId: 'basket1' },
        ],
        rating: 4.8,
        numReviews: 18,
        isActive: true,
        isApproved: true,
    },
    {
        name: 'Terracotta Jewelry Set',
        description: 'Handmade terracotta jewelry set including necklace and earrings. Traditional designs with modern appeal.',
        price: 599,
        category: 'Jewelry',
        stock: 30,
        images: [
            { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600', publicId: 'jewelry1' },
        ],
        rating: 4.6,
        numReviews: 15,
        isActive: true,
        isApproved: true,
    },
    {
        name: 'Organic Turmeric Powder',
        description: 'Pure organic turmeric powder, 500g pack. Grown without pesticides. Rich in curcumin with natural healing properties.',
        price: 299,
        category: 'Food Products',
        stock: 50,
        images: [
            { url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600', publicId: 'turmeric1' },
        ],
        rating: 4.9,
        numReviews: 25,
        isActive: true,
        isApproved: true,
    },
    {
        name: 'Hand-painted Madhubani Wall Art',
        description: 'Traditional Madhubani painting on canvas. Vibrant colors depicting nature and mythology. Size: 12x18 inches.',
        price: 1299,
        category: 'Home Decor',
        stock: 10,
        images: [
            { url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600', publicId: 'art1' },
        ],
        rating: 4.7,
        numReviews: 8,
        isActive: true,
        isApproved: true,
    },
    {
        name: 'Jute Shopping Bag',
        description: 'Eco-friendly jute shopping bag with sturdy handles. Reusable and biodegradable. Perfect for grocery shopping.',
        price: 249,
        category: 'Handicrafts',
        stock: 40,
        images: [
            { url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600', publicId: 'jute1' },
        ],
        rating: 4.4,
        numReviews: 20,
        isActive: true,
        isApproved: true,
    },
    {
        name: 'Handmade Soap Set',
        description: 'Natural handmade soap set of 5 bars. Made with organic ingredients, essential oils, and herbs. Chemical-free.',
        price: 499,
        category: 'Beauty Products',
        stock: 35,
        images: [
            { url: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=600', publicId: 'soap1' },
        ],
        rating: 4.8,
        numReviews: 22,
        isActive: true,
        isApproved: true,
    },
    {
        name: 'Embroidered Cushion Covers',
        description: 'Set of 2 embroidered cushion covers. Traditional embroidery on cotton fabric. Size: 16x16 inches.',
        price: 699,
        category: 'Home Decor',
        stock: 20,
        images: [
            { url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600', publicId: 'cushion1' },
        ],
        rating: 4.5,
        numReviews: 14,
        isActive: true,
        isApproved: true,
    },
    {
        name: 'Organic Honey',
        description: 'Pure organic honey, 500g jar. Collected from natural bee farms. Rich in antioxidants and natural enzymes.',
        price: 399,
        category: 'Food Products',
        stock: 45,
        images: [
            { url: 'https://images.unsplash.com/photo-1587049352846-4a222e784720?w=600', publicId: 'honey1' },
        ],
        rating: 4.9,
        numReviews: 30,
        isActive: true,
        isApproved: true,
    },
    {
        name: 'Handloom Cotton Stole',
        description: 'Soft handloom cotton stole with traditional weave. Perfect accessory for any outfit. Size: 2m x 0.7m.',
        price: 899,
        category: 'Textiles',
        stock: 18,
        images: [
            { url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600', publicId: 'stole1' },
        ],
        rating: 4.6,
        numReviews: 11,
        isActive: true,
        isApproved: true,
    },
    {
        name: 'Clay Diya Set',
        description: 'Handmade clay diya set of 12 pieces. Traditional oil lamps for festivals and daily worship. Eco-friendly.',
        price: 199,
        category: 'Handicrafts',
        stock: 60,
        images: [
            { url: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600', publicId: 'diya1' },
        ],
        rating: 4.7,
        numReviews: 28,
        isActive: true,
        isApproved: true,
    },
    {
        name: 'Beaded Necklace',
        description: 'Colorful beaded necklace with traditional patterns. Handcrafted with wooden and glass beads.',
        price: 449,
        category: 'Jewelry',
        stock: 25,
        images: [
            { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600', publicId: 'necklace1' },
        ],
        rating: 4.5,
        numReviews: 16,
        isActive: true,
        isApproved: true,
    },
];

// Seed function
const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await SHG.deleteMany({});
        await Product.deleteMany({});

        // Create users
        console.log('👤 Creating users...');
        const hashedUsers = await Promise.all(
            users.map(async (user) => ({
                ...user,
                password: await bcrypt.hash(user.password, 10),
            }))
        );
        const createdUsers = await User.insertMany(hashedUsers);
        console.log(`✅ Created ${createdUsers.length} users`);

        // Get SHG users
        const shgUsers = createdUsers.filter((user) => user.role === 'shg');

        // Create SHGs
        console.log('🏢 Creating SHGs...');
        const shgsWithUsers = shgs.map((shg, index) => ({
            ...shg,
            ownerUserId: shgUsers[index]._id,
        }));
        const createdSHGs = await SHG.insertMany(shgsWithUsers);
        console.log(`✅ Created ${createdSHGs.length} SHGs`);

        // Create products
        console.log('📦 Creating products...');
        const productsWithSHG = products.map((product, index) => ({
            ...product,
            shgId: createdSHGs[index % createdSHGs.length]._id,
        }));
        const createdProducts = await Product.insertMany(productsWithSHG);
        console.log(`✅ Created ${createdProducts.length} products`);

        console.log('\n✨ Database seeded successfully!\n');
        console.log('📋 Login Credentials:');
        console.log('━'.repeat(50));
        console.log('\n👨‍💼 Admin:');
        console.log('   Email: admin@shgmart.com');
        console.log('   Password: admin123');
        console.log('\n🏢 SHG Accounts:');
        console.log('   Email: lakshmi@shg.com | Password: shg123');
        console.log('   Email: durga@shg.com | Password: shg123');
        console.log('   Email: saraswati@shg.com | Password: shg123');
        console.log('\n👤 Customer:');
        console.log('   Email: customer@test.com | Password: customer123');
        console.log('\n' + '━'.repeat(50));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:');
        if (error.name === 'ValidationError') {
            for (let field in error.errors) {
                console.error(`  - ${field}: ${error.errors[field].message}`);
            }
        } else {
            console.error(error);
        }
        process.exit(1);
    }
};

// Run seed
seedDatabase();
