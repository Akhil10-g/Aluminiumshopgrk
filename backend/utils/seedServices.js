const Service = require('../models/Service');

const seedServices = async () => {
  try {
    const existingCount = await Service.countDocuments();

    if (existingCount > 0) {
      // eslint-disable-next-line no-console
      console.log('Services already exist; skipping seed');
      return;
    }

    const services = [
      {
        title: 'Domal Aluminium Door & Window Manufacturer',
        description: 'Expert manufacturing and installation of high-quality aluminium doors and windows with modern designs and superior durability.',
        image: '/uploads/default-service.jpg',
      },
      {
        title: 'Aluminium Fabrication Service',
        description: 'Professional aluminium fabrication services tailored to your specific requirements with precision and quality craftsmanship.',
        image: '/uploads/default-service.jpg',
      },
      {
        title: 'Aluminium Partition Services',
        description: 'Custom aluminium partitions for offices, commercial spaces, and residences to create flexible and professional environments.',
        image: '/uploads/default-service.jpg',
      },
      {
        title: 'Office Partition Service Provider',
        description: 'Modern office partition solutions designed to optimize space utilization while maintaining aesthetic appeal and functionality.',
        image: '/uploads/default-service.jpg',
      },
      {
        title: 'Glass Aluminium Work Services',
        description: 'Integrated glass and aluminium work solutions for contemporary designs, windows, partitions, and architectural elements.',
        image: '/uploads/default-service.jpg',
      },
      {
        title: 'Glazing Services',
        description: 'Professional glazing services including glass selection, installation, and finishing for windows, doors, and partitions.',
        image: '/uploads/default-service.jpg',
      },
      {
        title: 'Aluminium Window Installation Service',
        description: 'Expert installation of aluminium windows ensuring perfect fit, weather sealing, and lasting performance.',
        image: '/uploads/default-service.jpg',
      },
      {
        title: 'Aluminium Door Installation Service',
        description: 'Professional installation of aluminium doors with precision alignment and secure finishing for residential and commercial applications.',
        image: '/uploads/default-service.jpg',
      },
      {
        title: 'Aluminium Partition Fabrication Work',
        description: 'Custom fabrication of aluminium partitions with various glass options and finishes for modern spaces.',
        image: '/uploads/default-service.jpg',
      },
      {
        title: 'Aluminium Door Fabrication Work',
        description: 'Expert fabrication of aluminium doors with customizable designs, hardware, and finishing options.',
        image: '/uploads/default-service.jpg',
      },
      {
        title: 'Aluminium Window Fabrication Work',
        description: 'Precision fabrication of aluminium windows with smooth operation, proper sealing, and elegant designs.',
        image: '/uploads/default-service.jpg',
      },
      {
        title: 'Stainless Steel Works',
        description: 'High-quality stainless steel fabrication and installation for railings, fixtures, and architectural applications.',
        image: '/uploads/default-service.jpg',
      },
    ];

    await Service.insertMany(services);

    // eslint-disable-next-line no-console
    console.log(`Successfully added ${services.length} default services`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error seeding services:', error.message);
  }
};

module.exports = seedServices;
