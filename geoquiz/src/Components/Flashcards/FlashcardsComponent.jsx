import React, { useEffect, useState } from 'react';
import "../../Styles/FlashcardsStyles/FlashcardsComponentStyles.css";
import FlashcardsContainer from './FlashcardsContainer';
import { useCollections } from '@/Contexts/CollectionsContext';

function FlashcardsComponent({ component }) {
  const { collectionDetails } = useCollections();
  const [selectedCollection, setSelectedCollection] = useState(null);

  useEffect(() => {
    if (component) {
      const collection = collectionDetails?.[component];
      setSelectedCollection(collection);
    }
  }, [component, collectionDetails]);

  const handleDeleteFlashcard = (flashcardToDelete) => {
    setSelectedCollection((prevCollection) => ({
      ...prevCollection,
      flashcards: prevCollection.flashcards.filter(
        (flashcard) => flashcard.question !== flashcardToDelete.question
      ),
    }));
  };

  return (
    <div className='flashcard-container'>
      {component === null ? (
        <p className='null-component-message'>Pick or a Create new Collection</p>
      ) : (
        <div>
          <h2 className='title'>{component}</h2>
          <div className='flashcard-list'>
            {selectedCollection?.flashcards?.map((flashcard, index) => (
              <FlashcardsContainer
                key={index}
                question={flashcard.question}
                answer={flashcard.answer}
                hint={flashcard.hint}
                collectionName={component}
                parameter="user"
                onDelete={() => handleDeleteFlashcard(flashcard)} 
              />
            ))}
            <FlashcardsContainer parameter="utility" collectionName={component} />
          </div>
        </div>
      )}
    </div>
  );
}

export default FlashcardsComponent;