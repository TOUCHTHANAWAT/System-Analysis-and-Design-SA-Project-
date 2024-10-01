//import { UsersInterface } from "../../../interfaces/dental/IUser";
import { DentalRecordInterface } from "../../../interfaces/dental/IDentalRecord";
import { TreatmentsInterface } from "../../../interfaces/dental/ITreatment";
import { PatientsInterface } from "../../../interfaces/dental/IPatient";

const apiUrl = "http://localhost:8000";

// User related functions
async function GetUsers() {
  try {
    const response = await fetch(`${apiUrl}/users`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch users:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

async function GetGenders() {
  try {
    const response = await fetch(`${apiUrl}/genders`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch genders:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching genders:", error);
    return [];
  }
}

async function DeleteUserByID(id: number | undefined) {
  if (id == null || id === 0) { // ตรวจสอบว่าค่า id ไม่เป็น undefined หรือ 0
    console.error("Invalid ID");
    return false;
  }

  try {
    const response = await fetch(`${apiUrl}/users/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log(`User with ID ${id} deleted successfully.`);
    } else {
      console.error("Failed to delete user:", response.statusText);
    }

    return response.ok;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
}

async function GetUserById(id: number | undefined) {
  if (id == null || id === 0) {
    console.error("Invalid ID");
    return false;
  }

  try {
    const response = await fetch(`${apiUrl}/user/${id}`, {
      method: "GET",
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch user:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return false;
  }
}

// async function CreateUser(data: UsersInterface) {
//   try {
//     const response = await fetch(`${apiUrl}/users`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });

//     if (response.ok) {
//       return await response.json();
//     } else {
//       console.error("Failed to create user:", response.statusText);
//       return false;
//     }
//   } catch (error) {
//     console.error("Error creating user:", error);
//     return false;
//   }
// }

// async function UpdateUser(data: UsersInterface) {
//   try {
//     const response = await fetch(`${apiUrl}/users`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });

//     if (response.ok) {
//       return await response.json();
//     } else {
//       console.error("Failed to update user:", response.statusText);
//       return false;
//     }
//   } catch (error) {
//     console.error("Error updating user:", error);
//     return false;
//   }
// }

// DentalRecord related functions
async function GetDentalRecords() {
  try {
    const response = await fetch(`${apiUrl}/dental_records`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch dental records:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching dental records:", error);
    return [];
  }
}

async function DeleteDentalRecordByID(id: number | undefined) {
  if (id == null || id === 0) { // ตรวจสอบค่า id ให้แน่ใจว่าไม่เป็น undefined หรือ 0
    console.error("Invalid ID");
    return false;
  }

  try {
    const response = await fetch(`${apiUrl}/dental_record/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log(`Dental record with ID ${id} deleted successfully.`);
    } else {
      console.error("Failed to delete dental record:", response.statusText);
    }

    return response.ok;
  } catch (error) {
    console.error("Error deleting dental record:", error);
    return false;
  }
}

async function CreateDentalRecord(data: DentalRecordInterface) {
  try {
    const response = await fetch(`${apiUrl}/dental_records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to create dental record:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error creating dental record:", error);
    return false;
  }
}

// ในไฟล์เซอร์วิสของคุณ
// services/https/index.ts
async function UpdateDentalRecord(id: number, data: DentalRecordInterface) {
  try {
    const response = await fetch(`${apiUrl}/dental_records/${id}`, {
      method: 'PATCH', // ใช้ 'PATCH' สำหรับการอัปเดตข้อมูล
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return await response.json(); // ส่งคืนข้อมูล JSON ถ้าอัปเดตสำเร็จ
    } else {
      const errorResult = await response.json(); // อ่านข้อความแสดงข้อผิดพลาดจากเซิร์ฟเวอร์
      console.error('Failed to update dental record:', errorResult);
      return { error: errorResult.error || 'Unknown error' }; // ส่งคืนข้อผิดพลาดหากไม่สำเร็จ
    }
  } catch (error) {
    console.error('Error updating dental record:', error);
    return { error: 'Network error' }; // ส่งคืนข้อความข้อผิดพลาดเครือข่าย
  }
}






// services/https.ts

// Function to get all treatments
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

// Function to get all patients
async function GetPatients() {
  try {
    const response = await fetch(`${apiUrl}/patients`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error(`Failed to fetch patients with status: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error("Error fetching patients:", error);
    return false;
  }
}

// Function to get a specific dental record by ID
async function GetDentalRecordByID(id: number) {
  if (id == null || id === 0) { // Validate that the ID is not null or 0
    console.error("Invalid ID");
    return false;
  }

  try {
    const response = await fetch(`${apiUrl}/dental_record/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      return await response.json(); // Return the JSON data
    } else {
      console.error(`Failed to fetch dental record with status: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error("Error fetching dental record:", error);
    return false;
  }
}


export {
  GetUsers,
  GetGenders,
  DeleteUserByID,
  GetUserById,
  GetDentalRecords,
  DeleteDentalRecordByID,
  CreateDentalRecord,
  UpdateDentalRecord,
  GetTreatment,
  GetPatients,
  GetDentalRecordByID,
};
