import React, { useEffect, useState } from "react";
import {
  MenuOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  ProductOutlined,
  HeartOutlined,
  LogoutOutlined,
  HomeOutlined
} from "@ant-design/icons";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Avatar,Layout, Menu, Button, message, Dropdown } from "antd";

//
import CreateSchedule from "../../pages/schedule/create/create.tsx";
import ViewSchedule from "../../pages/schedule/view/view.tsx";
import EditSchedule from "../../pages/schedule/edit/edit.tsx";
import RecordSchedule from "../../pages/schedule/record/record.tsx";

// storage
import CreateEq from "../../pages/storage/CreateEq/CreateEq";
import EditEq from "../../pages/storage/EditEq/EditEq.tsx";
import Equipments from "../../pages/storage/Equipments/Equipments.tsx";  
import Requisitions from "../../pages/storage/Requisitions/Requisitions.tsx";
import RequestEq from "../../pages/storage/RequestEq/RequestEq.tsx";
import LittleEq from "../../pages/storage/LittleEq/LittleEq.tsx";
import AddEq from "../../pages/storage/AddEq/AddEq.tsx";
import Restocks from "../../pages/storage/Restocks/Restocks.tsx";

// individual
import Employee  from "../../pages/individual/employee/index.tsx"
import Patient  from "../../pages/individual/patient/index.tsx"
import PatientCreate from "../../pages/individual/patient/create"
import EmployeeCreate from "../../pages/individual/employee/create"
import EmployeeEdit from "../../pages/individual/employee/edit"
import PatientEdit from "../../pages/individual/patient/edit"

// payment
//import Htmlrecipt from '../Receipt/htmlRecipt';
import PaymentPage from '../../pages/payment/payment/PaymentPage.tsx'
import PaymentList from '../../pages/payment/PaymentList/PaymentList.tsx'
import SavePayment from '../../pages/payment/SavePayment/SavePayment.tsx';


//Dental

import DentalRecord from "../../pages/Record/DentalRecord";
import Customer from "../../pages/Record/EditRecord";
import EditRecord from "../../pages/Record/EditRecord";
import AddDentalRecord from "../../pages/Record/AddDentalRecord";
import DentalRecordDetails from "../../pages/Record/DentalRecordDetails";


// login
// Import service สำหรับดึงข้อมูลพนักงานที่ล็อกอิน
import { GetLoggedInEmployee } from "../../services/https/login/index.tsx";

// Dashbord
import Dashbord from '../../pages/dashbord/dashbord.tsx';
import dashbord from "../../pages/payment/dashbord/dashbord.tsx";

