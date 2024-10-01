package entity
import (
	"time"
	"gorm.io/gorm"
)
type Schedule struct {
	gorm.Model
	Date        	time.Time `gorm:"type:DATE;not null;"`
	PatientID   	uint
	Patient     	Patient `gorm:"foriegnKey:PatientID"`
	TreatmentID 	uint
	Treatment    	Treatment `gorm:"foriegnKey:TreatmentID"`
	TstatusID   	uint
	Tstatus			Tstatus `gorm:"foriegnKey:TStatusID"`
}
func (s *Schedule) BeforeSave(tx *gorm.DB) (err error) {
    // Set time to 23:59:00
    s.Date = time.Date(s.Date.Year(), s.Date.Month(), s.Date.Day(), 23, 59, 0, 0, s.Date.Location())
    return
}