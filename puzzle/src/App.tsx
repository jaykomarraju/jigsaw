
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, CssBaseline, ThemeProvider, createTheme, Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import '@fontsource/anton';
import { PuzzleProvider } from './contexts/PuzzleContext';
import UploadPuzzle from './pages/UploadPuzzle';
import ViewPuzzles from './pages/ViewPuzzles';
import PuzzlePage from './pages/PuzzlePage';
import OldPuzzle from './pages/OldPuzzle';

const theme = createTheme({
  typography: {
    h2: {
      fontFamily: 'Roboto, sans-serif',
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
        <Router>
          <CssBaseline />
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link className='Appname' to='/'>
                Jigsaw Pzl
                </Link>
              </Typography>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/upload">
                Upload
              </Button>
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
              <Routes>
                <Route path="/" element={<ViewPuzzles />} />
                <Route path="/upload" element={<UploadPuzzle />} />
                <Route path="/puzzle/:id" element={<PuzzlePage />} />
                <Route path="/prev" element={<OldPuzzle />} />

              </Routes>
            </Box>
          </Container>
        </Router>
      </PuzzleProvider>
    </ThemeProvider>
  );
}

export default App;