import React, { useState, useEffect } from "react"; 
// import ฟังก์ชันจาก React ได้แก่ useState (จัดการ state) และ useEffect (จัดการ lifecycle)
import { Form, Input, Button, DatePicker, Select, message } from "antd"; 
// import components จาก Ant Design เช่น Form, Input, Button, DatePicker, Select, และ message
import { ClockCircleOutlined } from "@ant-design/icons"; 
// import ไอคอนนาฬิกาสำหรับใช้ในส่วนหัวของฟอร์ม
import "./create.css"; 
// import ไฟล์ CSS เพื่อจัดการกับ style ของหน้าฟอร์มนี้
import { TreatmentsInterface } from "../../../interfaces/schedule/ITreatment.ts"; 
// import อินเตอร์เฟสสำหรับข้อมูลการรักษา
import { SchedulesInterface } from "../../../interfaces/schedule/ISchedule.ts"; 
// import อินเตอร์เฟสสำหรับข้อมูลตารางนัดหมาย
import PatientCreate from "../../../pages/individual/patient/create/index.tsx"; 
// import หน้า PatientCreate เพื่อใช้ในการสร้างผู้ป่วยใหม่
import { GetTreatment, GetPatients, CreateSchedule } from "../../../services/https/schedule/index.tsx"; 
// import ฟังก์ชันสำหรับการดึงข้อมูลการรักษา, ข้อมูลคนไข้ และการสร้างตารางนัดจาก API
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom"; 
// import routing utilities จาก react-router-dom สำหรับการเปลี่ยนเส้นทางและการกำหนดเส้นทาง
import dayjs from 'dayjs'; 
// import dayjs สำหรับจัดการวันที่
import save from '../../../assets/schedule/savecreate.gif'; 
// import รูปภาพ gif สำหรับใช้เมื่อการบันทึกสำเร็จ

const { Option } = Select; 
// กำหนด Option จาก Select ของ Ant Design เพื่อใช้ในการสร้างตัวเลือก dropdown

