// internal/api/handlers/puzzle_handler.go
package handlers

import (
	"io"
	"net/http"
	"strconv"

	"puzzle/internal/models"
	"puzzle/internal/services"

	"github.com/gin-gonic/gin"
)

type PuzzleHandler struct {
	puzzleService services.PuzzleService
}

func NewPuzzleHandler(ps services.PuzzleService) *PuzzleHandler {
	return &PuzzleHandler{puzzleService: ps}
}

func (h *PuzzleHandler) Create(c *gin.Context) {
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No image provided"})
		return
	}

	// Read image data
	f, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read image"})
		return
	}
	defer f.Close()

	imageData, err := io.ReadAll(f)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read image data"})
		return
	}

	puzzle := &models.Puzzle{
		Name: c.PostForm("name"),
		Img:  file.Filename,
	}

	if err := h.puzzleService.Create(puzzle, imageData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, puzzle)
}

func (h *PuzzleHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var puzzle models.Puzzle
	if err := c.ShouldBindJSON(&puzzle); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.puzzleService.Update(uint(id), &puzzle); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, puzzle)
}

func (h *PuzzleHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := h.puzzleService.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *PuzzleHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	puzzle, err := h.puzzleService.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Puzzle not found"})
		return
	}

	c.JSON(http.StatusOK, puzzle)
}

func (h *PuzzleHandler) GetByName(c *gin.Context) {
	name := c.Param("name")
	puzzle, err := h.puzzleService.GetByName(name)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Puzzle not found"})
		return
	}

	c.JSON(http.StatusOK, puzzle)
}

func (h *PuzzleHandler) GetAll(c *gin.Context) {
	puzzles, err := h.puzzleService.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, puzzles)
}

func (h *PuzzleHandler) UpdateBestTime(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var body struct {
		Time int64 `json:"time"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.puzzleService.UpdateBestTime(uint(id), body.Time); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusOK)
}

func (h *PuzzleHandler) GetBestTime(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	bestTime, err := h.puzzleService.GetBestTime(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Puzzle not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"bestTime": bestTime})
}
