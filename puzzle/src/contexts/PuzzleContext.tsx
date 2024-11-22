import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface PuzzlePiece {
  id: number;
  x: number;
  y: number;
  correctX: number;
  correctY: number;
  imageUrl: string;
}

export interface PuzzleState {
  pieces: PuzzlePiece[];
  isGameStarted: boolean;
  isGameComplete: boolean;
  originalImage: string | null;
  timer: number;
}

type PuzzleAction =
  | { type: 'SET_IMAGE'; payload: string }
  | { type: 'SET_PIECES'; payload: PuzzlePiece[] }
  | { type: 'MOVE_PIECE'; payload: { id: number; x: number; y: number } }
  | { type: 'START_GAME' }
  | { type: 'COMPLETE_GAME' }
  | { type: 'UPDATE_TIMER'; payload: number }
  | { type: 'RESET_GAME' };

const initialState: PuzzleState = {
  pieces: [],
  isGameStarted: false,
  isGameComplete: false,
  originalImage: null,
  timer: 0,
};

const PuzzleContext = createContext<{
  state: PuzzleState;
  dispatch: React.Dispatch<PuzzleAction>;
} | undefined>(undefined);

function puzzleReducer(state: PuzzleState, action: PuzzleAction): PuzzleState {
  switch (action.type) {
    case 'SET_IMAGE':
      return {
        ...state,
        originalImage: action.payload,
        isGameStarted: false,
        isGameComplete: false,
      };
    case 'SET_PIECES':
      return {
        ...state,
        pieces: action.payload,
      };
    case 'MOVE_PIECE':
      return {
        ...state,
        pieces: state.pieces.map((piece) =>
          piece.id === action.payload.id
            ? { ...piece, x: action.payload.x, y: action.payload.y }
            : piece
        ),
      };
    case 'START_GAME':
      return {
        ...state,
        isGameStarted: true,
        timer: 0,
      };
    case 'COMPLETE_GAME':
      return {
        ...state,
        isGameComplete: true,
      };
    case 'UPDATE_TIMER':
      return {
        ...state,
        timer: action.payload,
      };
    case 'RESET_GAME':
      return {
        ...state,
        isGameStarted: false,
        isGameComplete: false,
        timer: 0,
      };
    default:
      return state;
  }
}

const PuzzleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(puzzleReducer, initialState);

  return (
    <PuzzleContext.Provider value={{ state, dispatch }}>
      {children}
    </PuzzleContext.Provider>
  );
};

const usePuzzle = () => {
  const context = useContext(PuzzleContext);
  if (context === undefined) {
    throw new Error('usePuzzle must be used within a PuzzleProvider');
  }
  return context;
};

export { PuzzleContext, PuzzleProvider, usePuzzle };