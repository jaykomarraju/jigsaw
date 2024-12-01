// internal/models/puzzle.go
package models

import (
	"time"
)

type Puzzle struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Name         string    `json:"name" gorm:"unique;not null"`
	Img          string    `json:"img" gorm:"not null"`
	BestTime     int64     `json:"bestTime"` // in milliseconds
	CreatedAt    time.Time `json:"createdAt"`
	LastPlayed   time.Time `json:"lastPlayed"`
	LastBestTime time.Time `json:"lastBestTime"`
}
