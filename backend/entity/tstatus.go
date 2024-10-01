package entity
import (
	"gorm.io/gorm"
	)
type Tstatus struct {
	gorm.Model
	TStatusName 	string
	Schedule 		[]Schedule `gorm:"foreignKey:TstatusID"`
}