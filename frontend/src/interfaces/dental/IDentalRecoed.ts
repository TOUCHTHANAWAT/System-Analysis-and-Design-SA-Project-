export interface DentalRecoedInterface {
	ID?: number;
    Date?: string;
	Description?: string;
	Fees?: number;
	PrintFees?:string;  // feesที่แปลงแล้ว
	Installment?: number;	
	NumberOfInstallment?: string;
	PatientID?: number;
	EmployeeID?: number;
	TreatmentID?: number;
	StatusID?: number;
	PaymentID ?: number;
	FirstName?: string;
	LastName?: string;
	Age?:number;
	FormattedDate?: string;
	StatusName?: number;
	
}
