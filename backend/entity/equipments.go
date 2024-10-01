package entity

import (
	"gorm.io/gorm"
)

type Equipments struct {
	gorm.Model
	EquipmentName  string	`json:"equipment_name"`
	Unit           string	`json:"unit"`
	Cost           float32	`json:"cost"`
	Quantity       uint		`json:"quantity"`
	IsActive       bool    `json:"IsActive" gorm:"default:true"` // เพิ่มฟิลด์ IsActive
}
