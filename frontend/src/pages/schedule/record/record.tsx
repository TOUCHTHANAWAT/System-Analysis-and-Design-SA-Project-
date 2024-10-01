import React, { useState, useEffect } from "react";
import { Button, Modal, message, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined,SortAscendingOutlined, PhoneOutlined,CalendarOutlined} from "@ant-design/icons";
import { GetAllSchedule, DeleteScheduleByID, GetPatients, GetTreatment, GetTstatus } from "../../../services/https/schedule";
import { SchedulesInterface } from "../../../interfaces/schedule/ISchedule";
import { PatientsInterface } from "../../../interfaces/individual/IPatient";
import { TreatmentsInterface } from "../../../interfaces/schedule/ITreatment";
import { TstatusInterface } from "../../../interfaces/schedule/ITstatus";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import './record.css';
import new_logo from "../../../assets/stock/new_logo.png";
import { Pagination } from 'antd';

const ScheduleRecord: React.FC = () => {
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState<SchedulesInterface[]>([]);
  const [patients, setPatients] = useState<PatientsInterface[]>([]);
  
  //
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  //

  const [treatments, setTreatments] = useState<TreatmentsInterface[]>([]);
  const [statuses, setStatuses] = useState<TstatusInterface[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<SchedulesInterface[]>([]);
  const [sortOption, setSortOption] = useState<string>("Sort by : "); // สร้าง state สำหรับเก็บตัวเลือก sort
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState<string>("");
  const [deleteId, setDeleteId] = useState<number | null>(null); // ปรับเป็น null

  // ตาราง limit
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(5); // กำหนดจำนวนแถวต่อหน้าเป็น 5
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const indexOfLastRecord = currentPage * pageSize;
  const indexOfFirstRecord = indexOfLastRecord - pageSize;
  const currentRecords = filteredSchedules.slice(indexOfFirstRecord, indexOfLastRecord);
  //

  // ดึงข้อมูลผู้ป่วยทั้งหมด
  const getAllPatients = async () => {
    try {
      let patientRes = await GetPatients();
      if (patientRes) {
        setPatients(patientRes);
        console.log('Patients retrieved:', patientRes);
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ป่วย");
    }
  };

  // ดึงข้อมูลการรักษาทั้งหมด
  const getAllTreatments = async () => {
    try {
      let treatmentRes = await GetTreatment();
      if (treatmentRes) {
        setTreatments(treatmentRes);
        console.log('Treatments retrieved:', treatmentRes);
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูลการรักษา");
    }
  };

  // ดึงข้อมูลนัดหมายทั้งหมด
  const getAllSchedules = async () => {
    try {
      let scheduleRes = await GetAllSchedule();
      if (scheduleRes) {
        console.log('Schedules retrieved:', scheduleRes); // ตรวจสอบข้อมูล Schedule ที่ดึงมา
        setSchedules(scheduleRes);
        setFilteredSchedules(scheduleRes);
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูลนัดหมาย");
    }
  };

  const showModal = (record: SchedulesInterface) => {
  if (record.ID !== undefined) {
    setModalText(`คุณต้องการลบข้อมูลการนัดหมาย "ID =${record.ID}" หรือไม่ ?`);
    setDeleteId(record.ID);
    setOpen(true);
  } else {
    messageApi.error("ไม่สามารถลบรายการที่ไม่มี ID ได้");
  }
};

  // ดึงข้อมูลสถานะการรักษาทั้งหมด
  const getAllTstatus = async () => {
    try {
      let tstatusRes = await GetTstatus();
      if (tstatusRes) {
        console.log('Tstatuses retrieved:', tstatusRes); // ตรวจสอบข้อมูล Tstatus ที่ดึงมา
        setStatuses(tstatusRes);
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูลสถานะการรักษา");
    }
  };

  useEffect(() => {
    getAllSchedules();
    getAllPatients();
    getAllTreatments();
    getAllTstatus();
  }, []);

  // ฟังก์ชันสำหรับ sort ข้อมูล
  const handleSort = (type: string) => {
    let sortedSchedules = [...filteredSchedules];
    
    if (type === "status") {
      sortedSchedules.sort((scheduleA: SchedulesInterface, scheduleB: SchedulesInterface) => {
        const statusA = statuses.find(status => status.ID === scheduleA.TstatusID)?.TStatusName || "";
        const statusB = statuses.find(status => status.ID === scheduleB.TstatusID)?.TStatusName || "";
        return statusA.localeCompare(statusB);
      });
    } else if (type === "scheduleId") {
      sortedSchedules.sort((scheduleA: SchedulesInterface, scheduleB: SchedulesInterface) => 
        (scheduleA.ID ?? 0) - (scheduleB.ID ?? 0)
      );
    } else if (type === "patientName") {
      sortedSchedules.sort((scheduleA: SchedulesInterface, scheduleB: SchedulesInterface) => {
        const patientA = patients.find(patient => patient.ID === scheduleA.PatientID)?.FirstName || "";
        const patientB = patients.find(patient => patient.ID === scheduleB.PatientID)?.FirstName || "";
        return patientA.localeCompare(patientB);
      });
    } else if (type === "date") {
      sortedSchedules.sort((scheduleA: SchedulesInterface, scheduleB: SchedulesInterface) => {
        const dateA = scheduleA.Date ? new Date(scheduleA.Date).getTime() : 0;
        const dateB = scheduleB.Date ? new Date(scheduleB.Date).getTime() : 0;
        return dateA - dateB;
      });
    }
    
    setFilteredSchedules(sortedSchedules);
    setSortOption(type);
  };
  
  
  

  const handleOk = async () => {
    if (deleteId !== null) { // ตรวจสอบว่า deleteId ไม่ใช่ null
      setConfirmLoading(true);
      try {
        let res = await DeleteScheduleByID(deleteId);
        if (res) {
          messageApi.success("ลบข้อมูลสำเร็จ");
          getAllSchedules(); // ดึงข้อมูลใหม่หลังจากการลบ
        } else {
          messageApi.error("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
      } catch (error) {
        messageApi.error("เกิดข้อผิดพลาดในการลบข้อมูล");
      } finally {
        setConfirmLoading(false);
        setOpen(false);
      }
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handlePatientChange = (value: number | null | undefined) => {
    console.log('Value received from Select:', value);
    setSelectedPatient(value ?? null);
    
    if (value === null || value === undefined) {
        setFilteredSchedules([...schedules]); // แสดงบันทึกทั้งหมด
    } else {
      const filteredData = schedules.filter(record => record.PatientID === value);
      setFilteredSchedules(filteredData);
    }
  };

  // ฟังก์ชันสำหรับการจัดรูปแบบเบอร์โทร
const formatPhoneNumber = (phoneNumber: string | undefined) => {
    if (!phoneNumber) return '';
    const cleaned = ('' + phoneNumber).replace(/\D/g, ''); // ลบเครื่องหมายที่ไม่ใช่ตัวเลข
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };
  
  return (

    <div>
      {contextHolder}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={new_logo} alt="logo" className="logo1" />
      </div>
    <div className="schedule-records">
      <header className="schedulerecord-header">
        <h1>ประวัติการนัดหมาย</h1>
        <div className="schedulerecord-controls">
          <div className="controls-group">
            <Select
              showSearch
              placeholder="ค้นหาเบอร์โทรหรือชื่อผู้ป่วย"
              style={{ width: 250, height: "35px", marginRight: "5px" }}
              onChange={handlePatientChange}
              allowClear
              onClear={() => handlePatientChange(null)} // จัดการเมื่อกดกากบาท
              optionFilterProp="label"
              filterOption={(input, option) =>
                String(option?.label).toLowerCase().includes(input.toLowerCase())
              }
            >
              {patients.map((patient) => (
                <Select.Option
                  key={patient.ID}
                  value={patient.ID}
                  label={`${patient.FirstName} ${patient.LastName} ${patient.Tel}`}
                >
                  {patient.FirstName} {patient.LastName} - {patient.Tel}
                </Select.Option>
              ))}
            </Select>
  
            {/* ปุ่มสำหรับการ sort */}
            <Select
              placeholder="เรียงตาม"
              style={{ width: 180, height: "35px", marginLeft: 20 }}
              onChange={handleSort}
              value={sortOption}
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) =>
                String(option?.label).toLowerCase().includes(input.toLowerCase())
              }
            >
              <Select.Option value="status">Sort by : Status</Select.Option>
              <Select.Option value="scheduleId">Sort by : ScheduleID</Select.Option>
              <Select.Option value="patientName">Sort by : PatientName</Select.Option>
              <Select.Option value="date">Sort by : Date</Select.Option>
            </Select>
          </div>
        </div>
      </header>
  
      {/* ตาราง */}
      <div className="table-container">
        <table className="schedulerecord-records-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ชื่อคนไข้</th>
              <th>เบอร์ติดต่อ <PhoneOutlined /> </th>
              <th>วันนัดหมาย</th>
              <th>การรักษา</th>
              <th>สถานะการนัดหมาย</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((schedule) => {
              const patient = patients.find((patient) => patient.ID === schedule.PatientID);
              const treatment = treatments.find((treatment) => treatment.ID === schedule.TreatmentID);
              const tstatus = statuses.find((status) => status.ID === schedule.TstatusID);
    
              return (
                <tr key={schedule.ID}>
                  <td>{schedule.ID}</td>
                  <td>{patient?.FirstName} {patient?.LastName}</td>
                  <td>{formatPhoneNumber(patient?.Tel)}</td>
                  <td>{dayjs(schedule.Date).format("DD-MM-YYYY")}</td>
                  <td>{treatment?.TreatmentName}</td>
                  <td>
                    <span className={`tstatuscolor ${tstatus?.TStatusName}`}>
                      {tstatus?.TStatusName}
                    </span>
                    
                  </td>

                  <td>
                    <Button
                      onClick={() => navigate(`/viewschedule/editschedule/edit/${schedule.ID}`)}
                      shape="circle"
                      icon={<EditOutlined />}
                      size={"large"}
                    />
                    <Button
                      onClick={() => showModal(schedule)}
                      style={{ marginLeft: 10 }}
                      shape="circle"
                      icon={<DeleteOutlined />}
                      size={"large"}
                      danger
                    />
                  </td>
                </tr>
              );
            })}

          </tbody>
        </table>
      </div>      
      {/* Pagination */}
        <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredSchedules.length}
                onChange={handlePageChange}
            />
        </div>

  
      {contextHolder}
  
      <Modal
        title="ยืนยันการลบ"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </div>
    </div> 
  );
  
};

export default ScheduleRecord;
