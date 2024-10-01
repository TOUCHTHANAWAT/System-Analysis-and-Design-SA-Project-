// import React, { useState } from "react";
// import {
//   MenuOutlined,
//   UserOutlined,
//   CalendarOutlined,
//   DollarOutlined,
//   ProductOutlined,
//   HeartOutlined,
// } from "@ant-design/icons";

// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import { Layout, Menu, Button } from "antd";

// //
// import Schedule from "./pages/schedule/create/create.tsx";
// import ViewSchedule from "./pages/schedule/view/view.tsx";
// import EditSchedule from "./pages/schedule/edit/edit.tsx";

// // storage
// import CreateEq from "./pages/storage/CreateEq/CreateEq";
// import EditEq from "./pages/storage/EditEq/EditEq.tsx";
// import Equipments from "./pages/storage/Equipments/Equipments.tsx";  
// import Requisitions from "./pages/storage/Requisitions/Requisitions.tsx";
// import RequestEq from "./pages/storage/RequestEq/RequestEq.tsx";
// import LittleEq from "./pages/storage/LittleEq/LittleEq.tsx";
// import AddEq from "./pages/storage/AddEq/AddEq.tsx";
// import Restocks from "./pages/storage/Restocks/Restocks.tsx";

// // individual
// import Employee  from "./pages/individual/employee/index.tsx"
// import Patient  from "./pages/individual/patient/index.tsx"
// import PatientCreate from "./pages/individual/patient/create"
// import EmployeeCreate from "./pages/individual/employee/create"
// import EmployeeEdit from "./pages/individual/employee/edit"
// import PatientEdit from "./pages/individual/patient/edit"

// // payment
// //import Htmlrecipt from '../Receipt/htmlRecipt';
// import PaymentPage from './pages/payment/payment/PaymentPage.tsx'
// import PaymentList from './pages/payment/PaymentList/PaymentList.tsx'
// import SavePayment from './pages/payment/SavePayment/SavePayment.tsx';
// import Dashbord from './pages/payment/dashbord/dashbord.tsx';

// //Dental
// import DentalRecord from "./pages/Record/DentalRecord";
// import Customer from "./pages/Record/EditRecord";
// //import Test from "./pages/Test";
// import CustomerCreate from "./pages/Record/EditRecord";
// import CustomerEdit from "./pages/Record/EditRecord";
// import AddDentalRecord from "./pages/Record/AddDentalRecord";

// const { Header, Content, Sider } = Layout;

// const items = [
//   {
//     key: "register",
//     label: "ทะเบียน",
//     icon: <UserOutlined />,
//     children: [
//       {
//         key: "employees",
//         label: (
//           <Link to="/employees">
//             <div>พนักงาน</div>
//           </Link>
//         ),
//       },
//       {
//         key: "patients",
//         label: (
//           <Link to="/patients">
//             <div>คนไข้</div>
//           </Link>
//         ),
//       },
//     ],
//   },
//   {
//     key: "Schedule",
//     label: "นัดหมาย",
//     icon: <CalendarOutlined />,
//     children: [
//       {
//         key: "Schedule",
//         label: (
//           <Link to="/viewschedule">
//             <div>กำหนดการ</div>
//           </Link>
//         ),
//       },
//       {
//         key: "CreateSchedule",
//         label: (
//           <Link to="/schedule">
//             <div>สร้างการนัดหมาย</div>
//           </Link>
//         ),
//       },
//     ],
//   },
//   {
//     key: "finance",
//     label: "การเงิน",
//     icon: <DollarOutlined />,
//     children: [
//       {
//         key: "paymentList",
//         label: (
//           <Link to="/paymentList">
//             <div>รอชำระเงิน</div>
//           </Link>
//         ),
//       },
//       {
//         key: "savePayment",
//         label: (
//           <Link to="/savePayment">
//             <div>บันทึกชำระเงิน</div>
//           </Link>
//         ),
//       },
//     ],
//   },
//   {
//     key: "stock",
//     label: "คลังวัสดุอุปกรณ์",
//     icon: <ProductOutlined />,
//     children: [
//       {
//         key: "equipment",
//         label: (
//           <Link to="/Equipments">
//             <div>อุปกรณ์</div>
//           </Link>
//         ),
//       },
//       {
//         key: "requisition",
//         label: (
//           <Link to="/Requisitions">
//             <div>รายการเบิก</div>
//           </Link>
//         ),
//       },
//       {
//         key: "restock",
//         label: (
//           <Link to="/Restocks">
//             <div>รายการเติม</div>
//           </Link>
//         ),
//       },
//     ],
//   },
//   {
//     key: "treatment",
//     label: "การรักษา",
//     icon: <HeartOutlined />,
//     children: [
//       {
//         key: "DentalRecord",
//         label: (
//           <Link to="/DentalRecord">
//             <div>บันทึกการรักษา</div>
//           </Link>
//         ),
//       },
//       {
//         key: "AddDentalRecord",
//         label: (
//           <Link to="/AddDentalRecord">
//             <div>เพิ่มการรักษา</div>
//           </Link>
//         ),
//       },
//     ],
//   },
// ];

// const App: React.FC = () => {
//   const [collapsed, setCollapsed] = useState(false); // สำหรับปิด/เปิดเมนู
//   const [showText, setShowText] = useState(true); // สำหรับแสดง/ซ่อนข้อความข้างๆปุ่ม

