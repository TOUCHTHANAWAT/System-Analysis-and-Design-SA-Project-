import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetDentalRecordByID } from "../../../services/https/dentalrecord";
import { DentalRecordInterface } from "../../../interfaces/dental/IDentalRecord";
import { Button, Spin, Descriptions } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import './DentalRecordDetails.css'; // เพิ่มสไตล์ของหน้า
import new_logo from "../../../assets/new_logo.png";



const DentalRecordDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // ดึง ID จาก URL
  const [dentalRecord, setDentalRecord] = useState<DentalRecordInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // จัดการสถานะ loading
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับดึงข้อมูลบันทึกการรักษาตาม ID
  const fetchDentalRecord = async (recordId: string) => {
    try {
      const res = await GetDentalRecordByID(Number(recordId));
      if (res) {
        setDentalRecord(res);
        setLoading(false);
      } else {
        console.error("ไม่พบข้อมูลบันทึกการรักษา");
        setLoading(false);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลบันทึกการรักษา:", error);
      setLoading(false);
    }
  };
  

  // ดึงข้อมูลเมื่อ component ถูก mount
  useEffect(() => {
    if (id) {
      fetchDentalRecord(id);
    }
  }, [id]);

  if (loading) {
    return <Spin size="large" className="loading-spinner" />;
  }

  if (!dentalRecord) {
    return <p>ไม่พบข้อมูลบันทึกการรักษา</p>;
  }

  return (
    <div className="dental-record-details"> {/* ใช้ class จาก CSS */}
    <div className="logo-wrapper">
  <img src={new_logo} alt="logo" className="logo-image" />
</div>
      <header className="header">
      <h3>รายละเอียดบันทึกการรักษา</h3>
        <Button
          onClick={() => navigate(-1)}
          className="button button-cancel"
          icon={<ArrowLeftOutlined />} // เพิ่มไอคอนลูกศร
          size={"large"}
        >
          
        </Button>      </header>

      <div className="form-container"> {/* ใช้ class สำหรับจัดวางฟอร์ม */}
      <Descriptions 
  title="ข้อมูลบันทึกการรักษา" 
  bordered 
  layout="horizontal" // ปรับเป็นแนวนอน
  column={2} // แสดงข้อมูล 2 คอลัมน์ในแต่ละแถว
>
  <Descriptions.Item label="รหัสบันทึก">{dentalRecord.ID}</Descriptions.Item>
  <Descriptions.Item label="วันที่รักษา">
    {new Date(dentalRecord.Date).toLocaleDateString('th-TH', { year: 'numeric', month: '2-digit', day: '2-digit' })}
  </Descriptions.Item>
  <Descriptions.Item label="รหัสคนไข้">{dentalRecord.PatientID}</Descriptions.Item>
  <Descriptions.Item label="ชื่อคนไข้">
    {dentalRecord.Patient ? `${dentalRecord.Patient.FirstName} ${dentalRecord.Patient.LastName}` : "ไม่พบข้อมูล"}
  </Descriptions.Item>
  <Descriptions.Item label="รหัสการรักษา">{dentalRecord.TreatmentID}</Descriptions.Item>
  <Descriptions.Item label="การรักษา">
    {dentalRecord.Treatment ? dentalRecord.Treatment.TreatmentName : "ไม่พบข้อมูล"}
  </Descriptions.Item>
  <Descriptions.Item label="ค่ารักษา">{dentalRecord.Fees}</Descriptions.Item>
  <Descriptions.Item label="รายละเอียดการรักษา" style={{ width: '350px' }}>
  <div className="description">{dentalRecord.Description}</div>
</Descriptions.Item>
  <Descriptions.Item label="ค่างวดทั้งหมด">{dentalRecord.Installment}</Descriptions.Item>
  <Descriptions.Item label="จำนวนงวด">{dentalRecord.NumberOfInstallment}</Descriptions.Item>
  <Descriptions.Item label="รหัสทันตแพทย์">{dentalRecord.EmployeeID}</Descriptions.Item>
  <Descriptions.Item label="ชื่อทันตแพทย์">
    {dentalRecord.Employee ? `${dentalRecord.Employee.FirstName} ${dentalRecord.Employee.LastName}` : "ไม่พบข้อมูล"}
  </Descriptions.Item>
</Descriptions>
      </div>
    </div>
  );
};

export default DentalRecordDetails;