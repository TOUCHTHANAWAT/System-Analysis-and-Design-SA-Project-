package controller
import (
	"net/http"
	"github.com/gin-gonic/gin"
	"example.com/project/config"
	"example.com/project/entity"
)
func ListPatients(c *gin.Context) {
	var patient []entity.Patient
	db := config.DB()
	db.Preload("Gender").Preload("BloodType").Find(&patient) 
	c.JSON(http.StatusOK, &patient)
}

func CreatePatient(c *gin.Context) {
	var patient entity.Patient

	// bind เข้าตัวแปร patient
	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// ค้นหา gender ด้วย id
	var gender entity.Gender
	db.First(&gender, patient.GenderID)
	if gender.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "gender not found"})
		return
	}
	var bloodType entity.BloodType
	db.First(&bloodType, patient.BloodTypeID)
	if bloodType.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "bloodType not found"})
		return
	}


	// สร้าง Patient
	u := entity.Patient{
		FirstName: patient.FirstName, // ตั้งค่าฟิลด์ FirstName
		LastName:  patient.LastName,  // ตั้งค่าฟิลด์ LastName
		Birthday:  patient.Birthday,
		Weight: patient.Weight,
		Height:	patient.Height,

		BloodTypeID:  	patient.BloodTypeID,
		BloodType: 		patient.BloodType,

		DrugAllergy: patient.DrugAllergy,
		Chronicdisease:  patient.Chronicdisease,

		GenderID:  patient.GenderID,
		Gender:    gender, // โยงความสัมพันธ์กับ Entity Gender

		Tel: patient.Tel,
	}
	
	// บันทึก
	if err := db.Create(&u).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": u})
}

// GET / patient/:id
func GetPatient(c *gin.Context) {
	ID := c.Param("id")
	var patient entity.Patient

	db := config.DB()
	results := db.Preload("Gender").Preload("BloodType").First(&patient, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if patient.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, patient)
}

func DeletePatient(c *gin.Context) {
    id := c.Param("id")
    db := config.DB()

    // ลบการนัดหมายที่เชื่อมโยงกับคนไข้ก่อน
    db.Exec("DELETE FROM schedules WHERE patient_id = ?", id)

    // ลบข้อมูลคนไข้
    if tx := db.Exec("DELETE FROM patients WHERE id = ?", id); tx.RowsAffected == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

// PATCH /patients
func UpdatePatient(c *gin.Context) {
	var patient entity.Patient

	PatientID := c.Param("id")

	db := config.DB()
	result := db.First(&patient, PatientID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&patient)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "อัพเดทข้อมูลสำเร็จ"})
}