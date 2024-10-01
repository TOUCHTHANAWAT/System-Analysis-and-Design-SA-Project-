package controller

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"example.com/project/config"
	"example.com/project/entity"
)


func ListTstatuss(c *gin.Context) {
	var tStatus []entity.Tstatus
	db := config.DB()
	db.Find(&tStatus)
	c.JSON(http.StatusOK, &tStatus)
}

func GetTstatusByID(c *gin.Context) {
	var tStatus entity.Tstatus
	id := c.Param("id")  // รับค่า id จาก URL
	db := config.DB()
	// ค้นหาข้อมูล Tstatus ตาม ID ที่ได้รับ
	if err := db.First(&tStatus, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบสถานะนี้"})
		return
	}
	// ส่ง TstatusName กลับไปที่ response
	c.JSON(http.StatusOK, gin.H{"TstatusName": tStatus.TStatusName})
}