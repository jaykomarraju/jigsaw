package api

import (
	"puzzle/internal/api/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, ph *handlers.PuzzleHandler) {
	api := r.Group("/api")
	{
		puzzles := api.Group("/puzzles")
		{
			puzzles.POST("/", ph.Create)
			puzzles.PUT("/:id", ph.Update)
			puzzles.DELETE("/:id", ph.Delete)
			puzzles.GET("/:id", ph.GetByID)
			puzzles.GET("/name/:name", ph.GetByName)
			puzzles.GET("/", ph.GetAll)
			puzzles.PUT("/:id/best-time", ph.UpdateBestTime)
			puzzles.GET("/:id/best-time", ph.GetBestTime)
		}
	}
}
