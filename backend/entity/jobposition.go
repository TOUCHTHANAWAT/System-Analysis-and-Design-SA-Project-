package entity
import (
	`gorm.io/gorm`
)

type JobPosition struct{
	gorm.Model
	Job 		string 		
	Employee 	[]Employee	`gorm:"foriegnKey:JobPositionID"`
}