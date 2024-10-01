package main

import (
	"net/http"

	"example.com/project/config"
	"example.com/project/controller"
	"example.com/project/middlewares"
	"github.com/gin-gonic/gin"
)

const PORT = "8000"

func main() {

	// open connection database
	config.ConnectionDB()

	// Generate databases
	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())
	r.POST("/signup", controller.SignUp)
	r.POST("/signin", controller.SignIn)

	router := r.Group("")
	{
        router.GET("/dental_records", controller.ListDentalRecords)
        router.GET("/dental_record/:id", controller.GetDentalRecord)
        router.POST("/dental_records", controller.CreateDentalRecord)
        router.PATCH("/dental_record/:id", controller.UpdateDentalRecord)
        router.DELETE("/dental_record/:id", controller.DeleteDentalRecord)
    }

	
	router2 := r.Group("api")
	{
		
		//Schedule Routes------------------------------------------
		router.GET("/schedules", controller.ListSchedules)
		router.GET("/schedule/:id", controller.GetSchedule)
		router.POST("/schedules", controller.CreateSchedule)
		router.PATCH("/updateschedules", controller.UpdateSchedule)
		router.DELETE("/schedules/:id", controller.DeleteSchedule)
		router.GET("/getschedulebydate/:date", controller.GetScheduleByDate)
		router.PATCH("/updateschedulestatus/:id", controller.UpdateScheduleStatus)
		
		router.GET("/patients", controller.ListPatients)
		router.GET("/treatments", controller.ListTreatment)
		router.GET("/tstatuss", controller.ListTstatuss)
		router.GET("/tstatus/:id", controller.GetTstatusByID)

		//----------------------------------------------------------
		
		// ระบบชำระเงิน
	   router2.GET("/record",controller.GetAllDentalRecord)
	   router2.GET("/PaymentRecord/:id",controller.PaymentDentalRecord)
	   router2.GET("/Receipt/:id",controller.GetReceipt)
	   router2.GET("/SaveRecord",controller.GetSaveDentalRecord)
	   router2.POST("/newPayment", controller.CreatePayment)
	   router2.POST("/newDentalRecord", controller.CreateDentalRecord)
	   router2.DELETE("/deleteDentalRecord/:id", controller.DeleteDentalRecord)
	   router2.DELETE("/deletePayment/:id", controller.DeletePayment)
	   router2.PATCH("/uprecord/:id", controller.UpdateDentalRecord)
	   router2.PUT("/uprecordpay/:id", controller.UpdateDentalRecordPayment)
		
		// ระบบ stock

		// Equipment Route
		router.POST("/createEq", controller.CreateEq)
        router.GET("/equipments", controller.GetAllEquipments)
        router.GET("/equipment/:id", controller.GetEquipment)
        router.PUT("/equipment/:id", controller.UpdateEquipment)
        router.DELETE("/equipment/:id", controller.DeleteEquipment)
        router.GET("/equipments/lowstock", controller.GetLowStockEquipments)  /*อุปกรณ์เหลือน้อย*/
		
		// requisitions Route
        router.GET("/requisitions", controller.GetAllRequisitions)
		router.GET("/requisitionsDate", controller.GetAllRequisitionsDate)/**/
        router.PATCH("/requisitions", controller.RequisitionEquipment)     /*เบิกอุปกรณ์*/


        // restocks Route
        router.GET("/restocks", controller.GetAllRestocks)
		router.GET("/restocksDate", controller.GetAllRestocksDate)/**/
        router.PATCH("/restocks", controller.RestockEquipment)   /*เติมอุปกรณ์*/
		//-------------------------------------------------------------------
		// Employee Routes
		router.GET("/employees", controller.ListEmployees)
		router.GET("/employee/:id", controller.GetEmployee)
		router.POST("/employees", controller.CreateEmployee)
		router.PATCH("/employees", controller.UpdateEmployee)
		router.DELETE("/employees/:id", controller.DeleteEmployee)
		// Gender Routes
		router.GET("/genders", controller.ListGenders)
		// BloodType Routes
		router.GET("/bloodTypes", controller.ListBloodTypes)
		// JobPosition Routes
		router.GET("/jobPositions",controller.ListJobPositions)
		// Patient Routes
		//router.GET("/patients", controller.ListPatients)
		router.GET("/patient/:id", controller.GetPatient)
		router.POST("/patients", controller.CreatePatient)
		router.PATCH("/patients", controller.UpdatePatient)
		router.DELETE("/patients/:id", controller.DeletePatient)
		//--------------------------------------------------------------------
			
		//login employee
		router.Use(middlewares.Authorizes())
		router.GET("/employeeslogin", controller.EmployeesLogin)

	}
	//r.GET("/genders", controller.ListGenders)

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	// Run the server
	r.Run("localhost:" + PORT)
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
