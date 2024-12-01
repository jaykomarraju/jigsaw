// internal/services/puzzle_service.go
package services

import (
	"puzzle/internal/models"
)

type PuzzleService interface {
	Create(puzzle *models.Puzzle, imageData []byte) error
	Update(id uint, puzzle *models.Puzzle) error
	Delete(id uint) error
	GetByID(id uint) (*models.Puzzle, error)
	GetByName(name string) (*models.Puzzle, error)
	GetAll() ([]models.Puzzle, error)
	UpdateBestTime(id uint, newTime int64) error
	GetBestTime(id uint) (int64, error)
}
