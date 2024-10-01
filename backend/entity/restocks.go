package entity

import (
	"time"

	"gorm.io/gorm"
)

type Restocks struct {
	gorm.Model
	RestockQuantity	  uint 			`json:"restock_quantity"`
	ReceivingDate     time.Time  	`json:"receiving_date"`

	EquipmentID		  uint			`json:"equipment_id"`
	Equipment		  *Equipments 	`gorm:"foreignKey: equipment_id" json:"equipment"`

	EmployeeID 		  uint			`json:"employee_id"`
	Employee		  *Employee	`gorm:"foreignKey: employee_id" json:" employee"`
	
}