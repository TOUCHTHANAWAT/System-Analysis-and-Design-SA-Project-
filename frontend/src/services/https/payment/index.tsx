
import { PaymentInterface } from "../../../interfaces/payment/IPayment";
import axios from 'axios';

const apiUrl = "http://localhost:8000";
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");

const requestOptions = {

  headers: {

    "Content-Type": "application/json",

    Authorization: `${Bearer} ${Authorization}`,

  },

};

async function GetAllDentalRecord() {
    return await axios

    .get(`${apiUrl}/api/record`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function UpdateDentalRecord(id:string) {
    return await axios

    .put(`${apiUrl}/uprecord/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}

async function GetDentalRecordByID(id: string ) {

    return await axios
  
      .get(`${apiUrl}/api/PaymentRecord/${id}`, requestOptions)
  
      .then((res) => res)
  
      .catch((e) => e.response);
  }

async function GetReceiptByID(id:any) {
  return await axios
  
    .get(`${apiUrl}/api/Receipt/${id}`, requestOptions)
  
    .then((res) => res)
  
    .catch((e) => e.response);
}

async function GetSavePayment() {
  return await axios

    .get(`${apiUrl}/api/SaveRecord`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}

// ฟังก์ชันสำหรับการสร้าง Payment ใหม่
async function CreatePayment(data:any) {
  return await axios
    .post(`${apiUrl}/api/newPayment`,data, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

// ฟังก์ชันสำหรับการอัปเดต DentalRecord ด้วย PaymentID ใหม่
async function UpdateDentalRecordPayment(id: any, paymentID: any) {
  return await axios
    .put(`${apiUrl}/api/uprecordpay/${id}`, { paymentID: paymentID }, requestOptions)
    .then((res) => res)
    .catch((e) => e.response);
}

/*async function CreateDentalRecord() {
    return await axios

    .post(`${apiUrl}/newDentalRecord`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}*/

// async function CreatePayment(data:PaymentInterface) {
//     return await axios

//     .post(`${apiUrl}/newPayment`, data,requestOptions)

//     .then((res) => res)

//     .catch((e) => e.response);
// }

export{
    GetAllDentalRecord,
    GetDentalRecordByID,
    GetReceiptByID,
    GetSavePayment,
    CreatePayment,
    UpdateDentalRecord,
    UpdateDentalRecordPayment,
    //CreateDentalRecord,
   
};