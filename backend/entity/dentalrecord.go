package entity

import (
	"time"
	"gorm.io/gorm"
)

type DentalRecord struct {
	gorm.Model
	Date                time.Time 
	Description         string    
	Fees                float32   
	Installment         float32   
	NumberOfInstallment string    

	PatientID   		uint
	Patient     		Patient 	`gorm:"foreignKey:PatientID"`

	EmployeeID 			uint     
	Employee   			Employee 	`gorm:"foreignKey:EmployeeID"`

	TreatmentID 		uint      
	Treatment   		Treatment 	`gorm:"foreignKey:TreatmentID"`

	StatusID 			uint   
	Status   			Status 		`gorm:"foreignKey:StatusID"`

	PaymentID 			*uint   	
	Payment   			*Payment 	`gorm:"foreignKey:PaymentID" constraint:"OnDelete:SET NULL"` // ความสัมพันธ์แบบหนึ่งต่อหนึ่ง
}
