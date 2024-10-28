const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();
const verifyToken = require('../verifyToken');

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { uid, email, firstName, lastName } = req.body;
    
        if (!uid || !email || !firstName || !lastName) {
          return res.status(400).json({ message: 'Missing required fields' });
        }
    
        const userRef = db.collection('users').doc(uid);
        await userRef.set({
          email: email,
          firstname: firstName,
          lastName: lastName,
          collections: []
        });
    
        res.status(201).json({ message: 'User registered successfully', uid });
      } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
      }
});

// Login user
router.post('/login', async (req, res) => {
    const { idToken } = req.body;

    try {
        if (!idToken) {
        return res.status(400).json({ message: 'Missing ID token' });
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        res.status(200).json({ message: 'Login successful', uid });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

//Post Collection to a user
router.post('/users/:uid/collections', verifyToken, async (req, res) => {
    try {

        const {uid} = req.params;
        const {name} = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Collection name is required' });
        }

        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({message: 'User not found'});
        }

        const newCollection = {
            flashcards: [],
        }

        await userRef.update({
            [`collections.${name}`]: newCollection,
        });

        res.status(201).json({message: 'Collection added successfully'});
    } catch (error) {
        console.error('Error creating collection:', error);
        res.status(500).json({ message: 'Error creating collection', error });
    }
});

//Add Flashcard to Collection
router.post('/users/:uid/collections/:collectionName/flashcards',verifyToken, async (req, res) => {
    try {
        const { uid, collectionName } = req.params;
        const { question, answer, hint, image } = req.body;

        if (!question || !answer) {
            return res.status(400).json({ message: 'Question and answer are required' });
        }

        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        if(!userDoc.exists){
            return res.status(404).json({message: 'User not found'});
        }

        const userData = userDoc.data();
        const collection = userData.collections[collectionName];

        if(!collection){
            return res.status(404).json({message: 'Collection not found'});
        }

        collection.flashcards.push({
            question,
            answer,
            hint: hint || null,
            image: image || null,
        });

        await userRef.update({[`collections.${collectionName}.flashcards`]: collection.flashcards,});
        res.status(200).json({ message: 'Flashcard added successfully' });

    } catch (error) {
        console.error('Error adding flashcard:', error);
        res.status(500).json({ message: 'Error adding flashcard', error });
    }
});

//Get Collections - Only name
router.get('/users/:uid/collections', verifyToken, async (req, res) => {
    try {

        const {uid} = req.params;

        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        if(!userDoc.exists){
            return res.status(404).json({message: 'User not found'});
        }

        const collections = userDoc.data().collections || {}

        const collectionNames = Object.keys(collections);

        res.status(200).json(collections);

    } catch (error) {
        console.error('Error fetching collections:', error);
        res.status(500).json({ message: 'Error fetching collections', error });
    }
});

//Get Collections by name
router.get('/users/:uid/collections/:collectionName', async (req, res) => {
    try {
        const { uid, collectionName } = req.params;

        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const collections = userDoc.data().collections;

        const collection = collections[collectionName];

        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        res.status(200).json(collection);
    } catch (error) {
        console.error('Error fetching collection:', error);
        res.status(500).json({ message: 'Error fetching collection', error });
    }
});

module.exports = router;
