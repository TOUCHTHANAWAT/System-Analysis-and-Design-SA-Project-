package entity

import (
	"time"

	"gorm.io/gorm"
)

type Payment struct {
	gorm.Model
	Date 				time.Time

	PaymentMethodID 	uint         
	PaymentMethod   	PaymentMethod 	`gorm:"foriegnKey:PaymentMethodID"`

	EmployeeID 			uint    
	Employee   			Employee 		`gorm:"foriegnKey:EmployeeID"`

	
	DentalRecord 		*DentalRecord 	`gorm:"foreignKey:PaymentID"` // ความสัมพันธ์แบบหนึ่งต่อหนึ่ง
}