function ScheduleCreate() {
  const [form] = Form.useForm(); 
  // ใช้ useForm() ของ Ant Design ในการสร้างและควบคุมฟอร์ม
  const navigate = useNavigate(); 
  // ใช้ useNavigate() เพื่อเปลี่ยนเส้นทางไปยังหน้าต่างๆ เมื่อจำเป็น
  const [treatments, setTreatments] = useState<TreatmentsInterface[]>([]); 
  // กำหนด state 'treatments' เป็น array เพื่อเก็บข้อมูลการรักษาที่จะถูกดึงจาก API
  const [patients, setPatients] = useState<{ value: string; label: string }[]>([]); 
  // กำหนด state 'patients' เป็น array เพื่อเก็บข้อมูลคนไข้ในรูปแบบ {value, label}
  const [messageApi, contextHolder] = message.useMessage(); 
  // กำหนดตัวแปร messageApi และ contextHolder เพื่อใช้ในการแสดงข้อความแจ้งเตือน

  // ฟังก์ชันสำหรับดึงข้อมูลการรักษาจาก backend (API)
  const getTreatment = async () => {
    try {
      let res = await GetTreatment(); 
      // เรียกใช้ฟังก์ชัน GetTreatment() ซึ่งเป็น async เพื่อดึงข้อมูลการรักษา
      if (res) {
        setTreatments(res); 
        // ถ้าได้ผลลัพธ์ response ให้ตั้งค่า treatments ด้วยข้อมูลที่ได้รับ
      }
    } catch (error) {
      console.error("Error fetching treatments:", error); 
      // แสดง error ถ้าการดึงข้อมูลไม่สำเร็จ
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลคนไข้จาก backend (API)
  const getPatients = async () => {
    try {
      let res = await GetPatients(); 
      // เรียกใช้ฟังก์ชัน GetPatients() เพื่อดึงข้อมูลคนไข้
      if (res) {
        const patientOptions = res.map((patient: any) => ({
          value: patient.Tel, 
          // ใช้เบอร์โทรของคนไข้เป็น value สำหรับ dropdown
          label: `${patient.Tel} ( ${patient.FirstName} ${patient.LastName} ) `, 
          // ใช้ชื่อเต็มและเบอร์โทรเป็น label ที่แสดงใน dropdown
        }));
        setPatients(patientOptions); 
        // ตั้งค่า state 'patients' ด้วยข้อมูลที่จัดรูปแบบแล้ว
      }
    } catch (error) {
      console.error("Error fetching patients:", error); 
      // แสดง error ถ้าการดึงข้อมูลคนไข้ไม่สำเร็จ
    }
  };

  // ฟังก์ชันที่เรียกใช้เมื่อฟอร์มถูก submit สำเร็จ
  const onFinish = async (values: SchedulesInterface) => {
    let res = await CreateSchedule(values); 
    console.log('Response from CreateSchedule:', res);
    // เรียกใช้ฟังก์ชัน CreateSchedule() เพื่อบันทึกข้อมูลตารางนัดหมายที่ผู้ใช้กรอกลงฟอร์ม
    if (res.status) {
      messageApi.open({
        type: "error",
        content: res.message,
      }); 
      // ถ้าผลลัพธ์มีสถานะผิดพลาด ให้แสดงข้อความ error ด้วย message API
      setTimeout(function () {
        navigate("/viewschedule"); 
        // หลังจาก 2 วินาทีให้เปลี่ยนเส้นทางไปที่หน้าดูตารางนัดหมาย (viewschedule)
      }, 2000);
    } else {
      messageApi.open({
        type: "success",
        content: (
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '15px' ,color:'#22225E'}}>
            <img src={`${save}?${Date.now()}`} alt="Success" style={{ width: '40px', height: '40px', marginRight: '8px' }}/>
            <span>บันทึกการนัดหมายเสร็จสิ้น</span>
          </div>
        ),
        icon: ' ',
      }); 
      // ถ้าผลลัพธ์สำเร็จ แสดงข้อความพร้อมรูปภาพ GIF แจ้งความสำเร็จ
      setTimeout(function () {
        navigate("/viewschedule"); 
        // หลังจาก 2 วินาทีให้เปลี่ยนเส้นทางไปที่หน้าดูตารางนัดหมาย
      }, 2000);
    }
  };

  // เรียกฟังก์ชันนี้เมื่อ component ถูก mount ขึ้นมา (ตอนแรกเริ่ม)
  useEffect(() => {
    getTreatment(); 
    // ดึงข้อมูลการรักษา
    getPatients(); 
    // ดึงข้อมูลคนไข้
  }, []);

  // ฟังก์ชันที่ถูกเรียกเมื่อการ submit ฟอร์มไม่สำเร็จ
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo); 
    // แสดง log ข้อมูลเมื่อฟอร์มไม่ถูกต้อง
  };

  // ฟังก์ชันสำหรับยกเลิกการทำงานและเปลี่ยนเส้นทางกลับไปยังหน้าดูตารางนัดหมาย
  const onCancel = () => {
    navigate("/viewschedule"); 
    // เปลี่ยนเส้นทางไปยังหน้า viewschedule
  };

  return (
    <div className="appointment-form">
      {contextHolder} 
      {/* ใช้เพื่อแสดง context ของข้อความแจ้งเตือน */}
      <div className="headercreateschedule">
        <ClockCircleOutlined className="iconcreate" /> 
        {/* ไอคอนแสดงในส่วนหัวของฟอร์ม */}
        <h2>นัดหมายคนไข้</h2> 
        {/* หัวเรื่องของฟอร์ม */}
      </div>

      <Form
        form={form}
        name="appointment"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <div className="form-row">
          <Form.Item
            label="เบอร์โทร"
            name="tel"
            rules={[{ required: true, message: "กรุณากรอกเบอร์โทร!" }]}
            style={{ width: "100%" }}
          >
            <Select
              showSearch
              placeholder="ค้นหาเบอร์โทรหรือชื่อคนไข้"
              optionFilterProp="label" 
              // ฟิลเตอร์ dropdown ด้วย label (ค้นหาด้วยชื่อนามสกุล)
              options={patients} 
              // ใช้ข้อมูลคนไข้ที่ดึงมาจาก API
              style={{ width: "100%", height: "40px", lineHeight: "40px" }}
            />
          </Form.Item>

          <Form.Item
            name="TreatmentID"
            label="การรักษา"
            rules={[{ required: true, message: "กรุณาเลือกการรักษา!" }]}
            style={{ width: "100%" }}
          >
            <Select
              placeholder="เลือกการรักษา"
              allowClear
              style={{ width: "100%", height: "40px", lineHeight: "40px" }}
            >
              {treatments.map((item) => (
                <Option value={item.ID} key={item.TreatmentName}>
                  {item.TreatmentName}
                </Option>
              ))}
              {/* แสดงตัวเลือกการรักษาจากข้อมูลที่ดึงมาจาก API */}
            </Select>
          </Form.Item>
        </div>

        <div className="form-row">
          <Form.Item
            label="วันนัดหมาย"
            name="Date"
            rules={[{ required: true, message: "กรุณาเลือกวันนัดหมาย!" }]}
            style={{ width: "100%" }}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "47.5%", height: "40px", lineHeight: "40px" }}
              disabledDate={(current) => {
                return current && current < dayjs().startOf("day");
                // ไม่สามารถเลือกวันที่ย้อนหลังได้
              }}
            />
          </Form.Item>
        </div>

        <div className="patient-status">
          <Link to="/patient/create">
            สำหรับคนไข้รายใหม่
          </Link>
        </div>

        <Form.Item>
          <div className="form-actions">
            <Button type="primary" htmlType="submit" className="submit-button-schedule-create">
              ยืนยัน
            </Button>

            <Button htmlType="button" className="cancel-button-schedule-create" onClick={onCancel}>
              ยกเลิก
            </Button>
          </div>
        </Form.Item>
      </Form>

      <Routes>
        {/* <Route path="/schedule" element={<Schedule />} />
        <Route path="/viewschedule" element={<ViewSchedule />} /> */}
        <Route path="/patient/create" element={<PatientCreate />} />
      </Routes>
    </div>
  );
}

export default ScheduleCreate;
