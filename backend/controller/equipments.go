package controller

import (
	"fmt"
	"math"
	"net/http"
	"errors"
	"gorm.io/gorm"
	"github.com/gin-gonic/gin"
	"example.com/project/config"
	"example.com/project/entity"
)

// ฟังก์ชัน GetAllEquipments - ดึงข้อมูลอุปกรณ์ทั้งหมด
func GetAllEquipments(c *gin.Context) {
    var equipments []entity.Equipments
    db := config.DB()

    // กรองเฉพาะอุปกรณ์ที่ยังไม่ถูกลบ
    results := db.Where("is_active = ?", true).Find(&equipments)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    // ฟอร์แมตข้อมูล cost ให้เป็นทศนิยม 2 ตำแหน่ง
    response := []map[string]interface{}{}
    for _, equipment := range equipments {
        item := map[string]interface{}{
            "ID":            equipment.ID,
            "EquipmentName": equipment.EquipmentName,
            "Unit":          equipment.Unit,
            "Cost":          fmt.Sprintf("%.2f", equipment.Cost), // ฟอร์แมตทศนิยม 2 ตำแหน่ง
            "Quantity":      equipment.Quantity,
        }
        response = append(response, item)
    }

    c.JSON(http.StatusOK, response)
}

// ฟังก์ชัน GetEquipment - ดึงข้อมูลอุปกรณ์ตาม ID
func GetEquipment(c *gin.Context) {
    ID := c.Param("id")
    var equipment entity.Equipments
    db := config.DB()

    // กรองเฉพาะอุปกรณ์ที่ยัง Active อยู่
    results := db.Where("is_active = ? AND id = ?", true, ID).First(&equipment)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    // ฟอร์แมตข้อมูล cost ให้เป็นทศนิยม 2 ตำแหน่งก่อนส่ง response
    response := map[string]interface{}{
        "ID":            equipment.ID,
        "EquipmentName": equipment.EquipmentName,
        "Unit":          equipment.Unit,
        "Cost":          fmt.Sprintf("%.2f", equipment.Cost), // ฟอร์แมตทศนิยม 2 ตำแหน่ง
        "Quantity":      equipment.Quantity,
    }

    c.JSON(http.StatusOK, response)
}

type createEq struct {
    EquipmentName string  `json:"EquipmentName"`
    Unit          string  `json:"unit"`
    Cost          float32 `json:"cost"`
    Quantity      uint    `json:"quantity"`
}


// ฟังก์ชัน CreateEq - สร้างอุปกรณ์ใหม่
func CreateEq(c *gin.Context) {
    var payload createEq

    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()
    var equipmentCheck entity.Equipments

    // ตรวจสอบว่ามีอุปกรณ์ที่มีชื่อเดียวกันอยู่แล้วหรือไม่
    result := db.Where("equipment_name = ?", payload.EquipmentName).First(&equipmentCheck)
    if result.Error != nil && !errors.Is(result.Error, gorm.ErrRecordNotFound) {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    // หากมีอุปกรณ์และถูกลบ ให้ลบอุปกรณ์นั้นก่อน
    if equipmentCheck.ID != 0 {
        if !equipmentCheck.IsActive { // ถ้าอุปกรณ์ถูกลบ (IsActive = false)
            // ลบอุปกรณ์เดิม
            if err := db.Delete(&equipmentCheck).Error; err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
                return
            }
        } else {
            // ถ้าอุปกรณ์ยังอยู่และยัง Active
            c.JSON(http.StatusConflict, gin.H{"error": "อุปกรณ์นี้มีอยู่แล้ว"})
            return
        }
    }

    // ปรับให้ค่า Cost มีทศนิยม 2 ตำแหน่ง
    costRounded := math.Round(float64(payload.Cost)*100) / 100

    equipment := entity.Equipments{
        EquipmentName: payload.EquipmentName,
        Unit:          payload.Unit,
        Cost:          float32(costRounded),
        Quantity:      payload.Quantity,
        IsActive:      true, // กำหนดสถานะเป็น Active
    }

    if err := db.Create(&equipment).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "เพิ่มอุปกรณ์สำเร็จ"})
}


// ฟังก์ชัน UpdateEquipment - แก้ไขข้อมูลอุปกรณ์
func UpdateEquipment(c *gin.Context) {
    var equipment entity.Equipments
    EquipmentID := c.Param("id")
    db := config.DB()

    result := db.First(&equipment, EquipmentID)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
        return
    }

    if err := c.ShouldBindJSON(&equipment); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
        return
    }

    result = db.Save(&equipment)
    if result.Error != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "แก้ไขอุปกรณ์สำเร็จ"})
}

// ฟังก์ชัน DeleteEquipment - ลบอุปกรณ์ (Soft Delete)
func DeleteEquipment(c *gin.Context) {
    id := c.Param("id")
    db := config.DB()

    // Soft delete โดยการอัปเดตสถานะ IsActive
    if tx := db.Model(&entity.Equipments{}).Where("id = ?", id).Update("is_active", false); tx.RowsAffected == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "ลบอุปกรณ์สำเร็จ"})
}


// ฟังก์ชัน GetLowStockEquipments - ดึงข้อมูลอุปกรณ์ที่มีจำนวนสต็อกน้อย
func GetLowStockEquipments(c *gin.Context) {
    var equipments []entity.Equipments
    db := config.DB()

    // Query เพื่อดึงข้อมูลอุปกรณ์ที่ Quantity น้อยกว่า 100 และยัง Active อยู่
    results := db.Where("quantity < ? AND is_active = ?", 100, true).Find(&equipments)

    if results.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
        return
    }

    if len(equipments) == 0 {
        c.JSON(http.StatusNoContent, gin.H{"message": "ไม่พบอุปกรณ์ที่เหลือน้อย"})
        return
    }

    // ฟอร์แมตทศนิยมและข้อมูลที่ต้องการ
    response := []map[string]interface{}{}
    for _, equipment := range equipments {
        item := map[string]interface{}{
            "ID":            equipment.ID,
            "EquipmentName": equipment.EquipmentName,
            "Unit":          equipment.Unit,
            "Cost":          fmt.Sprintf("%.2f", equipment.Cost), // ฟอร์แมตทศนิยม 2 ตำแหน่ง
            "Quantity":      equipment.Quantity,
        }
        response = append(response, item)
    }

    c.JSON(http.StatusOK, response)
}
