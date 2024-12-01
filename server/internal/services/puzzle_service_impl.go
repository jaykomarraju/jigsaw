// internal/services/puzzle_service_impl.go
package services

import (
	"bytes"
	"errors"
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"os"
	"path/filepath"
	"time"

	"puzzle/internal/models"

	"gorm.io/gorm"
)

type puzzleService struct {
	db *gorm.DB
}

func NewPuzzleService(db *gorm.DB) PuzzleService {
	return &puzzleService{db: db}
}

func (s *puzzleService) Create(puzzle *models.Puzzle, imageData []byte) error {
	// Validate image is square
	img, _, err := image.Decode(bytes.NewReader(imageData))
	if err != nil {
		return fmt.Errorf("failed to decode image: %w", err)
	}

	bounds := img.Bounds()
	if bounds.Dx() != bounds.Dy() {
		return errors.New("image must be square")
	}

	// Save image
	fileName := fmt.Sprintf("%d_%s%s", time.Now().Unix(), puzzle.Name, filepath.Ext(puzzle.Img))
	filePath := filepath.Join("uploads", fileName)

	if err := os.MkdirAll("uploads", 0755); err != nil {
		return fmt.Errorf("failed to create uploads directory: %w", err)
	}

	if err := os.WriteFile(filePath, imageData, 0644); err != nil {
		return fmt.Errorf("failed to save image: %w", err)
	}

	puzzle.Img = fileName
	puzzle.CreatedAt = time.Now()
	puzzle.LastPlayed = time.Now()

	return s.db.Create(puzzle).Error
}

func (s *puzzleService) Update(id uint, puzzle *models.Puzzle) error {
	existing := &models.Puzzle{}
	if err := s.db.First(existing, id).Error; err != nil {
		return err
	}

	// Prevent updating immutable fields
	puzzle.CreatedAt = existing.CreatedAt
	puzzle.Img = existing.Img

	return s.db.Model(&models.Puzzle{ID: id}).Updates(puzzle).Error
}

func (s *puzzleService) Delete(id uint) error {
	puzzle := &models.Puzzle{}
	if err := s.db.First(puzzle, id).Error; err != nil {
		return err
	}

	// Delete image file
	if err := os.Remove(filepath.Join("uploads", puzzle.Img)); err != nil {
		return fmt.Errorf("failed to delete image file: %w", err)
	}

	return s.db.Delete(&models.Puzzle{}, id).Error
}

func (s *puzzleService) GetByID(id uint) (*models.Puzzle, error) {
	puzzle := &models.Puzzle{}
	if err := s.db.First(puzzle, id).Error; err != nil {
		return nil, err
	}
	return puzzle, nil
}

func (s *puzzleService) GetByName(name string) (*models.Puzzle, error) {
	puzzle := &models.Puzzle{}
	if err := s.db.Where("name = ?", name).First(puzzle).Error; err != nil {
		return nil, err
	}
	return puzzle, nil
}

func (s *puzzleService) GetAll() ([]models.Puzzle, error) {
	var puzzles []models.Puzzle
	if err := s.db.Find(&puzzles).Error; err != nil {
		return nil, err
	}
	return puzzles, nil
}

func (s *puzzleService) UpdateBestTime(id uint, newTime int64) error {
	puzzle := &models.Puzzle{}
	if err := s.db.First(puzzle, id).Error; err != nil {
		return err
	}

	if puzzle.BestTime == 0 || newTime < puzzle.BestTime {
		puzzle.BestTime = newTime
		puzzle.LastBestTime = time.Now()
	}
	puzzle.LastPlayed = time.Now()

	return s.db.Save(puzzle).Error
}

func (s *puzzleService) GetBestTime(id uint) (int64, error) {
	puzzle := &models.Puzzle{}
	if err := s.db.First(puzzle, id).Error; err != nil {
		return 0, err
	}
	return puzzle.BestTime, nil
}
