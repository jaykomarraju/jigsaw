import React from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme, Box, Typography } from '@mui/material';
import './App.css';
import { PuzzleProvider } from './contexts/PuzzleContext';
import UploadImage from './components/UploadImage';
import PuzzleGrid from './components/PuzzleGrid';
import Timer from './components/Timer';

// Import Google Fonts via @fontsource
import '@fontsource/anton'; // Importing Anton font family

const theme = createTheme({
  typography: {
    h2: {
      fontFamily: 'Roboto, sans-serif', // Applying the Anton font to h2
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <PuzzleProvider>
        <CssBaseline />
        <Container maxWidth="lg">
          <Box
            sx={{
              my: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                color: 'primary.main',
                fontWeight: 'bold',
                mb: 4,
              }}
            >
              Jigsaw Puzzle
            </Typography>
            <UploadImage />
            <Timer />
            <PuzzleGrid />
          </Box>
        </Container>
      </PuzzleProvider>
    </ThemeProvider>
  );
}

export default App;
