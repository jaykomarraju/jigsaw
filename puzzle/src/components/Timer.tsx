import React, { useEffect, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { usePuzzle } from '../contexts/PuzzleContext';

export interface TimerProps { }

const StyledTimer = styled('div')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 24px',
  borderRadius: '12px', // Rounded corners
  backgroundColor: "white", // Dark background
  color: "black", // White text
  fontFamily: 'monospace',
  fontWeight: 'bold',
  fontSize: '1.5rem',
  border: '3px solid black', // Black border
  transition: 'background-color 0.2s ease-in, transform 0.2s ease-in',
  // cursor: 'pointer',
  // '&:hover': {
  //   backgroundColor: theme.palette.grey[800], // Slightly lighter on hover
  // },
  // '&:active': {
  //   backgroundColor: theme.palette.grey[700], // Darker when pressed
  //   transform: 'scale(0.98)', // "Pressed in" effect
  // },
}));

const Timer: React.FC<TimerProps> = () => {
  const { state, dispatch } = usePuzzle();
  const { isGameStarted, isGameComplete, timer } = state;

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const updateTimer = useCallback(() => {
    if (isGameStarted && !isGameComplete) {
      dispatch({ type: 'UPDATE_TIMER', payload: timer + 1 });
    }
  }, [isGameStarted, isGameComplete, timer, dispatch]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isGameStarted && !isGameComplete) {
      intervalId = setInterval(updateTimer, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isGameStarted, isGameComplete, updateTimer]);

  return (
    <Box sx={{ my: 2, textAlign: 'center' }}>
      <StyledTimer>
        {formatTime(timer)}
      </StyledTimer>

      {isGameComplete && (
        <Typography
          variant="h6"
          color="success.main"
          sx={{
            mt: 1,

            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            padding: '12px 36px',
          }}
        >
          Puzzle Completed! 🎉
        </Typography>
      )}
    </Box>
  );
};

export default Timer;
