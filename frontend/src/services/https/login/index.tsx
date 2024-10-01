import {EmployeesInterface } from "../../../interfaces/individual/IEmployee";
import {PatientsInterface } from "../../../interfaces/individual/IPatient";
import { SignInInterface } from "../../../interfaces/SignIn";

import axios from "axios";

const apiUrl = "http://localhost:8000";
//
const Authorization = localStorage.getItem("token");
const Bearer = localStorage.getItem("token_type");
const requestOptions = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `${Bearer} ${Authorization}`,
  },
};
async function SignIn(data: SignInInterface) {
  return await axios
    .post(`${apiUrl}/signin`, data, requestOptions)
    .then((res) => res)
    //.catch((e) => e.response);
    .catch((e) => {
      console.error(e); // แสดงข้อผิดพลาดใน console เพื่อช่วยดีบั๊ก
      return e.response; 
    });
}

//
async function GetEmployees() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${Authorization}`,
    },
  };

  let res = await fetch(`${apiUrl}/employees`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}
// Function เพื่อดึงข้อมูลพนักงานที่เข้าสู่ระบบ
async function GetLoggedInEmployee() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${Authorization}`, // ใช้ Bearer Token
    },
  };

  // เรียกใช้ API ที่ localhost:8000/employeeslogin
  let res = await fetch(`${apiUrl}/employeeslogin`, requestOptions)
    .then((res) => {
      if (res.status === 200) {
        return res.json();  // ถ้าการตอบกลับเป็น 200 OK คืนค่าข้อมูลในรูปแบบ JSON
      } else {
        return false;  // หากไม่ใช่ 200 ให้คืนค่าเป็น false เพื่อระบุว่าเกิดข้อผิดพลาด
      }
    })
    .catch((error) => {
      console.error("Error fetching logged-in employee:", error);  // ถ้าเกิดข้อผิดพลาด แสดงใน console
      return false;
    });

  return res;
}

async function GetPatients() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${Bearer} ${Authorization}`,
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

async function GetGenders() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${Bearer} ${Authorization}`,
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

async function GetJobPositions() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${Bearer} ${Authorization}`,
      },
    };
  
    let res = await fetch(`${apiUrl}/jobPositions`, requestOptions)
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else {
          return false;
        }
      });
  
    return res;
  }

  async function GetBloodTypes() {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${Bearer} ${Authorization}`,
      },
    };
  
    let res = await fetch(`${apiUrl}/bloodTypes`, requestOptions)
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else {
          return false;
        }
      });
  
    return res;
  }

async function DeleteEmployeeByID(id: Number | undefined) {
  const requestOptions = {
    method: "DELETE",
    headers: {"Content-Type": "application/json",Authorization: `${Bearer} ${Authorization}`,},
  };

  let res = await fetch(`${apiUrl}/employees/${id}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return true;
      } else {
        return false;
      }
    });

  return res;
}

async function DeletePatientByID(id: Number | undefined) {
    const requestOptions = {
      method: "DELETE",
      headers: {"Content-Type": "application/json",Authorization: `${Bearer} ${Authorization}`,},
    };
  
    let res = await fetch(`${apiUrl}/patients/${id}`, requestOptions)
      .then((res) => {
        if (res.status == 200) {
          return true;
        } else {
          return false;
        }
      });
  
    return res;
  }

async function GetEmployeeById(id: Number | undefined) {
  const requestOptions = {
    method: "GET",
    headers: {"Content-Type": "application/json",Authorization: `${Bearer} ${Authorization}`,},
  };

  let res = await fetch(`${apiUrl}/employee/${id}`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function GetPatientById(id: Number | undefined) {
    const requestOptions = {
      method: "GET",
      headers: {"Content-Type": "application/json",Authorization: `${Bearer} ${Authorization}`,},
    };
  
    let res = await fetch(`${apiUrl}/patient/${id}`, requestOptions)
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else {
          return false;
        }
      });
  
    return res;
  }


async function CreateEmployee(data: EmployeesInterface) {
  const requestOptions = {
    method: "POST",
    headers: {"Content-Type": "application/json",Authorization: `${Bearer} ${Authorization}`,},
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/employees`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        return { status: true, message: res.data };
      } else {
        return { status: false, message: res.error };
      }
    });

  return res;
}

async function CreatePatient(data: PatientsInterface) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" ,Authorization: `${Bearer} ${Authorization}`,},
      body: JSON.stringify(data),
    };
  
    let res = await fetch(`${apiUrl}/patients`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          return { status: true, message: res.data };
        } else {
          return { status: false, message: res.error };
        }
      });
  
    return res;
  }

async function UpdateEmployee(data: EmployeesInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json",Authorization: `${Bearer} ${Authorization}`,},
    body: JSON.stringify(data),
  };

  let res = await fetch(`${apiUrl}/employees`, requestOptions)
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

async function UpdatePatient(data: PatientsInterface) {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json",Authorization: `${Bearer} ${Authorization}`,},
      body: JSON.stringify(data),
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

export {
  
  GetEmployees,
  GetPatients,
  GetGenders,
  GetJobPositions,
  GetBloodTypes,
  DeleteEmployeeByID,
  DeletePatientByID,
  GetEmployeeById,
  GetPatientById,
  CreateEmployee,
  CreatePatient,
  UpdateEmployee,
  UpdatePatient,
  SignIn,
  GetLoggedInEmployee
  
  
};
