import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, message, Modal  } from "antd";
import { ClockCircleOutlined,ExclamationCircleOutlined  } from "@ant-design/icons";
import { TreatmentsInterface } from "../../../interfaces/schedule/ITreatment.ts";
import { SchedulesInterface } from "../../../interfaces/schedule/ISchedule.ts";
import { GetTreatment, UpdateSchedule, GetScheduleById } from "../../../services/https/schedule/index.tsx";
import dayjs from "dayjs";
import ViewSchedule from "../view/view.tsx";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate,useParams } from "react-router-dom";

import edit from '../../../assets/schedule/edit.gif'

const { Option } = Select;

function ScheduleEdit() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [treatments, setTreatments] = useState<TreatmentsInterface[]>([]);
  const [schedule, setSchedule] = useState<SchedulesInterface>();
  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams(); // รับ id จาก URL

  // ฟังก์ชันดึงข้อมูลการรักษา
  const getTreatment = async () => {
    try {
      let res = await GetTreatment();
      if (res) {
        setTreatments(res);
      }
    } catch (error) {
      console.error("Error fetching treatments:", error);
    }
  };

  // ฟังก์ชันดึงข้อมูลการนัดหมายที่ต้องแก้ไข
  const getScheduleById = async () => {
    try {
      let res = await GetScheduleById(Number(id));
      if (res) {
        setSchedule(res);
        // ตั้งค่าเริ่มต้นในฟอร์มเมื่อดึงข้อมูลมาได้
        form.setFieldsValue({
          TreatmentID: res.TreatmentID,
          Date: dayjs(res.Date)
        });
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  };

  // ฟังก์ชันเปลี่ยน TstatusID เป็น 3
  // const handleChangeStatus = async () => {
  //   if (!schedule) return;
    
  //   const updatedValues: SchedulesInterface = {
  //     ID:           schedule.ID,
  //     Date:         schedule.Date,
  //     PatientID:    schedule.PatientID,
  //     TreatmentID:  schedule.TreatmentID,
  //     TstatusID:    3,
  //   };

  //   let res = await UpdateSchedule(updatedValues);
  //   console.log(res);

  //   if (res && res.message === "Updated successful") {
  //     messageApi.open({
  //       type: "success",
  //       content: "เปลี่ยนสถานะสำเร็จ",
  //     });
  //     setTimeout(() => {
  //       navigate("/viewschedule");
  //     }, 2000);
  //   } else {
  //     messageApi.open({
  //       type: "error",
  //       content: "เกิดข้อผิดพลาดในการเปลี่ยนสถานะ",
  //     });
  //   }
  // };
  const { confirm } = Modal;
  const showConfirm = () => {
    confirm({
      title: 'ยืนยันการเปลี่ยนสถานะ!',
      content: (
        <>
          คุณต้องการยกเลิกการนัดหมายนี้เป็น ใช่หรือไม่?
          <br />
        </>
      ),
      icon: <ExclamationCircleOutlined />,
      okText: 'ยืนยัน',
      cancelText: 'ยกเลิก',
      okButtonProps: {
        style: {
          backgroundColor: '#42C2C2',
          borderColor: '#42C2C2',
          color: '#fff',
        },
      },
      onOk() {
        // เรียกใช้ฟังก์ชัน handleChangeStatus เมื่อผู้ใช้กดยืนยัน
        handleChangeStatus();
      },
      onCancel() {
        console.log('ยกเลิกการเปลี่ยนสถานะ');
      },
    });
  };
  
  // ฟังก์ชันเปลี่ยน TstatusID เป็น 3
  const handleChangeStatus = async () => {
    if (!schedule) return;
  
    const updatedValues: SchedulesInterface = {
      ID: schedule.ID,
      Date: schedule.Date,
      PatientID: schedule.PatientID,
      TreatmentID: schedule.TreatmentID,
      TstatusID: 3,
    };
  
    let res = await UpdateSchedule(updatedValues);
    console.log(res);
  
    if (res && res.message === "Updated successful") {
      messageApi.open({
        type: "success",
        content: "เปลี่ยนสถานะสำเร็จ",
      });
      setTimeout(() => {
        navigate("/viewschedule");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการเปลี่ยนสถานะ",
      });
    }
  };

  const onFinish = async (values: SchedulesInterface) => {
    if (!schedule) return; 
    
    const updatedValues: SchedulesInterface = {
              
              ...values, // อัปเดตค่าที่ถูกกรอกใหม่
              ID: schedule.ID, 
              PatientID: schedule.PatientID,
              TstatusID: schedule.TstatusID
          };
    let res = await UpdateSchedule(updatedValues);

    if (res && res.status === true) {
      messageApi.open({
        type: "error", // แก้เป็น success
        content: "อัปเดตข้อมูลสำเร็จ",
      });
      
    } else {
      messageApi.open({
        type: "success",
        content: (
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '15px' ,color:'#22225E'}}>
            <img src={`${edit}?${Date.now()}`}  alt="Success" style={{ width: '40px', height: '40px', marginRight: '8px' }}/>
            <span>แก้ไขการนัดหมายสำเร็จ</span>
          </div>
           ),
           icon: ' ',
      });
    }
    
    setTimeout(function () {
      navigate("/viewschedule");
    }, 2000);

  };


  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onCancel = () => {
    navigate("/viewschedule");
  };

  // เรียกใช้ข้อมูลเมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    getTreatment(); // ดึงข้อมูลการรักษา
    getScheduleById(); // ดึงข้อมูลนัดหมายมาแสดงในฟอร์ม
  }, []);

  return (
    <div className="appointment-form">
      {contextHolder}
      <div className="headercreateschedule">
        <ClockCircleOutlined className="iconcreate" />
        <h2>แก้ไขการนัดหมาย</h2>
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
            </Select>
          </Form.Item>

          <Form.Item
            label="วันนัดหมาย"
            name="Date"
            rules={[{ required: true, message: "กรุณาเลือกวันนัดหมาย!" }]}
            style={{ width: "100%" }}
            
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "100%", height: "40px", lineHeight: "40px" }}
              disabledDate={(current) => {
                // ไม่สามารถเลือกวันที่ย้อนหลังได้
                return current && current < dayjs().startOf("day");
              }}
            />
          </Form.Item>
        </div>

        {/* เพิ่มข้อความสีแดงสำหรับเปลี่ยนสถานะ */}
        <Form.Item>
          <p
            className="change-status-text"
            // onClick={handleChangeStatus}
            onClick={showConfirm}
            style={{ color: "red", cursor: "pointer"}}
          >
            ยกเลิกการนัดหมาย
          </p>
        </Form.Item>

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
        {/* เพิ่มปุ่มสีแดง */}
        {/* <Form.Item>
          <Button
            type="default"
            onClick={handleChangeStatus}
            className="change-status-button"
            style={{ backgroundColor: "red", color: "white" }}
          >
            เปลี่ยนสถานะเป็นเสร็จสิ้น
          </Button>
        </Form.Item> */}
      </Form>
      <Routes>
        <Route path="/viewschedule" element={<ViewSchedule />} />
      </Routes>
    </div>
    
  );
}

export default ScheduleEdit;
