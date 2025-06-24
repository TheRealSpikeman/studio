// src/components/tools/ConcentrationGames.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Timer, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

// Game state
type GameState = 'start' | 'playing' | 'gameOver';

const emojis = ['😀', '🎉', '🚀', '🌟', '🍕', '🐱', '🐶', '👍'];
const oddOneOutEmoji = '🧐';

const generateLevel = (level: number) => {
  const gridSize = Math.min(8, 2 + level); // Grid size from 2x2 up to 8x8
  const totalItems = gridSize * gridSize;
  const oddOneOutIndex = Math.floor(Math.random() * totalItems);
  const regularEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  const items = Array(totalItems).fill(regularEmoji);
  items[oddOneOutIndex] = oddOneOutEmoji;

  return {
    gridSize,
    items,
    correctIndex: oddOneOutIndex,
  };
};

export function ConcentrationGames() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [currentLevelData, setCurrentLevelData] = useState(generateLevel(1));
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startNextLevel = useCallback(() => {
    setLevel(prev => prev + 1);
    const newLevelData = generateLevel(level + 1);
    setCurrentLevelData(newLevelData);
    setTimeLeft(Math.max(3, 10 - Math.floor((level + 1) / 2))); // Time decreases as level increases
    setGameState('playing');
  }, [level]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      setGameState('gameOver');
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, timeLeft]);

  const handleItemClick = (index: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (index === currentLevelData.correctIndex) {
      setScore(prev => prev + 10 * level);
      startNextLevel();
    } else {
      setGameState('gameOver');
    }
  };

  const handleStartGame = () => {
    setLevel(1);
    setScore(0);
    const firstLevelData = generateLevel(1);
    setCurrentLevelData(firstLevelData);
    setTimeLeft(10);
    setGameState('playing');
  };

  const renderGameContent = () => {
    switch (gameState) {
      case 'start':
        return (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Concentratie Games</h3>
            <p className="text-muted-foreground mb-4">Vind de afwijkende emoji voordat de tijd om is!</p>
            <Button onClick={handleStartGame}>Start Spel</Button>
          </div>
        );
      case 'playing':
        return (
          <div className="w-full">
            <div className="flex justify-between items-center mb-4 text-sm md:text-base">
              <div>Score: <span className="font-bold">{score}</span></div>
              <div>Level: <span className="font-bold">{level}</span></div>
              <div className="flex items-center"><Timer className="mr-1 h-5 w-5"/> <span className="font-bold">{timeLeft}s</span></div>
            </div>
            <div
              className="grid gap-1 sm:gap-2 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${currentLevelData.gridSize}, 1fr)`,
                width: `calc(${currentLevelData.gridSize} * 2.5rem)`, // Adjust size based on grid
                maxWidth: '100%',
              }}
            >
              {currentLevelData.items.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleItemClick(index)}
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-2xl rounded-md bg-muted hover:bg-primary/20 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        );
      case 'gameOver':
        return (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2 text-destructive">Game Over!</h3>
            <p className="text-muted-foreground mb-4">Je hebt een score van <span className="font-bold text-primary">{score}</span> behaald en level <span className="font-bold text-primary">{level}</span> bereikt!</p>
            <Button onClick={handleStartGame}>Opnieuw Spelen</Button>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad2 className="h-6 w-6 text-primary" />
          Concentratie Game
        </CardTitle>
        <CardDescription>Train je focus en reactiesnelheid.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center min-h-[250px] sm:min-h-[300px]">
        {renderGameContent()}
      </CardContent>
    </Card>
  );
}
