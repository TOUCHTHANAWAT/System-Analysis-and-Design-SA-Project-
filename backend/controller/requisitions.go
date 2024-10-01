package controller


import (

   "net/http"

   "time"

   "fmt"

   "github.com/gin-gonic/gin"

   "example.com/project/config"
	"example.com/project/entity"

)

/*ทั้งหมด*/
func GetAllRequisitions(c *gin.Context) {
    var requisitions []entity.Requisitions

    db := config.DB()

    // Preload เฉพาะข้อมูล Equipment และ Employee ที่สัมพันธ์กัน
    results := db.Preload("Equipment").Preload("Employee").Find(&requisitions)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    // สร้าง response ที่มีเฉพาะฟิลด์ที่ต้องการ
    response := []map[string]interface{}{}

    for _, requisition := range requisitions {
        // ตรวจสอบว่าข้อมูล Equipment ถูก preload มาเรียบร้อยหรือไม่
        equipmentName := ""
        if requisition.Equipment != nil {
            equipmentName = requisition.Equipment.EquipmentName
        }

        // ตรวจสอบว่าข้อมูล Employee ถูก preload มาเรียบร้อยหรือไม่
        employeeName := ""
        if requisition.Employee != nil {
            employeeName = requisition.Employee.FirstName + " " + requisition.Employee.LastName
        } else {
            // ลอง log ข้อมูล EmployeeID และดูว่าเชื่อมโยงถูกต้องหรือไม่
            fmt.Printf("EmployeeID: %d not found in Employee table\n", requisition.EmployeeID)
        }

        // แปลงเวลาเป็นรูปแบบที่ต้องการ
        formattedTime := requisition.Time.Format("2006-01-02 15:04:05")

        // สร้าง response โดยดึงข้อมูลที่คุณต้องการออกมา
        item := map[string]interface{}{
            "ID":                 requisition.ID,
            "RequisitionQuantity": requisition.RequisitionQuantity, // จำนวนที่เบิก
            "Time":               formattedTime,                     // เวลาเบิก
            "Note":               requisition.Note,                // หมายเหตุ
            "EquipmentName":      equipmentName,                   // ชื่ออุปกรณ์
            "EmployeeName":       employeeName,                    // ชื่อพนักงาน
        }

        response = append(response, item)
    }

    // ส่งผลลัพธ์กลับในรูปแบบ JSON
    c.JSON(http.StatusOK, response)
}


/**/
func GetAllRequisitionsDate(c *gin.Context) {
    var requisitions []entity.Requisitions
    db := config.DB()

    // Get date query parameter
    date := c.Query("date")

    // Preload related data (Equipment and Employee)
    query := db.Preload("Equipment").Preload("Employee")

    if date != "" {
        // Parse the date
        parsedDate, err := time.Parse("2006-01-02", date)
        if err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
            return
        }

        // Calculate the start and end of the day
        startOfDay := parsedDate
        endOfDay := parsedDate.AddDate(0, 0, 1).Add(-time.Nanosecond) // end of the day

        // Filter requisitions by date range
        query = query.Where("time BETWEEN ? AND ?", startOfDay, endOfDay)
    }

    // Execute the query
    results := query.Find(&requisitions)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    // Create response
    response := []map[string]interface{}{}

    for _, requisition := range requisitions {
        equipmentName := ""
        if requisition.Equipment != nil {
            equipmentName = requisition.Equipment.EquipmentName
        }

        employeeName := ""
        if requisition.Employee != nil {
            employeeName = requisition.Employee.FirstName + " " + requisition.Employee.LastName
        } else {
            fmt.Printf("EmployeeID: %d not found in Employee table\n", requisition.EmployeeID)
        }

        formattedTime := requisition.Time.Format("2006-01-02 15:04:05")

        item := map[string]interface{}{
            "ID":                 requisition.ID,
            "RequisitionQuantity": requisition.RequisitionQuantity,
            "Time":               formattedTime,
            "Note":               requisition.Note,
            "EquipmentName":      equipmentName,
            "EmployeeName":       employeeName,
        }

        response = append(response, item)
    }

    c.JSON(http.StatusOK, response)
}


// RequisitionEquipment เป็นฟังก์ชันสำหรับเบิกอุปกรณ์
func RequisitionEquipment(c *gin.Context) {
    var requisition entity.Requisitions
    var equipment entity.Equipments

    // เชื่อมต่อกับฐานข้อมูล
    db := config.DB()

    // รับข้อมูล requisition จาก request body
    if err := c.ShouldBindJSON(&requisition); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
        return
    }

    // ดึงข้อมูลอุปกรณ์ตาม ID จาก requisition
    results := db.First(&equipment, requisition.EquipmentID)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบอุปกรณ์"})
        return
    }

    // ตรวจสอบว่าจำนวนที่เบิกมากกว่าจำนวนในคลังหรือไม่
    if requisition.RequisitionQuantity > equipment.Quantity {
        c.JSON(http.StatusBadRequest, gin.H{"error": "อุปกรณ์ในคลังไม่เพียงพอ"})
        return
    }

    // ลดจำนวนอุปกรณ์ในตาราง equipments
    equipment.Quantity -= requisition.RequisitionQuantity

    // บันทึกการเปลี่ยนแปลงในตาราง equipments
    if err := db.Save(&equipment).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถอัปเดตจำนวนอุปกรณ์ได้"})
        return
    }

    // บันทึกการเบิกในตาราง requisitions
    requisition.Time = time.Now() // กำหนดวันที่เบิกเป็นเวลาปัจจุบัน
    if err := db.Create(&requisition).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "เกิดข้อผิดพลาด"})
        return
    }

    // ส่งผลลัพธ์กลับ
    c.JSON(http.StatusOK, gin.H{
        "message":           "เบิกอุปกรณ์สำเร็จ",
    })
}
