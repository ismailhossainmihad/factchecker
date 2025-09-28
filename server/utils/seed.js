// Seed script to populate the database with sample data
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const FactCheck = require('../models/FactCheck');

const seedData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await FactCheck.deleteMany();

    // Create a demo user
    const user = await User.create({
      username: 'demo',
      email: 'demo@example.com',
      password: 'password',
    });

    // Sample facts
    const facts = [
      {
        title: 'The Earth revolves around the Sun',
        description:
          'In the heliocentric model, the Earth orbits the Sun once every year.',
        category: 'Science',
        verdict: 'True',
        createdBy: user._id,
      },
      {
        title: 'Vaccines cause autism',
        description:
          'Extensive research shows no link between vaccines and autism. The original study making this claim has been debunked.',
        category: 'Health',
        verdict: 'False',
        createdBy: user._id,
      },
      {
        title: '5G signals spread COVID‑19',
        description:
          'There is no scientific evidence to support the idea that mobile networks spread viruses. COVID‑19 is caused by a virus called SARS‑CoV‑2.',
        category: 'Technology',
        verdict: 'False',
        createdBy: user._id,
      },
      {
        title: 'Climate change is primarily driven by human activities',
        description:
          'The majority of climate scientists agree that human activities, such as burning fossil fuels and deforestation, are the main drivers of recent climate change.',
        category: 'Science',
        verdict: 'True',
        createdBy: user._id,
      },
      {
        title: 'You should drink eight glasses of water every day',
        description:
          'Hydration needs vary between individuals and depend on factors like activity level, climate and diet. Eight glasses is a general guideline but not a strict requirement.',
        category: 'Health',
        verdict: 'Misleading',
        createdBy: user._id,
      },
      {
        title: 'Mars is home to a secret alien base',
        description:
          'There is currently no evidence of any life, let alone an alien base, on Mars. Exploration continues to search for signs of past microbial life.',
        category: 'Science',
        verdict: 'Unverified',
        createdBy: user._id,
      },
      {
        title: 'Eating carrots improves your night vision',
        description:
          'Carrots are rich in vitamin A, which is important for eye health, but eating them will not dramatically improve night vision.',
        category: 'Health',
        verdict: 'Misleading',
        createdBy: user._id,
      },
      {
        title: 'The Great Wall of China is visible from space',
        description:
          'While large, the Great Wall is generally not visible to the naked eye from space. Astronauts have reported that it is very difficult to see without aid.',
        category: 'Science',
        verdict: 'False',
        createdBy: user._id,
      },
      {
        title: 'Lightning never strikes the same place twice',
        description:
          'Lightning often strikes tall objects multiple times. Landmarks like the Empire State Building are hit dozens of times each year.',
        category: 'Science',
        verdict: 'False',
        createdBy: user._id,
      },
      {
        title: 'Humans only use 10% of their brains',
        description:
          'Neuroimaging and research show that all parts of the brain have functions, and there is no evidence that we use only a small portion.',
        category: 'Science',
        verdict: 'False',
        createdBy: user._id,
      },
    ];

    await FactCheck.insertMany(facts);
    console.log('Database seeded successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();