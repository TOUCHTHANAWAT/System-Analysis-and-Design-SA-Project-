export interface DentalRecordInterface {
    ID: number;
    Date: string; // ใช้ `string` เพราะเป็นรูปแบบวันที่ ISO
    Description: string;
    Fees: number;
    Installment: number;
    NumberOfInstallment: string;
    TreatmentID: number;
    StatusID: number;
    PatientID: number;
    EmployeeID: number;
    Treatment?: {
      ID: number;
      Name: string;
    };
    Status?: {
      ID: number;
      Name: string;
    };
    Patient?: {
      ID: number;
      FirstName: string;
      LastName: string;
    };
    Employee?: {
      ID: number;
      FirstName: string;
      LastName: string;
    };
  }
  