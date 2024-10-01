import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, message, Modal} from "antd";
import { TreatmentsInterface } from "../../../interfaces/dental/ITreatment";
import { GetTreatment, GetPatients, GetDentalRecordByID } from "../../../services/https/dentalrecord/index";
import { useParams, useNavigate } from "react-router-dom";
import { PatientsInterface } from "../../../interfaces/dental/IPatient";
import './EditTreatmentRecord.css';
import { DentalRecordInterface } from "../../../interfaces/dental/IDentalRecord";
import dayjs from "dayjs";
import { GetLoggedInEmployee } from "../../../services/https/login/index.tsx";
import new_logo from "../../../assets/new_logo.png";


const { Option } = Select;

interface FormValues {
  date: dayjs.Dayjs;
  description?: string;
  fees: number;
  installment?: number; // เปลี่ยนเป็น optional
  numberOfInstallment?: string; // เปลี่ยนเป็น string
  employee_id?: number
}

function EditDentalRecord() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();  // ดึง id ของการรักษาจาก URL
  const [treatments, setTreatments] = useState<TreatmentsInterface[]>([]);
  const [patients, setPatients] = useState<{ value: number; label: string }[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [employeeName, setEmployeeName] = useState<string>(""); // เก็บชื่อ Employee ที่ล็อกอิน
  const [employeeId, setEmployeeId] = useState<number | null>(null); // เพิ่ม state สำหรับ employee ID
  const [isModalVisible, setIsModalVisible] = useState(false); // state สำหรับ Modal

  // ดึงข้อมูลพนักงานที่ล็อกอิน
  useEffect(() => {
    GetLoggedInEmployee().then((res) => {
      if (res && res.employee) {
        setEmployeeName(res.employee.FirstName + " " + res.employee.LastName);
        setEmployeeId(res.employee.ID); // ใช้ res.employee
        console.log("Employee ID:", res.employee.ID); // ตรวจสอบค่า Employee ID
      } else {
        setEmployeeName("Guest");
        setEmployeeId(null);
      }
    });
  }, []);

  // ดึงข้อมูลการรักษาและคนไข้
  useEffect(() => {
    getTreatment();
    getPatients();
    if (id) {
      loadDentalRecord(id);
    }
  }, [id]);

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

  const getPatients = async () => {
    try {
      const res = await GetPatients();
      if (res) {
        const patientOptions = res.map((patient: PatientsInterface) => ({
          value: patient.ID || 0,
          label: `${patient.Tel || ''} (${patient.FirstName || ''} ${patient.LastName || ''})`,
        }));
        setPatients(patientOptions);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // โหลดข้อมูลบันทึกการรักษา
  const loadDentalRecord = async (recordID: string) => {
    try {
      const id = parseInt(recordID, 10); // แปลง recordID เป็นตัวเลข
      const record = await GetDentalRecordByID(id); // ใช้ตัวเลขที่แปลงแล้ว
      if (record) {
        form.setFieldsValue({
          patientID: record.PatientID,
          TreatmentID: record.TreatmentID,
          date: dayjs(record.Date),
          description: record.Description,
          fees: record.Fees,
          installment: parseFloat(record.Installment), // Ensure it's a number
          numberOfInstallment: record.NumberOfInstallment.toString(), // Ensure it's a string
        });
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลการรักษา:", error);
    }
  };

  const onFinish = async (values: FormValues) => {
    try {
      const installment = values.installment !== undefined ? parseFloat(values.installment.toString()) : 0;
      const numberOfInstallment = values.numberOfInstallment || ''; // เปลี่ยนให้เป็น string
  
      if (installment < 0) {
        messageApi.open({
          type: 'error',
          content: 'ค่างวดต้องมากกว่าหรือเท่ากับ 0',
        });
        return;
      }

      // ตรวจสอบว่ามี employeeId หรือไม่
      if (!employeeId || employeeId === 0) {
        messageApi.open({
          type: 'error',
          content: 'ไม่พบข้อมูลพนักงานที่ล็อกอิน กรุณาล็อกอินใหม่',
        });
        return;
      }
  
      const payload = {
        ID: id ? parseInt(id) : 0, // ใช้ ID จาก URL params
        Date: values.date ? values.date.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]") : '',
        Description: values.description || '',
        Fees: parseFloat(values.fees.toString()),
        Installment: installment,
        NumberOfInstallment: numberOfInstallment, // ส่งเป็น string
        TreatmentID: form.getFieldValue('TreatmentID'),
        StatusID: 1,
        PatientID: form.getFieldValue('patientID'),
        employee_id: employeeId, // ใช้ employee ID จากพนักงานที่ล็อกอิน
        Treatment: {
          ID: form.getFieldValue('TreatmentID'),
          Name: '',
        },
        Status: {
          ID: 2,
          Name: '',
        },
        Patient: {
          ID: form.getFieldValue('patientID'),
          FirstName: '',
          LastName: '',
        },
      };
  
      console.log("Payload:", payload);
  
      const response = await fetch(`http://localhost:8000/dental_record/${id}`, { // ใช้ ID ใน URL
        method: 'PATCH', // ใช้วิธี PATCH สำหรับการอัปเดต
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        messageApi.open({
          type: 'success',
          content: 'แก้ไขข้อมูลเรียบร้อยแล้ว',
        });
        //navigate('/DentalRecord'); // เปลี่ยนเส้นทางหลังจากสำเร็จ
      } else {
        const result = await response.json();
        messageApi.open({
          type: 'error',
          content: result.error || 'ไม่สามารถแก้ไขข้อมูลได้',
        });
        console.error('Server response error:', result);
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: 'เกิดข้อผิดพลาดในการติดต่อกับเซิร์ฟเวอร์',
      });
      console.error('Request error:', error);
    }
    setTimeout(function () {
      navigate("/DentalRecord");
    }, 2000);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.submit(); // เรียก submit เมื่อผู้ใช้ยืนยัน
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="add-treatment-record">
      {contextHolder}
      <div className="logo-container-center">
        <img src={new_logo} alt="logo" className="logo-image-center" />
      </div>
      <header>
        <h1>แก้ไขบันทึกการรักษา</h1>
      </header>
      <Form
        form={form}
        name="edit-treatment-record"
        layout="vertical"
        onFinish={onFinish}
      >
        <div className="form-row">
          <div className="form-group">
            <Form.Item
              label="ชื่อคนไข้"
              name="patientID"
              rules={[{ required: true, message: "กรุณากรอก" }]}
            >
              <Select
                showSearch
                placeholder="ค้นหาเบอร์โทรหรือชื่อคนไข้"
                optionFilterProp="label"
                options={patients}
                style={{ width: "100%", height: "40px", lineHeight: "40px" }}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </div>
          <div className="form-group">
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
                  <Option value={item.ID} key={item.ID}>
                    {item.TreatmentName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>
        <Form.Item
          label="วันที่รักษา"
          name="date"
          className="form-item date"  // Add the class here
          rules={[{ required: true, message: 'กรุณาเลือกวันที่!' }]}
        >
          <DatePicker format="DD/MM/YYYY" style={{ width: '50%', height: "40px" }} />
        </Form.Item>
        <Form.Item
          label="รายละเอียด"
          name="description"
          className="form-item description"  // Add the class here
          >
          <Input.TextArea style={{ width: '100%',height: "77px"}} />
        </Form.Item>

        {/* ส่วนนี้คือการจัดฟอร์มในแถวเดียวกัน */}
        <div className="form-row">
        <div className="form-group">
          <Form.Item
            style={{ width: '100%' }}
            label="ค่ารักษา"
            name="fees"
            rules={[{ required: true, message: 'กรุณากรอกค่ารักษา!' }]}
            initialValue={0} // เพิ่มค่าเริ่มต้นสำหรับ fees เป็น 0
          >
            <Input 
              type="number" 
              style={{ height: "40px" }} 
              min={0} // ป้องกันการกรอกค่าติดลบ
              step="0.01" // เพิ่มความละเอียดของค่าทศนิยม ถ้าจำเป็น
            />
          </Form.Item>
        </div>
        <div className="form-group">
        <Form.Item
          label="ค่างวด"
          name="installment"
          initialValue={0} // เพิ่มค่าเริ่มต้นสำหรับ installment เป็น 0
        >
          <Input 
            type="number" 
            style={{ height: "40px" }} 
            min={0} // ป้องกันการกรอกค่าติดลบ
            step="0.01" // เพิ่มความละเอียดของค่าทศนิยม ถ้าจำเป็น
          />
        </Form.Item>
      </div>
          <div className="form-group">
            <Form.Item
              label="จำนวนงวด"
              name="numberOfInstallment"
            >
              <Input type="text" style={{ width: '100%', height: "40px" }} />
            </Form.Item>
          </div>
        </div>
        <Form.Item>
          <div className="form-buttons">
            <Button type="primary" onClick={showModal} className="submit-button">ยืนยัน</Button>
            <Button htmlType="button" onClick={() => form.resetFields()} className="reset-button">รีเซต</Button>
            <Button htmlType="button" onClick={() => navigate(-1)} className="cancel-button">ยกเลิก</Button>
          </div>
        </Form.Item>
      </Form>

      {/* Modal สำหรับยืนยัน */}
      <Modal
        title="ยืนยันการแก้ไขบันทึกการรักษา"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p>คุณต้องการแก้ไขข้อมูลการรักษานี้หรือไม่?</p>
      </Modal>
    </div>
  );
}

export default EditDentalRecord;
