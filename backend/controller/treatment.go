package controller
import (
	"net/http"
	"github.com/gin-gonic/gin"
	"example.com/project/config"
	"example.com/project/entity"
)

func ListTreatment(c *gin.Context) {
	var treatment []entity.Treatment
	db := config.DB()
	db.Find(&treatment)
	c.JSON(http.StatusOK, &treatment)
}