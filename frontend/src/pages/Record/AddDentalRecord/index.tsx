import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Select, message, Modal} from "antd";
import { TreatmentsInterface } from "../../../interfaces/dental/ITreatment";
import { GetTreatment, GetPatients } from "../../../services/https/dentalrecord/index";
import { useNavigate } from "react-router-dom";
import { PatientsInterface } from "../../../interfaces/dental/IPatient";
import './AddDentalRecord.css';
import { GetLoggedInEmployee } from "../../../services/https/login/index.tsx";
import new_logo from "../../../assets/new_logo.png";


const { Option } = Select;

interface FormValues {
  description?: string;
  fees: number;
  installment?: number;
  numberOfInstallment?: string;
}

function AddDentalRecord() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [treatments, setTreatments] = useState<TreatmentsInterface[]>([]);
  const [patients, setPatients] = useState<{ value: number; label: string }[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [employeeName, setEmployeeName] = useState<string>(""); // เก็บชื่อ Employee ที่ล็อกอิน
  const [employeeId, setEmployeeId] = useState<number | null>(null); // เพิ่ม state สำหรับ employee ID
  const [isModalVisible, setIsModalVisible] = useState(false); // สถานะ Modal

  // ดึงข้อมูลพนักงานที่ล็อกอิน
  useEffect(() => {
    GetLoggedInEmployee().then((res) => {
      if (res && res.employee) {
        setEmployeeName(res.employee.FirstName + " " + res.employee.LastName);
        setEmployeeId(res.employee.ID); // ใช้ res.employee
      } else {
        setEmployeeName("Guest");
        setEmployeeId(null);
      }
    });
  }, []);
  

  // ดึงข้อมูลการรักษา
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

  // ดึงข้อมูลคนไข้
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
  
  useEffect(() => {
    getTreatment();
    getPatients();
  }, []);

  // เมื่อทำการ submit ฟอร์ม
  const onFinish = async (values: FormValues) => {
    try {
      if (!employeeId) {
        messageApi.open({
          type: 'error',
          content: 'ไม่พบข้อมูลพนักงานที่ล็อกอิน',
        });
        return;
      }
  
      // เตรียม payload ที่จะส่ง
      const payload = {
        ...values,
        fees: parseFloat(values.fees.toString()), // แปลงค่า fees เป็น number
        installment: values.installment ? parseFloat(values.installment.toString()) : null,
        numberOfInstallments: values.numberOfInstallment || null,
        employee_id: employeeId, // ใช้ employeeID จากพนักงานที่ล็อกอิน
      };
  
      console.log("Payload:", payload); // ตรวจสอบ payload
  
      const response = await fetch('http://localhost:8000/dental_records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        messageApi.open({
          type: 'success',
          content: 'บันทึกข้อมูลเรียบร้อยแล้ว',
        });
        form.resetFields();
      } else {
        const result = await response.json();
        messageApi.open({
          type: 'error',
          content: result.error || 'ไม่สามารถบันทึกข้อมูลได้',
        });
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: 'เกิดข้อผิดพลาดในการติดต่อกับเซิร์ฟเวอร์',
      });
    }
    setTimeout(function () {
      navigate("/DentalRecord");
    }, 2000);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    form.submit(); // เรียกใช้งาน onFinish เมื่อกดยืนยัน
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
        <h1>เพิ่มบันทึกการรักษา</h1>
      </header>
      <Form
        form={form}
        name="add-treatment-record"
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
          rules={[{ required: true, message: 'กรุณาเลือกวันที่!' }]}
        >
          <DatePicker format="DD/MM/YYYY" style={{ width: '50%', height: "40px" }} />
        </Form.Item>
        <Form.Item
          label="รายละเอียด"
          name="description"
        >
          <Input.TextArea rows={4} />
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

      <Modal
        title="ยืนยันการบันทึกการรักษา"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
      >
        <p>คุณต้องการบันทึกข้อมูลการรักษาหรือไม่?</p>
      </Modal>
    </div>
  );
}

export default AddDentalRecord;
