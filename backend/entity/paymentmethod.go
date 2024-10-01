package entity

import "gorm.io/gorm"

type PaymentMethod struct {
	gorm.Model
	MethodName 	string
	Payment 	[]Payment	`gorm:"foriegnKey:PaymentMethodID"`
}