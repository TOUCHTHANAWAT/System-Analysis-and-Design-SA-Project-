import React, { useEffect, useState } from 'react';
import { Calendar, List, Button, message } from 'antd';
import { EditOutlined, PlusOutlined, CalendarOutlined, DeleteOutlined,CheckOutlined } from '@ant-design/icons';
import './view.css';
import Schedule from "../create/create.tsx";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { GetSchedulesByDate, UpdateSchedule, UpdateScheduleStatus } from "../../../services/https/schedule/index.tsx";
import { SchedulesInterface } from '../../../interfaces/schedule/ISchedule.ts';
import new_logo from "../../../assets/stock/new_logo.png";
import check from '../../../assets/schedule/check.gif'

const ScheduleView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());      // เก็บค่าวันที่เลือกใน box ปฎิทิน
  const [appointments, setAppointments] = useState<any[]>([]);                    // เก็บข้อมูลการนัดหมายของวันที่เลือก
  const [messageApi, contextHolder] = message.useMessage();
  //
  const [UpdateId, setUpdateId] = useState<Number>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  //
  const navigate = useNavigate();

  const fetchAppointments = async (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];  // แปลงวันที่เป็น YYYY-MM-DD
    const data = await GetSchedulesByDate(formattedDate);     // เรียก API
    // console.log(date)
    if (data && data.length > 0) {
      setAppointments(data);  // อัปเดตข้อมูลนัดหมาย
    } else {
      setAppointments([]);    // ถ้าไม่มีข้อมูลนัดหมาย ให้ล้าง appointments
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchAppointments(selectedDate);
    }
  }, [selectedDate]);

  const onDateChange = (date: any) => {
    setSelectedDate(date?.toDate());
    
  };


  // const Finish = async (values: SchedulesInterface) => {
  //   let res = await UpdateSchedule(values); // ส่งค่า values ที่แก้ไขแล้ว
  //   if (res) {
  //     messageApi.open({
  //       type: "success",
  //       content: res.message,
  //     });
  //     setTimeout(function () {
  //       navigate("/viewschedule/schedulecreate");
  //     }, 2000);
  //   } else {
  //     messageApi.open({
  //       type: "error",
  //       content: res.message,
  //     });
  //   }
  // };


  const formatTel = (tel: string) => {
    if (!tel || tel.length !== 10) {
      return tel; // กรณีที่เบอร์โทรไม่ครบ 10 หลัก จะส่งคืนค่าเดิม
    }
  
    return `${tel.substring(0, 3)}-${tel.substring(3, 6)}-${tel.substring(6)}`;
  };

  return (
    
    
    <div>
      
      
      {contextHolder}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={new_logo} alt="logo" className="logo1" />
      </div>
      <div className="schedule-header">
        <CalendarOutlined className="schedule-icon" />
        <span className="schedule-title">Schedule</span>
        
      </div>

      {/* <div className="schedule-container">
        <div className="calendar-section">
          <Calendar fullscreen={false} onSelect={onDateChange} />
          <div className="add-button-container">
            <Link to="/schedule">
              <Button className="add-button" type="primary" shape="circle" icon={<PlusOutlined />} />
            </Link>
          </div>
        </div> */}
        <div className="schedule-container">
          <div className="calendar-section">
            <Calendar fullscreen={false} onSelect={onDateChange} />
            <div className="add-button-container">
              <Link to="/viewschedule/schedulecreate">
                <button className="icon-btn add-btn">
                  <div className="add-icon"></div>
                  <div className="btn-txt"> Add </div>
                </button>
              </Link>
            </div>
          </div>
      

        <div className="appointments-section">
        <List
            itemLayout="horizontal"
            dataSource={appointments}
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
                    // onClick={() => navigate(`/editschedule/edit/${item.ID}`)} 
                    onClick={() => navigate(`/viewschedule/editschedule/edit/${item.ID}`)} 
                  />,
                  <Button
                      onClick={() => {
                        UpdateScheduleStatus(item.ID);

                        
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

                        // ตั้งเวลา 2 วินาทีก่อนที่จะรีโหลดหน้าใหม่
                        setTimeout(() => {
                          window.location.reload();
                        }, 2000);
                      }}
                      style={{ marginLeft: 0 }}
                      shape="circle"
                      icon={<CheckOutlined />}
                      size={"large"}
                    />
                  
                ]}
                style={{ borderBottom: 'none' }}
              >
                
                <List.Item.Meta
                    title={<span style={{ color: "#22225E" }}>{item.TreatmentName}</span>}  // เปลี่ยนสีเฉพาะ title
                    description={`${item.FirstName} ${item.LastName} เบอร์ ${formatTel(item.Tel)}`}  // แสดงทั้งชื่อจริงและนามสกุล
                />

              
              </List.Item>
              </>
            )}
            
            locale={{ emptyText: 'ไม่มีการนัดหมายในวันนี้' }}
          />
            
        </div>

        <Routes>
          <Route path="/viewschedule/schedulecreate" element={<Schedule />} />
          
        </Routes>
      </div>
    </div>
  );
};

export default ScheduleView;