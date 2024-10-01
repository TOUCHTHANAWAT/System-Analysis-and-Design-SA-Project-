package controller

// import (
// 	"net/http"
// 	"time"

// 	"github.com/TOUCHTHANAWAT/sa-project/config"
// 	"github.com/TOUCHTHANAWAT/sa-project/entity"
// 	//"github.com/tanapon395/sa-67-example/config"
// 	//"github.com/tanapon395/sa-67-example/entity"
// 	"github.com/gin-gonic/gin"
// )

// package controllers

import (
    "net/http"
    "time"
	"example.com/project/config"
	"example.com/project/entity"
    // "sa-project/models" // Import your models
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

// Struct สำหรับรับข้อมูลการชำระเงินจากฝั่ง frontend
type CreatePaymentInput struct {
   // Date           time.Time `json:"date" binding:"required"`
    PaymentMethodID uint     `json:"PaymentMethodID" binding:"required"`
    EmployeeID      uint     `json:"EmployeeID" binding:"required"`
    // Fees            float32  `json:"fees" binding:"required"`
}

// ฟังก์ชันสำหรับสร้างการชำระเงินใหม่
func CreatePayment(c *gin.Context) {
    var input CreatePaymentInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
	db := config.DB()
    // สร้างข้อมูลการชำระเงินใหม่
    payment := entity.Payment{
        Date:time.Now(),
        PaymentMethodID: input.PaymentMethodID,
        EmployeeID:  input.EmployeeID,
        // CreatedAt:       time.Now(),
        // Fees:            input.Fees,
    }

    // บันทึกลงฐานข้อมูล
    if err := db.Create(&payment).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // ส่งผลลัพธ์กลับไปยัง frontend
    c.JSON(http.StatusOK, gin.H{"id": payment.ID})
}

type UpdateDentalRecordPaymentInput struct {
    PaymentID uint `json:"paymentid" binding:"required"`
}

// ฟังก์ชันสำหรับอัปเดต PaymentID ใน DentalRecord
func UpdateDentalRecordPayment(c *gin.Context) {
    var input UpdateDentalRecordPaymentInput
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ดึง ID ของ DentalRecord จากพารามิเตอร์ URL
    dentalRecordID := c.Param("id")

    var dentalRecord entity.DentalRecord
	db := config.DB()
    // ค้นหา DentalRecord ที่ต้องการอัปเดต
    if err := db.Where("id = ?", dentalRecordID).First(&dentalRecord).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "Dental record not found"})
            return
        }
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // อัปเดต PaymentID ใน DentalRecord
    // if dentalRecord.NumberOfInstallment != "0/0"{
    //     dentalRecord
    // }
  
    dentalRecord.PaymentID = &input.PaymentID
	dentalRecord.StatusID = 1

    // บันทึกการเปลี่ยนแปลงลงในฐานข้อมูล
    if err := db.Save(&dentalRecord).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // ส่งผลลัพธ์กลับไปยัง frontend
    c.JSON(http.StatusOK, gin.H{"message": "Payment updated successfully"})
}

// func CreatePayment(c *gin.Context) {

// 	var newPayment entity.Payment

// 	// Bind the JSON request body to the newRecord variable
// 	if err := c.ShouldBindJSON(&newPayment); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
// 		return
// 	}
// 	newPayment.Date = time.Now()

// 	// Connect to the database
// 	db := config.DB()

// 	// Save the new record to the database
// 	result := db.Create(&newPayment)

// 	// Error handling
// 	if result.Error != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error.Error()})
// 		return
// 	}

// 	// Return success response
// 	c.JSON(http.StatusCreated, gin.H{"message": "Record created successfully", "data": newPayment})
// }