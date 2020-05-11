const firestoreService = require('firestore-export-import');
const serviceAccount = require('./serviceAccountTest.json')
const fs = require('fs');
 
const dataBaseUrl = "https://bookingsystem0.firebaseio.com";
// const dataBaseUrl = "https://edemdancetest.firebaseio.com";

// Initiate Firebase App
// appName is optional, you can obmit it.
const appName = '[DEFAULT]';
firestoreService.initializeApp(serviceAccount, dataBaseUrl, appName);

// Start exporting your data
firestoreService
  .backups(['coach']) // Array of collection's name is OPTIONAL
  .then((collections) => {
    // You can do whatever you want with collections
    console.log(JSON.stringify(collections));
    fs.writeFile("backup.json", JSON.stringify(collections), function(err) {
        if (err) {
            console.log(err);
        }
    });
  });


 
