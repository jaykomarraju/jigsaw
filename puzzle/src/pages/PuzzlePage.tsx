import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import PuzzleGrid from '../components/PuzzleGrid';
import Timer from '../components/Timer';
import PuzzleGridImpl from '../components/PuzzleGridImpl';

interface PuzzleData {
  id: number;
  name: string;
  img: string;
  bestTime: number;
}

const PuzzlePage = () => {
  const { id } = useParams<{ id: string }>();
  const [puzzleData, setPuzzleData] = useState<PuzzleData | null>(null);

  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/puzzles/${id}`);
        const data = await response.json();
        setPuzzleData(data);
      } catch (err) {
        console.error('Failed to fetch puzzle:', err);
      }
    };

    if (id) {
      fetchPuzzle();
    }
  }, [id]);

  if (!puzzleData) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Timer />
      {/* <PuzzleGrid 
        imageUrl={`http://localhost:8080/uploads/${puzzleData.img}`}
        puzzleId={Number(id)}
      /> */}
      {/* <img src={`http://localhost:8080/uploads/${puzzleData.img}`}/> */}
      <PuzzleGridImpl imageSrc={`http://localhost:8080/uploads/${puzzleData.img}`}/>
    </Box>
  );
};

export default PuzzlePage;