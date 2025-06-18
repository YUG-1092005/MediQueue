const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect(process.env.VITE_MONGO_URL) 

  .then(async () => {
    const result = await mongoose.connection.db.collection('clinics').dropIndex('clinicID_1');
    console.log('Index dropped:', result);
    process.exit();
  })
  .catch((err) => {
    console.error('Error dropping index:', err);
    process.exit(1);
  });
