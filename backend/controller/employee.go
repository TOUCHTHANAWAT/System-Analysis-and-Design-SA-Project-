package controller

import (
	"net/http"

	// "strings"

	"github.com/gin-gonic/gin"
	"example.com/project/config"
	"example.com/project/entity"
)

// POST /employees
func CreateEmployee(c *gin.Context) {
	var employee entity.Employee

	// bind เข้าตัวแปร employee
	if err := c.ShouldBindJSON(&employee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// ค้นหา gender ด้วย id
	var gender entity.Gender
	db.First(&gender, employee.GenderID)
	if gender.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "gender not found"})
		return
	}

	// ค้นหา jobposition ด้วย id
	var jobPosition entity.JobPosition
	db.First(&jobPosition, employee.JobPositionID)
	if jobPosition.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "jobPosition not found"})
		return
	}

	// เข้ารหัสลับรหัสผ่านที่ผู้ใช้กรอกก่อนบันทึกลงฐานข้อมูล
	hashedPassword, _ := config.HashPassword(employee.Password)

	// สร้าง Employee
	u := entity.Employee{
		FirstName: employee.FirstName, // ตั้งค่าฟิลด์ FirstName
		LastName:  employee.LastName,  // ตั้งค่าฟิลด์ LastName
		Email:     employee.Email,     // ตั้งค่าฟิลด์ Email
		Password:  hashedPassword,
		Birthday:  employee.Birthday,
		GenderID:  employee.GenderID,
		Gender:    gender, // โยงความสัมพันธ์กับ Entity Gender
		JobPositionID: employee.JobPositionID,
		JobPosition: jobPosition,//โยงความสัมพันธ์กับ Entity JobPosition
		Tel: employee.Tel,
		Address: employee.Address,
	}

	// บันทึก
	if err := db.Create(&u).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": u})
}

// GET /employee/:id
func GetEmployee(c *gin.Context) {
	ID := c.Param("id")
	var employee entity.Employee

	db := config.DB()
	results := db.Preload("Gender").Preload("JobPosition").First(&employee, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if employee.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, employee)
}

// GET /employees
func ListEmployees(c *gin.Context) {

	var employees []entity.Employee

	db := config.DB()
	results := db.Preload("Gender").Preload("JobPosition").Find(&employees)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, employees)
}

func EmployeesLogin(c *gin.Context) {
	// ดึง user จาก context ที่ middleware ส่งมา
	userEmail, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// ค้นหาพนักงานที่มี email ตรงกับที่ดึงจาก token
	var employee entity.Employee
	db := config.DB()
	if err := db.Where("email = ?", userEmail).First(&employee).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"employee": employee})
}



// DELETE /employees/:id
func DeleteEmployee(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM employees WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})

}

// PATCH /employees
func UpdateEmployee(c *gin.Context) {
	var employee entity.Employee

	EmployeeID := c.Param("id")

	db := config.DB()
	result := db.First(&employee, EmployeeID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&employee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&employee)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}
	// if err := db.Save(&employee).Error; err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }
	c.JSON(http.StatusOK, gin.H{"message": "อัพเดทข้อมูลสำเร็จ"})
}