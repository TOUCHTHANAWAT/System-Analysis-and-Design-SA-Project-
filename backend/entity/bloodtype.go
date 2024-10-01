package entity

import "gorm.io/gorm"

type BloodType struct{
	gorm.Model
	BloodGroup 		string 
	Patient 		[]Patient	`gorm:"foreignKey:BloodTypeID"`
}