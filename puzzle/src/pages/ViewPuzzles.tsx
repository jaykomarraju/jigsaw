import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';

interface Puzzle {
  id: number;
  name: string;
  img: string;
  bestTime: number;
}

const ViewPuzzles = () => {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);

  useEffect(() => {
    const fetchPuzzles = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/puzzles/');
        const data = await response.json();
        setPuzzles(data);
      } catch (err) {
        console.error('Failed to fetch puzzles:', err);
      }
    };

    fetchPuzzles();
  }, []);

  return (
    <Grid container spacing={3}>
      {puzzles.map((puzzle) => (
        <Grid item xs={12} sm={6} md={4} key={puzzle.id}>
          <Card component={Link} to={`/puzzle/${puzzle.id}`}>
            <CardMedia
              component="img"
              height="200"
              image={`http://localhost:8080/uploads/${puzzle.img}`}
              alt={puzzle.name}
            />
            <CardContent>
              <Typography variant="h6">{puzzle.name}</Typography>
              {puzzle.bestTime > 0 && (
                <Typography variant="body2">
                  Best Time
                   {/* {formatTime(puzzle.bestTime)} */}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ViewPuzzles;