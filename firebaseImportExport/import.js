const firestoreService = require('firestore-export-import');
const serviceAccount = require('./serviceAccountMain.json');
 
// const dataBaseUrl = "https://bookingsystem0.firebaseio.com"; ///test
const dataBaseUrl = "https://edemdancemain.firebaseio.com"; /// main



const appName = '[DEFAULT]';
firestoreService.initializeApp(serviceAccount, dataBaseUrl, appName);
 
// Start importing your data
// The array of date, location and reference fields are optional
firestoreService.restore('backup.json',{
    dates: ['date1', 'date1.date2', 'date1.date2.date3']
  });