
import { SchedulesInterface } from "../../../interfaces/schedule/ISchedule";
const apiUrl = "http://localhost:8000";
//import axios from 'axios';


async function GetGenders() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/genders`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function GetPatients() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/patients`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function GetTreatment() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/treatments`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

//
async function GetSchedulesByDate(date: string) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/getschedulebydate/${date}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function GetScheduleById(id: Number | undefined) {
  const requestOptions = {
    method: "GET"
  };

  let res = await fetch(`${apiUrl}/schedule/${id}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}


async function CreateSchedule(data: SchedulesInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/schedules`, requestOptions)
    .then((res) => {
      if (res.status == 201) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}





async function UpdateSchedule(data: SchedulesInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/updateschedules`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}


async function UpdateScheduleStatus(id: Number | undefined) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(id),
  };

  let res = await fetch(`${apiUrl}/updateschedulestatus/${id}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}
async function DeleteScheduleByID(id: number | undefined) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/schedules/${id}`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return true; // ลบสำเร็จ
      } else {
        return false; // ลบไม่สำเร็จ
      }
    });

  return res;
}

async function GetAllSchedule() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  let res = await fetch(`${apiUrl}/schedules`, requestOptions)
    .then((res) => {
      if (res.status === 200) {  // ใช้ status 200 สำหรับการดึงข้อมูลสำเร็จ
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function GetTstatus() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  let res = await fetch(`${apiUrl}/tstatuss`, requestOptions)
    .then((res) => {
      if (res.status === 200) {  // ใช้ status 200 สำหรับการดึงข้อมูลสำเร็จ
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function GetTstatusById(id: Number | undefined) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  let res = await fetch(`${apiUrl}/tstatus/${id}`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}


export {
  GetGenders,
  GetTreatment,
  CreateSchedule,
  GetSchedulesByDate,
  UpdateScheduleStatus,
  UpdateSchedule,
  GetScheduleById,
  GetPatients,
  DeleteScheduleByID,
  GetAllSchedule,
  GetTstatus,
  GetTstatusById,
};