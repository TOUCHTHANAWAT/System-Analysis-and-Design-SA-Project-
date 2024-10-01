package controller

import (
	"errors"
   	"net/http"
   	"time"
   	"github.com/gin-gonic/gin"
   	"golang.org/x/crypto/bcrypt"
   	"gorm.io/gorm"
   	"example.com/project/config"
	"example.com/project/entity"
   	"example.com/project/services"
)

type (
	Authen struct {
		Email    string 
		Password string 
	}
	
	signUp struct { 
		FirstName string
		LastName  string
		GenderID uint
		Birthday  time.Time
		Address string
		JobPositionID uint
		Tel string 
		Password string
		Email string    		  
	}
)

func SignUp(c *gin.Context) {
	var payload signUp
	
	// Bind JSON payload to the struct 
	if err := c.ShouldBindJSON(&payload); err != nil { 
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db := config.DB()
	var userCheck entity.Employee
	
	// Check if the user with the provided email already exists
	result := db.Where("email = ?", payload.Email).First(&userCheck)
	
	if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		// If there's a database error other than "record not found"
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
 
 
	if userCheck.ID != 0 {
		// If the user with the provided email already exists
		c.JSON(http.StatusConflict, gin.H{"error": "Email is already registered"})
		return
	}
 
	// Hash the user's password
	hashedPassword, _ := config.HashPassword(payload.Password)
 
	// Create a new user
	user := entity.Employee{
		FirstName: payload.FirstName,
		LastName:  payload.LastName,
		GenderID:  payload.GenderID,
		Birthday:  payload.Birthday,
		Address:   payload.Address,	
		JobPositionID: payload.JobPositionID,
		Tel: payload.Tel,
		Password:  hashedPassword,
		Email:  payload.Email,
	}
 
	// Save the user to the database
	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Sign-up successful"})
}

func SignIn(c *gin.Context) {
	var payload Authen 
	var user entity.Employee

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ค้นหา user ด้วย Username ที่ผู้ใช้กรอกเข้ามา
	if err := config.DB().Raw("SELECT * FROM Employees WHERE email = ?", payload.Email).Scan(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบรหัสผ่าน
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))
 
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "password is incerrect"})
		return
	}
 
	jwtWrapper := services.JwtWrapper{
		SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		Issuer:          "AuthService",
		ExpirationHours: 24,
 
	}
 
	signedToken, err := jwtWrapper.GenerateToken(user.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token_type": "Bearer", "token": signedToken, "id": user.ID})
}
 
 
 