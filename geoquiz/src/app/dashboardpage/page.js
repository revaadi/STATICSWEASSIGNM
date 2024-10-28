"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/Components/Header/HeaderComponent';
import { AuthProvider } from '@/Contexts/AuthContext';
import { ScoresProvider, useScores } from '@/Contexts/ScoresContext';
import "../../Styles/DashboardStyles/DashboardPageStyles.css";

function DashboardContent() {
  const [name, setName] = useState("Kenet");
  const { scores } = useScores();

  useEffect(() => {
    console.log('Fetched scores:', scores);
  }, [scores]);

  return (
    <div className='page-container'>
      <h1 className='title'>Hi {name}</h1>
      <div className='two-sides-container'>
        <div className='left-side'>
          <div className='container'>
            <h2>Your Scores</h2>
            {scores && scores.length > 0 ? (
              <ul>
                {scores.map((score, index) => (
                  <li key={index}>
                    {score.date}: {score.currentScore}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No scores available</p>
            )}
          </div>
        </div>
        <div className='right-side'>
          <div className='container'>
            {'Graph'}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <AuthProvider>
      <ScoresProvider>
        <Header />
        <DashboardContent />
      </ScoresProvider>
    </AuthProvider>
  );
}

export default DashboardPage;