package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"example.com/project/config"
	"example.com/project/entity"
)

func ListJobPositions(c *gin.Context) {
	var jobPositions []entity.JobPosition
	db := config.DB()
	db.Find(&jobPositions)
	c.JSON(http.StatusOK, &jobPositions)
}