const { Header, Content, Sider } = Layout;
const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false); // สำหรับปิด/เปิดเมนู
  const [showText, setShowText] = useState(true); // สำหรับแสดง/ซ่อนข้อความข้างๆปุ่ม
  const [messageApi, contextHolder] = message.useMessage();

  const [employeeName, setEmployeeName] = useState(""); // เก็บชื่อ Employee ที่ล็อกอิน
  const [employeePositionID, setEmployeePositionID] = useState<number | null>(null); // แก้ให้เป็น number หรือ null


  const toggleMenu = () => {
    setCollapsed(!collapsed); // เปลี่ยนสถานะ collapsed (เปิด/ปิดเมนู)
    setShowText(!showText); // แสดงหรือซ่อนข้อความข้างๆ ปุ่ม
  };

  const menuItems = {
    dashbord: {
      key: "dashbord",
      label: (
        <Link to="/">
          <div style={{ display: "flex", alignItems: "center"}}>
            <HomeOutlined style={{ marginRight: "10px" }} />
            {!collapsed && "หน้าหลัก"} {/* แสดงข้อความเฉพาะเมื่อเมนูไม่ถูกย่อ */}
          </div>
        </Link>
      ),
    },
    register: {
      key: "register",
      label: "ทะเบียน",
      icon: <UserOutlined />,
      children: [
        { key: "patients", label: <Link to="/patient"><div>คนไข้</div></Link> },
        { key: "employee", label: <Link to="/employee"><div>พนักงาน</div></Link> }, // employee
      ],
    },
    finance: {
      key: "finance",
      label: "การเงิน",
      icon: <DollarOutlined />,
      children: [
        { key: "paymentList", label: <Link to="/paymentList"><div>รอชำระเงิน</div></Link> },
        { key: "savePayment", label: <Link to="/savePayment"><div>บันทึกชำระเงิน</div></Link> }, // savePayment
        
      ],
    },
    treatment: {
      key: "treatment",
      label: "การรักษา",
      icon: <HeartOutlined />,
      children: [
        { key: "DentalRecord", label: <Link to="/DentalRecord"><div>บันทึกการรักษา</div></Link> },
        { key: "AddDentalRecord", label: <Link to="/AddDentalRecord"><div>เพิ่มการรักษา</div></Link> },
      ],
    },
    schedule: {
      key: "Schedule",
      label: "นัดหมาย",
      icon: <CalendarOutlined />,
      children: [
        { key: "Schedule", label: <Link to="/viewschedule"><div>กำหนดการ</div></Link> },
        { key: "ScheduleCreate", label: <Link to="/viewschedule/schedulecreate"><div>สร้างการนัดหมาย</div></Link> },
        { key: "ScheduleRecord", label: <Link to="/viewschedule/schedulerecord"><div>ประวัตินัดหมาย</div></Link> },
      ],
    },
    stock: {
      key: "stock",
      label: "คลังวัสดุอุปกรณ์",
      icon: <ProductOutlined />,
      children: [
        { key: "equipment", label: <Link to="/Equipments"><div>อุปกรณ์</div></Link> },
        { key: "requisition", label: <Link to="/Requisitions"><div>รายการเบิก</div></Link> },
        { key: "restock", label: <Link to="/Restocks"><div>รายการเติม</div></Link> },
      ],
    },
  };
  
  const items = [
    ...(employeePositionID === 1
      ? [
          menuItems.dashbord,
          {...menuItems.register, children: menuItems.register.children.filter(item => item.key !== "employee")},

          { ...menuItems.finance, children: menuItems.finance.children.filter(item => item.key === "savePayment") }, // เห็นเฉพาะ savePayment
          menuItems.treatment, // treatment
          
        ]
      : []),
    ...(employeePositionID === 2
      ? [ 
          menuItems.dashbord,
          { ...menuItems.register, children: menuItems.register.children.filter(item => item.key !== "employee") }, // ไม่เห็น employee
          menuItems.schedule, // schedule
          
          { ...menuItems.finance, children: menuItems.finance.children.filter(item => item.key === "savePayment"|| item.key === "paymentList") }, // เห็นเฉพาะ savePayment, ไม่เห็น paymentList
          menuItems.stock, // stock
        ]
      : []),
    ...(employeePositionID === 3
      ? [menuItems.dashbord,menuItems.register, menuItems.schedule, menuItems.finance, menuItems.treatment, menuItems.stock] // เห็นทั้งหมด
      : []),
  ];
  
  
  
  

  const Logout = () => {
    localStorage.clear();
    messageApi.success("Logout successful");
    setTimeout(() => {
      location.href = "/";
    }, 2000);
  };

  const menu = (
    <Menu style={{ width: "200px", marginRight: "30px", paddingLeft: "10px" , paddingRight: "10px", paddingBottom: "10px"}}>
      <div 
        style={{ 
          textAlign: "center", 
          display: "flex", 
          justifyContent: "left", 
          alignItems: "center", // จัดแนวกลางแนวตั้ง
          fontSize: 16,
          fontFamily: 'Noto Sans Thai',
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "12px"
        }}
      >
        <UserOutlined style={{ marginRight: "12px" }} /> {/* เพิ่ม margin */}
        {employeeName}
      </div>
      
      <Menu.Item 
        key="logout" 
        onClick={Logout} 
        style={{ 
          textAlign: "left", 
          display: "flex", 
          justifyContent: "left", // เปลี่ยนเป็น left เพื่อให้ตรงกัน 
          alignItems: "center", // จัดให้ icon และข้อความอยู่กลาง
          fontSize: 16,
          fontFamily: 'Noto Sans Thai', 
          color: "red"
          
        }}
      >
        <LogoutOutlined style={{ marginRight: "8px" }} /> {/* เพิ่ม margin */}
        ออกจากระบบ
      </Menu.Item>
    </Menu>

  );

  useEffect(() => {
    // เรียกใช้ service เพื่อดึงข้อมูลพนักงานที่ล็อกอิน
    GetLoggedInEmployee().then((res) => {
      if (res && res.employee) {
        setEmployeeName(res.employee.FirstName + " " + res.employee.LastName+ " "); // สมมติว่ามี FirstName และ LastName
        setEmployeePositionID(res.employee.JobPositionID);
      } else {
        setEmployeeName("Guest"); // ถ้าไม่มีข้อมูล
      }
    });
  }, []);
  
  
  return (
    
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
        
          collapsible={false}
          collapsed={collapsed}
          style={{
            background:
              "linear-gradient(180deg, #22225E 0%, #22225E 20%, #7DC9D1 80%, #42C2C2 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between", // เปลี่ยนเป็น space-between เพื่อให้ปุ่มและข้อความอยู่ชิดกัน
              alignItems: "center", // จัดให้อยู่กึ่งกลางในแนวตั้ง
              marginTop: 20,
              marginBottom: 20,
              marginLeft: "17px", // เพิ่ม margin-left เพื่อขยับปุ่มและข้อความไปทางขวา
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                icon={<MenuOutlined style={{ color: "white" }} />}
                shape="circle"
                size="large"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  width: "32px",
                  height: "32px",
                }}
                onClick={toggleMenu} // เรียกใช้ฟังก์ชัน toggleMenu เมื่อกดปุ่ม
              />
              {showText && (
                <span
                  style={{ marginLeft: "0px", fontSize: 12, color: "white" }}
                >
                  SAMGT-PLEASANT
                </span>
              )}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <Menu
              theme="dark"
              mode="inline"
              inlineCollapsed={collapsed}
              items={items}
              style={{
                marginTop: "auto", // ดันรายการเมนูลงไปด้านล่าง
                background: "transparent",
              }}
            />
          </div>
          {/* <Button onClick={Logout} style={{ margin: 16, marginTop: "auto" }}>
            ออกจากระบบ
          </Button> */}
        </Sider>
        <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* แสดงชื่อ Employee ที่ล็อกอิน */}
          <div></div>

          <div style= {{marginRight: "20px"}}>
            {/* Avatar อยู่ใน Dropdown */}
            <Dropdown overlay={menu} placement="bottomRight">
              <Avatar
                style={{ cursor: "pointer" }}
                size="large"
                icon={<UserOutlined />}
                
              />
            </Dropdown>
          </div>
        </Header>
          <Content style={{ padding: "0 16px", backgroundColor: "#ffff"  }}>
            <div style={{ padding: 24, background: "#fff", minHeight: "100%" }}>
              <Routes>
                
              <Route path="/" element={<Dashbord />} />
                
                  <>
                    <Route path="/viewschedule" element={<ViewSchedule />} />
                    <Route path="/viewschedule/schedulecreate" element={<CreateSchedule />} />
                    <Route path="/viewschedule/editschedule/edit/:id" element={<EditSchedule />} />
                    <Route path="/viewschedule/schedulerecord" element={<RecordSchedule />} />
                  </>

                
                {/* ระบบ Equipment */}
                <Route path="/Equipments" element={<Equipments />} />
                <Route path="/CreateEq" element={<CreateEq />} />
                <Route path="/Equipments/CreateEq" element={<CreateEq />} />
                <Route path="/EditEq" element={<EditEq />} />
                <Route path="/Equipments/EditEq/:id" element={<EditEq />} />
                <Route path="/Requisitions" element={<Requisitions />} />
                <Route path="/Equipments/RequestEq/:id" element={<RequestEq />} />
                <Route path="/LittleEq" element={<LittleEq />} />
                <Route path="/Equipments/LittleEq" element={<LittleEq />} />
                <Route path="/Equipments/LittleEq/AddEq/:id" element={<AddEq/>} />
                <Route path="/AddEq" element={<AddEq />} />
                <Route path="/RequestEq" element={<RequestEq />} />
                <Route path="/Restocks" element={<Restocks />} />
                <Route path="/AddEq/:id" element={<AddEq />} />
                <Route path="/RequestEq/:id" element={<RequestEq />} />
                <Route path="/EditEq/:id" element={<EditEq />} />

                //
                
                <Route path="/customer" element={<div>Manage Patient Records</div>} />
                <Route path="/employee/create" element={<EmployeeCreate/>} />
                <Route path="/employee/edit/:id" element={<EmployeeEdit/>} />
                <Route path="/manage-patients" element={<div>Manage Patient Records</div>} />
                <Route path="/employee" element={<Employee />} />
                
                <Route path="/patient" element={<Patient/>} />
                <Route path="/patient/create" element={<PatientCreate/>} />
                <Route path="/patient/edit/:id" element={<PatientEdit/>} />
                //
                {/*ระบบ payment*/}
                <Route path="/dashbord" element={<Dashbord />} />{/*แก้ตรงนี้วันที่11/9/67*/}
                <Route path="/paymentList" element={<PaymentList />} />
                <Route path="/buttonPay" element={<PaymentList />} />
                <Route path="/paymentList/paymentPage/:id" element={<PaymentPage/>} />{/*แก้ตรงนี้วันที่11/9/67*/}
          
                <Route path="/savePayment" element={<SavePayment />} />
                //
                <Route path="/DentalRecord" element={<DentalRecord />} />
                <Route path="/EditRecord" element={<Customer />} />
                <Route path="/EditRecord" element={<EditRecord />} />
                <Route path="/EditRecord/:id" element={<EditRecord />} />
                <Route path="/AddDentalRecord" element={<AddDentalRecord />} />
                <Route path="/DentalRecordDetails/:id" element={<DentalRecordDetails />} />
                
                //
                <Route path="/employee" element={<Employee />} />
                <Route path="/patient" element={<Patient />} />
              </Routes>

            </div>
          </Content>
        </Layout>
      </Layout>
    
  );
};

export default App;
