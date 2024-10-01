//import { UsersInterface } from "../../interfaces/IUser";

//import { SignInInterface } from "../../interfaces/SignIn";

import axios from "axios";



/**/
import { EquipmentInterface } from "../../../interfaces/storage/IEquipment";
import { RestockInterface } from "../../../interfaces/storage/IRestock";
import { RequisitionInterface } from "../../../interfaces/storage/IRequisition";




const apiUrl = "http://localhost:8000";

const Authorization = localStorage.getItem("token");

const Bearer = localStorage.getItem("token_type");


const requestOptions = {

  headers: {

    "Content-Type": "application/json",

    Authorization: `${Bearer} ${Authorization}`,

  },

};

async function GetEquipments() {

  return await axios

    .get(`${apiUrl}/equipments`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function GetEquipmentById(id: string) {

  return await axios

    .get(`${apiUrl}/equipment/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function GetEquipmentsLittle() {

  return await axios

    .get(`${apiUrl}/equipments/lowstock`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function CreateEquipment(data: EquipmentInterface) {

  return await axios

    .post(`${apiUrl}/createEq`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function UpdateEquipmentById(id: string, data: EquipmentInterface) {
  try {
    const response = await axios.put(`${apiUrl}/equipment/${id}`, data, requestOptions);
    return response; // ส่งคืนการตอบสนองทั้งหมด
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // จัดการข้อผิดพลาดจาก axios
      return {
        status: error.response?.status || 500,
        data: error.response?.data || { error: 'Unknown error occurred' }
      };
    }
    // จัดการข้อผิดพลาดอื่นๆ
    return {
      status: 500,
      data: { error: 'Unexpected error occurred' }
    };
  }
}

async function DeleteEquipmentById(id: string) {

  return await axios

    .delete(`${apiUrl}/equipment/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function GetRequisitions() {

  return await axios

    .get(`${apiUrl}/requisitions`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function GetRequisitionsDate(date: string) {
  try {
    // ส่งพารามิเตอร์ date ใน query string
    const response = await axios.get(`${apiUrl}/requisitionsDate`, {
      params: { date }, // ส่งพารามิเตอร์ date
    });
    return response;
  } catch (error: any) {
    // ตรวจสอบประเภทของข้อผิดพลาดและคืนค่าข้อมูลที่เหมาะสม
    if (error.response) {
      // ข้อผิดพลาดจากการตอบสนองของ API
      return error.response;
    } else if (error.request) {
      // ข้อผิดพลาดจากการส่งคำขอ
      console.error('Error request:', error.request);
    } else {
      // ข้อผิดพลาดทั่วไป
      console.error('Error message:', error.message);
    }
    // คืนค่าเริ่มต้นหรือข้อผิดพลาดที่กำหนดเอง
    return { status: 500, data: { error: 'Unknown error occurred' } };
  }
}


async function CreateRequisition(data: RequisitionInterface) {

  return await axios

    .patch(`${apiUrl}/requisitions`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}

async function GetRestocks() {

  return await axios

    .get(`${apiUrl}/restocks`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function GetRestocksDate(date: string) {
  try {
    // ส่งพารามิเตอร์ date ใน query string
    const response = await axios.get(`${apiUrl}/restocksDate`, {
      params: { date }, // ส่งพารามิเตอร์ date
    });
    return response;
  } catch (error: any) {
    // ตรวจสอบประเภทของข้อผิดพลาดและคืนค่าข้อมูลที่เหมาะสม
    if (error.response) {
      // ข้อผิดพลาดจากการตอบสนองของ API
      return error.response;
    } else if (error.request) {
      // ข้อผิดพลาดจากการส่งคำขอ
      console.error('Error request:', error.request);
    } else {
      // ข้อผิดพลาดทั่วไป
      console.error('Error message:', error.message);
    }
    // คืนค่าเริ่มต้นหรือข้อผิดพลาดที่กำหนดเอง
    return { status: 500, data: { error: 'Unknown error occurred' } };
  }
}

async function CreateRestock(data: RestockInterface) {

  return await axios

    .patch(`${apiUrl}/restocks`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);
}

export {

  GetEquipments,
  GetEquipmentById,
  CreateEquipment,
  UpdateEquipmentById,
  DeleteEquipmentById,
  GetEquipmentsLittle,

  GetRequisitions,
  GetRequisitionsDate,
  CreateRequisition,

  GetRestocks,
  GetRestocksDate,
  CreateRestock,
  
};