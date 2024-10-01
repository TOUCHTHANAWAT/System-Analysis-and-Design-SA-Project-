package entity

import (
	"time"

	"gorm.io/gorm"
)

type Requisitions struct {
	gorm.Model
	RequisitionQuantity uint       `json:"requisition_quantity"`
	Time                time.Time  `json:"time"`
	Note                string     `json:"note"`

	EquipmentID 		uint       `json:"equipment_id"`
	Equipment   		*Equipments `gorm:"foreignKey:EquipmentID" json:"equipment"`

	EmployeeID 			uint       `json:"employee_id"`
	Employee   			*Employee 	`gorm:"foreignKey:EmployeeID" json:"employee"`
}
