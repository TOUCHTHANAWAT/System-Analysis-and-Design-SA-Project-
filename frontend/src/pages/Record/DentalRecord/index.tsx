import React, { useState, useEffect } from "react";
import { Button, Modal, message, Select, Pagination } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, FileSearchOutlined } from "@ant-design/icons";
import { GetDentalRecords, GetPatients, DeleteDentalRecordByID } from "../../../services/https/dentalrecord";
import { DentalRecordInterface } from "../../../interfaces/dental/IDentalRecord";
import { PatientsInterface } from "../../../interfaces/dental/IPatient";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import './DentalRecord.css';
import document from '../../../assets/document.gif';
import new_logo from "../../../assets/new_logo.png";


const DentalRecord: React.FC = () => {
  const navigate = useNavigate();
  const [dentalRecords, setDentalRecords] = useState<DentalRecordInterface[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<DentalRecordInterface[]>([]);
  const [patients, setPatients] = useState<PatientsInterface[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState<string>("");
  const [deleteId, setDeleteId] = useState<number>();

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recordsPerPage = 6; // จำนวน record ที่จะแสดงต่อหน้า

  const getDentalRecords = async () => {
    try {
      let res = await GetDentalRecords();
      if (res) {
        setDentalRecords(res);
        setFilteredRecords(res); // แสดงทุก record โดยเริ่มต้น
        console.log('Dental records retrieved:', res);
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const getPatients = async () => {
    try {
      const res = await GetPatients();
      if (res) {
        setPatients(res);
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการดึงข้อมูลคนไข้");
    }
  };

  const handlePatientChange = (value: number | null | undefined) => {
    console.log('Value received from Select:', value);
    
    setSelectedPatient(value ?? null);
    
    if (value === null || value === undefined) {
      setFilteredRecords([...dentalRecords]); // แสดงบันทึกทั้งหมด
    } else {
      const filteredData = dentalRecords.filter(record => record.PatientID === value);
      setFilteredRecords(filteredData);
    }

    setCurrentPage(1); // รีเซ็ตหน้าหลังการกรองข้อมูลใหม่
  };

  useEffect(() => {
    getDentalRecords();
    getPatients();
  }, []);

  const showModal = (record: DentalRecordInterface) => {
    setModalText(`คุณต้องการลบข้อมูลบันทึกการรักษา "${record.ID}" หรือไม่ ?`);
    setDeleteId(record.ID);
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      let res = await DeleteDentalRecordByID(deleteId);
      if (res) {
        messageApi.success("ลบข้อมูลสำเร็จ");
        getDentalRecords();
      } else {
        messageApi.error("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    } catch (error) {
      messageApi.error("เกิดข้อผิดพลาดในการลบข้อมูล");
    } finally {
      setConfirmLoading(false);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };
  const maxDescriptionLength = 50; // กำหนดความยาวสูงสุดที่จะแสดง

const truncateDescription = (description: string) => {
  if (description.length > maxDescriptionLength) {
    return description.substring(0, maxDescriptionLength) + "..."; // ตัดข้อความและเพิ่ม "..."
  }
  return description; // ถ้าไม่ยาวเกินไปก็แสดงข้อความทั้งหมด
};

  // คำนวณ index ของข้อมูลที่จะแสดงในหน้า
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="treatment-records">
      <div className="centered-logo-wrapper">
  <img src={new_logo} alt="logo" className="centered-logo-image" />
</div>
      <header className="header">
        <img src={document} alt="logo" style={{width: '60px'}} /><h2>บันทึกการรักษา</h2>
        <div className="controls">
          <div className="controls-group">
            <Select
              showSearch
              placeholder="ค้นหาเบอร์โทรหรือชื่อคนไข้"
              style={{ width: 250, height: "40px", marginRight: 40 }}
              onChange={handlePatientChange}
              allowClear
              onClear={() => handlePatientChange(null)} // จัดการเมื่อกดกากบาท
              optionFilterProp="label"
              filterOption={(input, option) =>
                String(option?.label).toLowerCase().includes(input.toLowerCase())
              }
            >
              {patients.map(patient => (
                <Select.Option
                  key={patient.ID}
                  value={patient.ID}
                  label={`${patient.FirstName} ${patient.LastName} ${patient.Tel}`}
                >
                  {patient.FirstName} {patient.LastName} - {patient.Tel}
                </Select.Option>
              ))}
            </Select>

            <button
              className="add-record-button"
              onClick={() => navigate("/AddDentalRecord")}
            >
              <PlusOutlined /> เพิ่มบันทึก
            </button>
          </div>
        </div>
      </header>

      <table className="records-table" >
        <thead>
          <tr>
            <th>รหัสบันทึก</th>
            <th>รหัสคนไข้</th>
            <th>วันที่รักษา</th>
            <th>รายละเอียดการรักษา</th>
            <th>ค่ารักษา</th>
            <th>รหัสการรักษา</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map(record => (
            <tr key={record.ID}>
              <td>{record.ID}</td>
              <td>{record.PatientID}</td>
              <td>{dayjs(record.Date).format("DD-MM-YYYY")}</td>
              <td>{truncateDescription(record.Description)}</td>
              <td>{record.Fees.toFixed(2)}</td>
              <td>{record.TreatmentID}</td>
              <td>
              <Button
        icon={<FileSearchOutlined />} // ไอคอนแว่นขยาย
        onClick={() => navigate(`/DentalRecordDetails/${record.ID}`)} // ไปยังหน้ารายละเอียดด้วย ID
        shape="circle"
        size={"large"}>
      </Button>
                <Button
                  onClick={() => navigate(`/EditRecord/${record.ID}`)}
                  style={{ marginLeft: 13 }}
                  shape="circle"
                  icon={<EditOutlined />}
                  size={"large"}
                />
                {/* <Button
                  onClick={() => showModal(record)}
                  style={{ marginLeft: 10 }}
                  shape="circle"
                  icon={<DeleteOutlined />}
                  size={"large"}
                  danger
                /> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination
      current={currentPage}
      pageSize={recordsPerPage}
      total={filteredRecords.length}
      onChange={handleChangePage}
      style={{ marginTop: "20px", float: "right" }} // ใช้ float: right เพื่อย้ายปุ่มไปด้านขวา
      />
      {contextHolder}

      {/* <Modal
        title="ยืนยันการลบ"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal> */}
    </div>
  );
};

export default DentalRecord;
