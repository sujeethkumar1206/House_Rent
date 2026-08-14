const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');

const seedAuto = async () => {
  try {
    // Ensure default Admin Account exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@houserent.com';
    const adminPass = process.env.ADMIN_PASSWORD || 'Admin@12345';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        fullname: 'Site Administrator',
        email: adminEmail,
        password: adminPass,
        role: 'Admin'
      });
      console.log('Auto-seeded default admin account:', adminEmail);
    } else if (admin.role !== 'Admin') {
      admin.role = 'Admin';
      await admin.save();
    }

    const sampleUsers = [
      { fullname: 'Rajesh Sharma', email: 'rajesh.sharma@example.com', password: 'Password@123', phone: '9876543210', address: 'Bandra West, Mumbai' },
      { fullname: 'Priya Patel', email: 'priya.patel@example.com', password: 'Password@123', phone: '9812345678', address: 'Koramangala, Bangalore' },
      { fullname: 'Vikram Malhotra', email: 'vikram.m@example.com', password: 'Password@123', phone: '9765432109', address: 'Vasant Kunj, New Delhi' },
      { fullname: 'Ananya Sen', email: 'ananya.sen@example.com', password: 'Password@123', phone: '9654321098', address: 'Kalyani Nagar, Pune' },
      { fullname: 'Rahul Verma', email: 'rahul.v@example.com', password: 'Password@123', phone: '9543210987', address: 'Banjara Hills, Hyderabad' },
      { fullname: 'Sneha Kapoor', email: 'sneha.k@example.com', password: 'Password@123', phone: '9432109876', address: 'Calangute, Goa' }
    ];

    const createdUsers = [];
    for (const u of sampleUsers) {
      let existing = await User.findOne({ email: u.email });
      if (!existing) {
        existing = await User.create(u);
      }
      createdUsers.push(existing);
    }

    const propertiesData = [
      {
        title: 'Luxury 3BHK Sea Facing Apartment in Bandra',
        description: 'Spacious 3BHK apartment with modern interiors, full sea view, modular kitchen, and 24/7 security.',
        price: 85000,
        location: 'Carter Road, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        propertyType: 'Apartment',
        bedrooms: 3,
        bathrooms: 3,
        parking: true,
        furnishing: 'Furnished',
        area: 1850,
        amenities: ['Sea View', 'Gym', 'Swimming Pool', 'Elevator', 'Security', 'Power Backup'],
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'],
        owner: createdUsers[0]._id,
        status: 'Approved'
      },
      {
        title: 'Charming 2BHK Flat near Tech Park',
        description: 'Fully furnished 2BHK flat close to IT parks, Metro station, and shopping malls. Ideal for working professionals.',
        price: 32000,
        location: 'Koramangala 5th Block',
        city: 'Bangalore',
        state: 'Karnataka',
        propertyType: 'Apartment',
        bedrooms: 2,
        bathrooms: 2,
        parking: true,
        furnishing: 'Furnished',
        area: 1200,
        amenities: ['WiFi', 'Power Backup', 'Security', 'Balcony', 'Clubhouse'],
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
        owner: createdUsers[1]._id,
        status: 'Approved'
      },
      {
        title: 'Modern Independent Villa with Garden',
        description: 'Exclusive 4BHK villa featuring a private lawn, covered parking, solar water heating, and modern architecture.',
        price: 120000,
        location: 'Vasant Kunj Sector C',
        city: 'New Delhi',
        state: 'Delhi',
        propertyType: 'Villa',
        bedrooms: 4,
        bathrooms: 4,
        parking: true,
        furnishing: 'Semi-Furnished',
        area: 3200,
        amenities: ['Private Garden', 'Security System', 'Garage', 'Terrace', 'Servant Quarter'],
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
        owner: createdUsers[2]._id,
        status: 'Approved'
      },
      {
        title: 'Cozy 1BHK Studio Apartment',
        description: 'Compact and elegant studio apartment for students or young professionals with high-speed internet and kitchen essentials.',
        price: 18000,
        location: 'Kalyani Nagar',
        city: 'Pune',
        state: 'Maharashtra',
        propertyType: 'Studio',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnishing: 'Furnished',
        area: 550,
        amenities: ['WiFi', 'Air Conditioning', 'Washing Machine', 'Security'],
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
        owner: createdUsers[3]._id,
        status: 'Approved'
      },
      {
        title: 'Premium 3BHK Penthouse in Gated Community',
        description: 'Top floor penthouse with panoramic city view, private jacuzzi, Italian marble flooring, and smart home automation.',
        price: 95000,
        location: 'Banjara Hills Road No. 12',
        city: 'Hyderabad',
        state: 'Telangana',
        propertyType: 'Apartment',
        bedrooms: 3,
        bathrooms: 4,
        parking: true,
        furnishing: 'Furnished',
        area: 2400,
        amenities: ['Jacuzzi', 'Smart Automation', 'Gym', 'Swimming Pool', 'Security'],
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'],
        owner: createdUsers[4]._id,
        status: 'Approved'
      },
      {
        title: 'Beachside 2BHK Portuguese Style Villa',
        description: 'Beautiful beach holiday villa just 5 minutes walk from Calangute beach. Lush greenery, open patio, and quiet neighborhood.',
        price: 65000,
        location: 'Calangute Beach Road',
        city: 'Goa',
        state: 'Goa',
        propertyType: 'Independent House',
        bedrooms: 2,
        bathrooms: 2,
        parking: true,
        furnishing: 'Furnished',
        area: 1600,
        amenities: ['Garden', 'Patio', 'WiFi', 'Air Conditioning', 'Power Backup'],
        images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'],
        owner: createdUsers[5]._id,
        status: 'Approved'
      },
      {
        title: 'Modern 3BHK Apartment in OMR Tech Corridor',
        description: 'Spacious and breezy 3BHK flat located in the heart of Chennai IT hub. Gated community with clubhouse, gym, and pool.',
        price: 35000,
        location: 'Old Mahabalipuram Road (OMR), Perungudi',
        city: 'Chennai',
        state: 'Tamil Nadu',
        propertyType: 'Apartment',
        bedrooms: 3,
        bathrooms: 3,
        parking: true,
        furnishing: 'Furnished',
        area: 1650,
        amenities: ['Gym', 'Swimming Pool', 'Security', 'Power Backup', 'Clubhouse'],
        images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'],
        owner: createdUsers[0]._id,
        status: 'Approved'
      },
      {
        title: 'Luxury 2BHK Gated Flat in Anna Nagar',
        description: 'Prime location 2BHK flat in Anna Nagar with teak wood interiors, covered car parking, and metro connectivity.',
        price: 28000,
        location: 'Anna Nagar West',
        city: 'Chennai',
        state: 'Tamil Nadu',
        propertyType: 'Apartment',
        bedrooms: 2,
        bathrooms: 2,
        parking: true,
        furnishing: 'Semi-Furnished',
        area: 1250,
        amenities: ['WiFi', 'Elevator', 'Security', 'Balcony', 'Power Backup'],
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
        owner: createdUsers[1]._id,
        status: 'Approved'
      },
      {
        title: 'Spacious Independent House in Race Course',
        description: 'Serene 3BHK villa with green surroundings, modular kitchen, solar water heater, and spacious garden.',
        price: 40000,
        location: 'Race Course Road',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        propertyType: 'Villa',
        bedrooms: 3,
        bathrooms: 3,
        parking: true,
        furnishing: 'Furnished',
        area: 2200,
        amenities: ['Garden', 'Solar Water', 'Security', 'Garage', 'Terrace'],
        images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'],
        owner: createdUsers[2]._id,
        status: 'Approved'
      }
    ];

    for (const p of propertiesData) {
      const existing = await Property.findOne({ title: p.title });
      if (!existing) {
        await Property.create(p);
      }
    }
    console.log('Auto-seeded initial properties successfully.');
  } catch (err) {
    console.error('Auto-seed error:', err);
  }
};

module.exports = seedAuto;
