import React, { useState } from 'react';
import "../../Styles/FlashcardsStyles/FlashcardsContainerStyles.css";
import FlashcardsForm from './FlashcardsForm';
import { motion } from 'framer-motion';
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { auth } from '@/firebase/firebase';
import { db } from '@/firebase/firebase';



function FlashcardContainer({ question, answer, hint, parameter, collectionName, onDelete }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  
  const handleFlip = () => {
    if (parameter === "user") {
      setIsFlipped(!isFlipped);
    }
  };

  // capture the user ID from the auth user
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  async function deleteFlashcard() {
    try {
      const userId = auth.currentUser ? auth.currentUser.uid : null;
      const userDoc = doc(db, "users", userId);
      await updateDoc(userDoc, {
        [`collections.${collectionName}.flashcards`]: arrayRemove({ question, answer, hint }),
      });
      console.log("Flashcard deleted successfully!");
      onDelete(); // Update the UI after  deletion
    } catch (error) {
      console.error("Error deleting flashcard: ", error);
    }
  }

  return (
    <div className='container'>
      {parameter === "user" ? (
        <>
          <motion.div
            className="flashcard-flip"
            onClick={handleFlip}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: "preserve-3d", position: "relative" }}
          >
            <motion.div
              className="flashcard-front"
              style={{
                position: 'absolute',
                width: '100%',
                backfaceVisibility: 'hidden',
                display: isFlipped ? 'none' : 'block',
              }}
            >
              <h1 className='question'>{question}</h1>
              <h2 className='hint'>{hint}</h2>
            </motion.div>

            <motion.div
              className="flashcard-back"
              style={{
                position: 'absolute',
                width: '100%',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                display: isFlipped ? 'block' : 'none',
              }}
            >
              <h1 className='answer'>{answer}</h1>
            </motion.div>
          </motion.div>
          <button onClick={() => deleteFlashcard(collectionName, { question, answer, hint })}
            style={{ color: "black" }}
            >
            Delete
          </button>
        </>
      ) : parameter === "utility" ? (
        <h2 className='flashcard-utility' onClick={openModal}>+</h2>
      ) : null}

      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='modal'>
            <FlashcardsForm collectionName={collectionName} closeModal={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default FlashcardContainer;