import { useState, useEffect } from "react";
import {
  Space,
  Button,
  Col,
  Row,
  Divider,
  Form,
  Input,
  InputNumber,
  Card,
  message,
  DatePicker,
  Select,
} from "antd";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
import { PatientsInterface } from "../../../../interfaces/individual/IPatient";
import { GendersInterface } from "../../../../interfaces/individual/IGender";
import { BloodTypesInterface } from "../../../../interfaces/individual/IBloodType";

import { GetGenders, GetPatientById, UpdatePatient,GetBloodTypes } from "../../../../services/https/individual"
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

function PatientEdit() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [patient, setPatient] = useState<PatientsInterface>();
  const [genders, setGenders] = useState<GendersInterface[]>([]);
  const [bloodTypes, setBloodTypes] = useState<BloodTypesInterface[]>([]);

  // รับข้อมูลจาก params
  let { id } = useParams();
  // อ้างอิง form กรอกข้อมูล
  const [form] = Form.useForm();

  const onFinish = async (values: PatientsInterface) => {
    values.ID = patient?.ID;
    // console.log(values);
    let res = await UpdatePatient(values);
    if (res) {
      messageApi.open({
        type: "success",
        content: res.message,
      });
      setTimeout(function () {
        navigate("/patient");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.message,
      });
    }
  };

  const getGender = async () => {
    let res = await GetGenders();
    if (res) {
      setGenders(res);
    }
  };
  const getBloodType = async () => {
    let res = await GetBloodTypes();
    if (res) {
      setBloodTypes(res);
    }
  };
 
  const getPatientById = async () => {
    let res = await GetPatientById(Number(id));
    if (res) {
      setPatient(res);
      // set form ข้อมูลเริ่มของผู่้ใช้ที่เราแก้ไข
      form.setFieldsValue({
        FirstName: res.FirstName,
        LastName: res.LastName,
        GenderID: res.GenderID,
        // Email: res.Email,
        Birthday: dayjs(res.Birthday),
        Weight: res.Weight,
        Height: res.Height,

        BloodTypeID:  res.BloodTypeID,
        DrugAllergy: res.DrugAllergy,
        Chronicdisease: res.Chronicdisease,
        Tel: res.Tel,
        //JobPositionID: res.JobPositionID,
      });
    }
  };
  const onCancel = () => {
    navigate("/patient"); // เปลี่ยนเส้นทางไปยังหน้าที่ต้องการเมื่อกดยกเลิก
  };

  useEffect(() => {
    getGender();
    getBloodType();
    getPatientById();
    // getJobPosition();
  }, []);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2> แก้ไขข้อมูลคนไข้</h2>
        <Divider />
        <Form
          name="basic"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          style={{
            border: '2px solid #42C2C2', // เปลี่ยนสีกรอบที่นี่
            borderRadius: '20px', // เปลี่ยนขอบมน
            padding: '20px', // เพิ่มพื้นที่ภายใน
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="ชื่อจริง"
                name="FirstName"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกชื่อ !",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="นามสกุล"
                name="LastName"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกนามสกุล !",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="วัน/เดือน/ปี เกิด"
                name="Birthday"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกวัน/เดือน/ปี เกิด !",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                name="GenderID"
                label="เพศ"
                rules={[{ required: true, message: "กรุณาระบุเพศ !" }]}
              >
                <Select allowClear>
                  {genders.map((item) => (
                    <Option value={item.ID} key={item.Sex}>
                      {item.Sex}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        
          <Row  gutter={[16, 16]} justify="start">
            
            <Col  xs={24} sm={24} md={24} lg={24} xl={3}>
              <Form.Item
                label="ส่วนสูง(cm)"
                name="Height"
                rules={[
                  {
                    required: true,
                    message: "กรุณาระบุส่วนสูง !",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
            <Col  xs={24} sm={24} md={24} lg={24} xl={3}>
              <Form.Item
                label="น้ำหนัก(Kg)"
                name="Weight"
                rules={[
                  {
                    required: true,
                    message: "กรุณาระบุน้ำหนัก !",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
            <Col  xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item
                label="เบอร์โทร"
                name="Tel"
                rules={[
                  {
                    required: true,
                    message: "กรุณาระบุเบอร์โทร !",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col  xs={24} sm={24} md={24} lg={24} xl={9}>
              <Form.Item
                label="หมู่เลือด"
                name="BloodTypeID"
                rules={[
                  {
                    required: true,
                    message: "กรุณาระบุหมู่เลือด !",
                  },
                ]}
              >
                <Select allowClear>
                  {bloodTypes.map((item) => (
                    <Option value={item.ID} key={item.BloodGroup}>
                      {item.BloodGroup}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]} >
            <Col  xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item
                label="ประวัติการแพ้ยา"
                name="DrugAllergy"
              >
                <Input.TextArea />
              </Form.Item>
            </Col>
            <Col  xs={24} sm={24} md={24} lg={24} xl={6}>
              <Form.Item
                label="โรคประจำตัว"
                name="Chronicdisease"
              >
                <Input.TextArea />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Row justify="end">
            <Col style={{ marginTop: "40px" ,marginLeft: "10px"}}>
              <Form.Item>
                <Space size="large">
                  <Button
                    type="primary"
                    htmlType="submit"
                    // icon={<PlusOutlined />}
                    style={{
                      backgroundColor: "#42C2C2",
                      borderColor: "#42C2C2",
                      color: "#fff",
                    }}
                    form="basic"
                  >
                    ยืนยัน
                  </Button>
                  <Button htmlType="button" 
                    style={{ marginRight: "10px",
                      backgroundColor: "#d9d9d9",
                      borderColor: "#d9d9d9",
                      color: "#333", }}  
                    onClick={onCancel}>
                    ยกเลิก
                  </Button>
                  
                </Space>
              </Form.Item>
            </Col>
          </Row>
      </Card>
    </div>
  );
}

export default PatientEdit;
