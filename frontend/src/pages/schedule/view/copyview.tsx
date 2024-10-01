import React, { useEffect, useState } from 'react';
import { Calendar, List, Button, message } from 'antd';
import { EditOutlined, PlusOutlined, CalendarOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import './view.css';
import Schedule from "../create/create.tsx";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { GetSchedulesByDate, UpdateSchedule, UpdateScheduleStatus } from "../../../services/https/schedule/index.tsx";
import { SchedulesInterface } from '../../../interfaces/schedule/ISchedule.ts';
import new_logo from "../../../assets/stock/new_logo.png";
import check from '../../../assets/schedule/check.gif'

// คอมโพเนนต์หลักสำหรับการแสดงตารางนัดหมาย
const ScheduleView: React.FC = () => {
  // State สำหรับเก็บวันที่ที่ผู้ใช้เลือกจากปฏิทิน
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());      
  
  // State สำหรับเก็บข้อมูลนัดหมายที่ดึงมาจาก API
  const [appointments, setAppointments] = useState<any[]>([]);
  
  // Ant Design message API สำหรับแสดงข้อความสถานะต่าง ๆ
  const [messageApi, contextHolder] = message.useMessage();
  
  // State สำหรับเก็บ ID ของนัดหมายที่ต้องการอัปเดต (ถ้ามี)
  const [UpdateId, setUpdateId] = useState<Number>();
  
  // State สำหรับจัดการสถานะของการโหลด
  const [confirmLoading, setConfirmLoading] = useState(false);
  
  // ใช้สำหรับนำทางผู้ใช้ไปยังหน้าอื่น ๆ ในแอป
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับดึงข้อมูลนัดหมายตามวันที่ที่เลือก
  const fetchAppointments = async (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];  // แปลงวันที่เป็นรูปแบบ YYYY-MM-DD จาก Thu Sep 26 2024 19:08:26 GMT+0700 (เวลาอินโดจีน)
    const data = await GetSchedulesByDate(formattedDate);     // เรียก API เพื่อดึงข้อมูลนัดหมายตามวันที่
    console.log(data)
    if (data && data.length > 0) {
      setAppointments(data);  // อัปเดต state ของ appointments หากมีข้อมูลนัดหมาย
    } else {
      setAppointments([]);    // ถ้าไม่มีข้อมูลนัดหมาย ล้าง state ของ appointments
    }
  };

  // useEffect จะถูกเรียกเมื่อ selectedDate มีการเปลี่ยนแปลง
  // useEffect จะทำงาน (trigger) เมื่อมีการเปลี่ยนแปลงค่าในตัวแปรที่ถูกกำหนดไว้ใน dependency array ซึ่งอยู่ในตำแหน่งที่สองของ useEffect
  useEffect(() => {
    if (selectedDate) {
      fetchAppointments(selectedDate);  // ดึงข้อมูลนัดหมายใหม่เมื่อเลือกวันที่ใหม่
    }
  }, [selectedDate]);

  // ฟังก์ชันสำหรับจัดการเมื่อผู้ใช้เลือกวันที่ใหม่ในปฏิทิน
  const onDateChange = (date: any) => {
    setSelectedDate(date?.toDate());  // อัปเดต state ของ selectedDate ด้วยวันที่ใหม่
  };

  // ฟังก์ชันสำหรับอัปเดตข้อมูลนัดหมายที่แก้ไขแล้ว
  // const Finish = async (values: SchedulesInterface) => {
  //   let res = await UpdateSchedule(values); // เรียก API เพื่ออัปเดตข้อมูลนัดหมาย
  //   if (res) {
  //     messageApi.open({
  //       type: "success",
  //       content: res.message,  // แสดงข้อความเมื่ออัปเดตสำเร็จ
  //     });
  //     setTimeout(function () {
  //       navigate("/viewschedule/schedulecreate");  // นำทางผู้ใช้ไปยังหน้าเพิ่มนัดหมายใหม่หลังจาก 2 วินาที
  //     }, 2000);
  //   } else {
  //     messageApi.open({
  //       type: "error",
  //       content: res.message,  // แสดงข้อความเมื่อเกิดข้อผิดพลาด
  //     });
  //   }
  // };

  return (
    <div>
      {contextHolder} {/* แสดง context holder ของ message API */}
      
      {/* ส่วนหัวของหน้า ที่ประกอบด้วยโลโก้และชื่อหน้า */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={new_logo} alt="logo" className="logo1" />
      </div>
      <div className="schedule-header">
        <CalendarOutlined className="schedule-icon" />
        <span className="schedule-title">Schedule</span>
      </div>

      {/* ส่วนของปฏิทินและปุ่มเพิ่มนัดหมาย */}
      <div className="schedule-container">
        <div className="calendar-section">
          <Calendar fullscreen={false} onSelect={onDateChange} /> {/* ปฏิทินที่ไม่แสดงแบบเต็มจอ */}
          <div className="add-button-container">
            <Link to="/viewschedule/schedulecreate">
              <button className="icon-btn add-btn">
                <div className="add-icon"></div>
                <div className="btn-txt"> Add </div>
              </button>
            </Link>
          </div>
        </div>

        {/* ส่วนของรายการนัดหมายที่จะแสดงตามวันที่เลือก */}
        <div className="appointments-section">
          <List
            itemLayout="horizontal"
            dataSource={appointments}  // ข้อมูลนัดหมายที่จะถูกแสดง
            renderItem={(item) => (
              <>
                <List.Item
                  actions={[
                    <Button 
                      icon={<EditOutlined />} 
                      shape="circle"
                      size={"large"}
                      key="edit"
                      style={{ marginRight: 0 }}
                      onClick={() => navigate(`/viewschedule/editschedule/edit/${item.ID}`)}  // นำทางไปยังหน้าแก้ไขนัดหมาย
                    />,
                    <Button
                      onClick={() => {
                        UpdateScheduleStatus(item.ID);  // อัปเดตสถานะนัดหมายเป็น "เสร็จสิ้น"

                        // แสดงข้อความเมื่ออัปเดตสำเร็จ
                        messageApi.open({
                          type: "success",
                          content: (
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '15px', color: '#22225E' }}>
                              <img src={`${check}?${Date.now()}`} alt="Success" style={{ width: '40px', height: '40px', marginRight: '8px' }} />
                              <span>นัดหมายสำเร็จ</span>
                            </div>
                          ),
                          icon: ' ', // ใช้ null เพื่อลบไอคอนเริ่มต้น
                        });

                        // รีโหลดหน้าใหม่หลังจาก 3 วินาที
                        setTimeout(() => {
                          window.location.reload();
                        }, 3000);
                      }}
                      style={{ marginLeft: 0 }}
                      shape="circle"
                      icon={<CheckOutlined />}
                      size={"large"}
                    />
                  ]}
                  style={{ borderBottom: 'none' }}  // ลบเส้นใต้รายการ
                >
                  <List.Item.Meta
                    title={<span style={{ color: "#22225E" }}>{item.TreatmentName}</span>}  // แสดงชื่อการรักษา
                    description={`${item.FirstName} ${item.LastName} Tel.${item.Tel}`}  // แสดงชื่อและเบอร์โทรศัพท์ของผู้ป่วย
                  />
                </List.Item>
              </>
            )}
            locale={{ emptyText: 'ไม่มีการนัดหมายในวันนี้' }}  // ข้อความที่จะแสดงเมื่อไม่มีนัดหมายในวันนี้
          />
        </div>

        {/* กำหนดเส้นทางสำหรับหน้า Schedule Create */}
        <Routes>
          <Route path="/viewschedule/schedulecreate" element={<Schedule />} />
        </Routes>
      </div>
    </div>
  );
};

export default ScheduleView;
