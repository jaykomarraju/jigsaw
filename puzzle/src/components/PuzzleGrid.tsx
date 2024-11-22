import React, { useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import { Box, Button } from '@mui/material';
import { usePuzzle } from '../contexts/PuzzleContext';

export interface PiecePosition {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement;
}

export interface PuzzleGridProps {}

const GRID_SIZE = 4;
const CANVAS_SIZE = 600;
const PIECE_SIZE = CANVAS_SIZE / GRID_SIZE;

const PuzzleGrid: React.FC<PuzzleGridProps> = () => {
  const { state, dispatch } = usePuzzle();
  const [pieces, setPieces] = useState<PiecePosition[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);

  const createPuzzlePieces = useCallback((image: HTMLImageElement) => {
    const pieces: PiecePosition[] = [];
    const pieceWidth = image.width / GRID_SIZE;
    const pieceHeight = image.height / GRID_SIZE;

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const canvas = document.createElement('canvas');
        canvas.width = pieceWidth;
        canvas.height = pieceHeight;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(
            image,
            col * pieceWidth,
            row * pieceHeight,
            pieceWidth,
            pieceHeight,
            0,
            0,
            pieceWidth,
            pieceHeight
          );

          const pieceImage = document.createElement('img');
          pieceImage.src = canvas.toDataURL();
          
          pieces.push({
            id: row * GRID_SIZE + col,
            x: Math.random() * (CANVAS_SIZE - PIECE_SIZE),
            y: Math.random() * (CANVAS_SIZE - PIECE_SIZE),
            width: PIECE_SIZE,
            height: PIECE_SIZE,
            image: pieceImage,
          });
        }
      }
    }
    return pieces;
  }, []);

  useEffect(() => {
    if (state.originalImage) {
      const image = document.createElement('img');
      image.src = state.originalImage;
      image.onload = () => {
        const newPieces = createPuzzlePieces(image);
        setPieces(newPieces);
        dispatch({ type: 'START_GAME' });
      };
    }
  }, [state.originalImage, createPuzzlePieces, dispatch]);

  const handleDragStart = (pieceId: number) => {
    setSelectedPiece(pieceId);
  };

  const handleDragEnd = (pieceId: number, x: number, y: number) => {
    const updatedPieces = pieces.map(piece => {
      if (piece.id === pieceId) {
        // Calculate the nearest grid position
        const nearestCol = Math.round(x / PIECE_SIZE);
        const nearestRow = Math.round(y / PIECE_SIZE);
        
        // Ensure the position is within grid bounds
        const boundedCol = Math.max(0, Math.min(nearestCol, GRID_SIZE - 1));
        const boundedRow = Math.max(0, Math.min(nearestRow, GRID_SIZE - 1));
        
        // Calculate the snapped position
        const snappedX = boundedCol * PIECE_SIZE;
        const snappedY = boundedRow * PIECE_SIZE;

        return { ...piece, x: snappedX, y: snappedY };
      }
      return piece;
    });

    setPieces(updatedPieces);
    setSelectedPiece(null);

    // Check if puzzle is complete
    const isComplete = updatedPieces.every(piece => {
      const correctX = (piece.id % GRID_SIZE) * PIECE_SIZE;
      const correctY = Math.floor(piece.id / GRID_SIZE) * PIECE_SIZE;
      return piece.x === correctX && piece.y === correctY;
    });

    if (isComplete) {
      dispatch({ type: 'COMPLETE_GAME' });
    }
  };

  const shufflePieces = () => {
    const shuffled = pieces.map(piece => ({
      ...piece,
      x: Math.random() * (CANVAS_SIZE - PIECE_SIZE),
      y: Math.random() * (CANVAS_SIZE - PIECE_SIZE),
    }));
    setPieces(shuffled);
    dispatch({ type: 'START_GAME' });
  };

  if (!state.originalImage) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Button
        variant="contained"
        onClick={shufflePieces}
       
        sx={{
          mb: 2,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          padding: '12px 24px',
          backgroundColor: '#04477a',
          color: '#fff',
          border: '3px solid black',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: 500,
          textTransform: 'uppercase',
          transition: 'background-color 0.2s ease-in, transform 0.2s ease-in',
          '&:hover': {
            backgroundColor: '#0569b5',
          },
          '&:active': {
            backgroundColor: '#222',
            transform: 'scale(0.98)',
          },
        }}
      >
        Shuffle Pieces
      </Button>
      
      <Stage width={CANVAS_SIZE} height={CANVAS_SIZE}>
        <Layer>
          {pieces.map((piece) => (
            <KonvaImage
              key={piece.id}
              image={piece.image}
              x={piece.x}
              y={piece.y}
              width={piece.width}
              height={piece.height}
              draggable
              onDragStart={() => handleDragStart(piece.id)}
              onDragEnd={(e) => handleDragEnd(piece.id, e.target.x(), e.target.y())}
              opacity={selectedPiece === piece.id ? 0.8 : 1}
            />
          ))}
        </Layer>
      </Stage>
    </Box>
  );
};

export default PuzzleGrid;