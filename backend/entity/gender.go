package entity
import (
	`gorm.io/gorm`
)
type Gender struct {
	gorm.Model
	Sex 			string 
	Patient 		[]Patient 	`gorm:"foreignKey:GenderID"`
	Employee 		[]Employee	`gorm:"foriegnKey:GenderID"`
}

