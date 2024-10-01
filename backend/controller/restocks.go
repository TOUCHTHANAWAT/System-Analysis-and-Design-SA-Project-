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
func GetAllRestocks(c *gin.Context) {
    var restocks []entity.Restocks

    db := config.DB()

    // Preload เฉพาะข้อมูล Equipment และ Employee ที่สัมพันธ์กัน
    results := db.Preload("Equipment").Preload("Employee").Find(&restocks)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    // สร้าง response ที่มีเฉพาะฟิลด์ที่ต้องการ
    response := []map[string]interface{}{}

    for _, restock := range restocks {
        // ตรวจสอบว่าข้อมูล Equipment ถูก preload มาเรียบร้อยหรือไม่
        equipmentName := ""
        if restock.Equipment != nil {
            equipmentName = restock.Equipment.EquipmentName
        }

        // ตรวจสอบว่าข้อมูล Employee ถูก preload มาเรียบร้อยหรือไม่
        employeeName := ""
        if restock.Employee != nil {
            employeeName = restock.Employee.FirstName + " " + restock.Employee.LastName
        } else {
            // ลอง log ข้อมูล EmployeeID และดูว่าเชื่อมโยงถูกต้องหรือไม่
            fmt.Printf("EmployeeID: %d not found in Employee table\n", restock.EmployeeID)
        }


		// แปลงเวลาเป็นรูปแบบที่ต้องการ
        formattedTime := restock.ReceivingDate.Format("2006-01-02 15:04:05")

        // สร้าง response โดยดึงข้อมูลที่คุณต้องการออกมา
        item := map[string]interface{}{
            "ID":                 restock.ID,
            "RestockQuantity":    restock.RestockQuantity,         // จำนวนที่เติม
            "ReceivingDate":      formattedTime, 		           // เวลาเติม
            "EquipmentName":      equipmentName,                   // ชื่ออุปกรณ์
            "EmployeeName":       employeeName,                    // ชื่อพนักงาน
        }

        response = append(response, item)
    }

    // ส่งผลลัพธ์กลับในรูปแบบ JSON
    c.JSON(http.StatusOK, response)
}

/**/
func GetAllRestocksDate(c *gin.Context) {
    var restocks []entity.Restocks
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
        query = query.Where("receiving_date BETWEEN ? AND ?", startOfDay, endOfDay)
    }

    // Execute the query
    results := query.Find(&restocks)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    // Create response
    response := []map[string]interface{}{}

    for _, restock := range restocks {
        equipmentName := ""
        if restock.Equipment != nil {
            equipmentName = restock.Equipment.EquipmentName
        }

        employeeName := ""
        if restock.Employee != nil {
            employeeName = restock.Employee.FirstName + " " + restock.Employee.LastName
        } else {
            fmt.Printf("EmployeeID: %d not found in Employee table\n", restock.EmployeeID)
        }

        formattedReceivingDate := restock.ReceivingDate.Format("2006-01-02 15:04:05")

        item := map[string]interface{}{
            "ID":                 restock.ID,
            "RestockQuantity":    restock.RestockQuantity,
            "ReceivingDate":      formattedReceivingDate,
            "EquipmentName":      equipmentName,
            "EmployeeName":       employeeName,
        }

        response = append(response, item)
    }

    c.JSON(http.StatusOK, response)
}



// RequisitionEquipment เป็นฟังก์ชันสำหรับเติมอุปกรณ์
func RestockEquipment(c *gin.Context) {
    var restock entity.Restocks
    var equipment entity.Equipments

    // เชื่อมต่อกับฐานข้อมูล
    db := config.DB()

    // รับข้อมูล restock จาก request body
    if err := c.ShouldBindJSON(&restock); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
        return
    }

    // ดึงข้อมูลอุปกรณ์ตาม ID จาก restock
    results := db.First(&equipment, restock.EquipmentID)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบอุปกรณ์"})
        return
    }

    // เพิ่มจำนวนอุปกรณ์ในตาราง equipments
    equipment.Quantity += restock.RestockQuantity

    // บันทึกการเปลี่ยนแปลงในตาราง equipments
    if err := db.Save(&equipment).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถอัปเดตจำนวนอุปกรณ์ได้"})
        return
    }

    // เพิ่มข้อมูลการเติมลงในตาราง restocks
    restock.ReceivingDate = time.Now() // กำหนดวันที่เติมเป็นเวลาปัจจุบัน
    if err := db.Create(&restock).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "เกิดข้อผิดพลาด"})
        return
    }

    // ส่งผลลัพธ์กลับ
    c.JSON(http.StatusOK, gin.H{
        "message":          "เติมอุปกรณ์สำเร็จ",
    })
}