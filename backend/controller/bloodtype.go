package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"example.com/project/config"
	"example.com/project/entity"
)


func ListBloodTypes(c *gin.Context) {
	var bloodtype []entity.BloodType
	db := config.DB()
	db.Find(&bloodtype)
	c.JSON(http.StatusOK, &bloodtype)
}