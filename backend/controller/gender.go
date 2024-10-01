package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"example.com/project/config"
	"example.com/project/entity"
)


func ListGenders(c *gin.Context) {
	var gender []entity.Gender
	db := config.DB()
	db.Find(&gender)
	c.JSON(http.StatusOK, &gender)
}

func GetAll(c *gin.Context) {
	db := config.DB()
	var genders []entity.Gender
	db.Find(&genders)
	c.JSON(http.StatusOK, &genders)
 }