//   const toggleMenu = () => {
//     setCollapsed(!collapsed); // เปลี่ยนสถานะ collapsed (เปิด/ปิดเมนู)
//     setShowText(!showText); // แสดงหรือซ่อนข้อความข้างๆ ปุ่ม
//   };

//   return (
//     <Router>
//       <Layout style={{ minHeight: "100vh" }}>
//         <Sider
//           collapsible
//           collapsed={collapsed}
//           style={{
//             background:
//               "linear-gradient(180deg, #22225E 0%, #22225E 20%, #7DC9D1 80%, #42C2C2 100%)",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between", // เปลี่ยนเป็น space-between เพื่อให้ปุ่มและข้อความอยู่ชิดกัน
//               alignItems: "center", // จัดให้อยู่กึ่งกลางในแนวตั้ง
//               marginTop: 20,
//               marginBottom: 20,
//               marginLeft: "17px", // เพิ่ม margin-left เพื่อขยับปุ่มและข้อความไปทางขวา
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center" }}>
//               <Button
//                 icon={<MenuOutlined style={{ color: "white" }} />}
//                 shape="circle"
//                 size="large"
//                 style={{
//                   backgroundColor: "transparent",
//                   border: "none",
//                   width: "32px",
//                   height: "32px",
//                 }}
//                 onClick={toggleMenu} // เรียกใช้ฟังก์ชัน toggleMenu เมื่อกดปุ่ม
//               />
//               {showText && (
//                 <span
//                   style={{ marginLeft: "0px", fontSize: 12, color: "white" }}
//                 >
//                   SAMGT-PLEASANT
//                 </span>
//               )}
//             </div>
//           </div>
//           <div style={{ flex: 1 }}>
//             <Menu
//               theme="dark"
//               mode="inline"
//               inlineCollapsed={collapsed}
//               items={items}
//               style={{
//                 marginTop: "auto", // ดันรายการเมนูลงไปด้านล่าง
//                 background: "transparent",
//               }}
//             />
//           </div>
//         </Sider>
//         <Layout>
//           <Header style={{ padding: 0, background: "#fff" }} />
//           <Content style={{ margin: "0 16px" }}>
//             <div style={{ padding: 24, background: "#fff", minHeight: "100%" }}>
//               <Routes>
//               <Route path="/schedule" element={<Schedule />} />
//                 <Route path="/viewschedule" element={<ViewSchedule />} />
//                 <Route path="/editschedule/edit/:id" element={<EditSchedule />} />
                
//                 //
//                 <Route path="/CreateEq" element={<CreateEq />} />
//                 <Route path="/EditEq" element={<EditEq />} />
//                 <Route path="/Equipments" element={<Equipments />} />
//                 <Route path="/Requisitions" element={<Requisitions />} />
//                 <Route path="/LittleEq" element={<LittleEq />} />
//                 <Route path="/AddEq" element={<AddEq />} />
//                 <Route path="/RequestEq" element={<RequestEq />} />
//                 <Route path="/Restocks" element={<Restocks />} />
//                 <Route path="/AddEq/:id" element={<AddEq />} />
//                 <Route path="/RequestEq/:id" element={<RequestEq />} />
//                 <Route path="/EditEq/:id" element={<EditEq />} />
//                 //
//                 <Route path="/" element={<div>Manage Patient Records</div>} />
//                 <Route path="/customer" element={<div>Manage Patient Records</div>} />
//                 <Route path="/employee/create" element={<EmployeeCreate/>} />
//                 <Route path="/employee/edit/:id" element={<EmployeeEdit/>} />
//                 <Route path="/manage-patients" element={<div>Manage Patient Records</div>} />
//                 <Route path="/employees" element={<Employee />} />
//                 <Route path="/patients" element={<Patient/>} />
//                 <Route path="/patient/create" element={<PatientCreate/>} />
//                 <Route path="/patient/edit/:id" element={<PatientEdit/>} />
//                 //
//                 <Route path="/dashbord" element={<Dashbord />} />{/*แก้ตรงนี้วันที่11/9/67*/}
//                 <Route path="/paymentPage/:id" element={<PaymentPage />} />{/*แก้ตรงนี้วันที่11/9/67*/}
//                 <Route path="/paymentList" element={<PaymentList />} />
//                 <Route path="/buttonPay" element={<PaymentList />} />
//                 <Route path="/savePayment" element={<SavePayment />} />
//                 //
//                 <Route path="/DentalRecord" element={<DentalRecord />} />
//                 <Route path="/EditRecord" element={<Customer />} />
//                 <Route path="/EditRecord" element={<CustomerCreate />} />
//                 <Route path="/EditRecord/:id" element={<CustomerEdit />} />
//                 <Route path="/AddDentalRecord" element={<AddDentalRecord />} />
//                 //
//                 <Route path="/employee" element={<Employee />} />
//                 <Route path="/patient" element={<Patient />} />
//               </Routes>
//             </div>
//           </Content>
//         </Layout>
//       </Layout>
//     </Router>
//   );
// };

// export default App;
import React from "react";

import { BrowserRouter as Router } from "react-router-dom";

import ConfigRoutes from "./routes";

import "./App.css";


const App: React.FC = () => {

  return (
    <Router>
      <ConfigRoutes />
    </Router>
  );
};
export default App;