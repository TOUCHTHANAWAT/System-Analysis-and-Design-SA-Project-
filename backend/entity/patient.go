package entity
import (
	"time"
	"gorm.io/gorm"
)
type Patient struct {
	gorm.Model
	FirstName 		string
	LastName 		string
	Birthday 		time.Time 
	Weight 			int
	Height 			int
	GenderID   		uint
	Gender			Gender 		`gorm:"foriegnKey:GenderID"`
	BloodTypeID   	uint	
	BloodType		BloodType 	`gorm:"foriegnKey:BloodTypeID"`
	DrugAllergy 	string
	Chronicdisease 	string
	Tel 			string `gorm:"unique"`
	Schedules 		[]Schedule 		`gorm:"foreignKey:PatientID"`
	DentalRecord	[]DentalRecord	`gorm:"foreignKey:PatientID"`
}