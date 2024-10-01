import React, { useState, useEffect } from "react";
import {
  Space,
  Button,
  Col,
  Row,
  Divider,
  Form,
  Input,
  Card,
  message,
  Select,
  DatePicker,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
// import { EmployeesInterface } from "../../../interfaces/IEmployee";
import { EmployeesInterface } from "../../../../interfaces/individual/IEmployee";
import { GendersInterface } from "../../../../interfaces/individual/IGender";
import { JobPositionsInterface } from "../../../../interfaces/individual/IJobPosition";
import { ImageUpload } from "../../../../interfaces/IUpload";
//import { CreateEmployee, GetGenders,GetJobPositions } from "../../../services/https";
import { CreateEmployee, GetGenders,GetJobPositions } from "../../../../services/https/individual/index";
import { useNavigate } from "react-router-dom";


import isLoggedIn from "../../../../routes/index"
const { Option } = Select;

function EmployeeCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [genders, setGenders] = useState<GendersInterface[]>([]);
  const [jobPositions, setJobPositions] = useState<JobPositionsInterface[]>([]);
  const [profile, setProfile] = useState<ImageUpload>();

  const onFinish = async (values: EmployeesInterface) => {
    let res = await CreateEmployee(values);
    // console.log("Is Logged In: ", isLoggedIn);
    if (res.status) {
      messageApi.open({
        type: "success",
        content: "บันทึกข้อมูลสำเร็จ",
      });
      setTimeout(function () {
        navigate("/employee");
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
  const getJobPosition = async () => {
    let res = await GetJobPositions();
    if (res) {
      setJobPositions(res);
    }
  };
  const onCancel = () => {
    navigate("/employee");// เปลี่ยนเส้นทางไปยังหน้าที่ต้องการเมื่อกดยกเลิก
     console.log("Stored isLogin: ", localStorage.getItem("isLogin")); // เพิ่มการตรวจสอบที่นี่
  };
  useEffect(() => {
    getGender();
    getJobPosition();
  }, []);

  // const normFile = (e: any) => {
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   setProfile(e?.fileList[0]);
  //   return e?.fileList;
  // };

  return (
    <div>
      {contextHolder}
      <Card>
        <h2> เพิ่มข้อมูลพนักงาน</h2>
        <Divider />
        <Form
          name="basic"
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
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="อีเมล"
                name="Email"
                rules={[
                  {
                    type: "email",
                    message: "รูปแบบอีเมลไม่ถูกต้อง !",
                  },
                  {
                    required: true,
                    message: "กรุณากรอกอีเมล !",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="รหัสผ่าน"
                name="Password"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกรหัสผ่าน !",
                  },
                ]}
              >
                <Input.Password />
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
        
          <Row gutter={[16, 16]}>
            
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                name="JobPositionID"
                label="ตำแหน่ง"
                rules={[{ required: true, message: "กรุณาระบุตำแหน่ง !" }]}
              >
                <Select allowClear>
                  {jobPositions.map((item) => (
                    <Option value={item.ID} key={item.Job}>
                      {item.Job}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
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
          </Row>
                  
          <Row gutter={[16, 16]}>
            
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Form.Item
                label="ที่อยู่"
                name="Address"
                rules={[
                  {
                    required: true,
                    message: "กรุณาระบุที่อยู่ !",
                  },
                ]}
              >
                <Input.TextArea />
              </Form.Item>
            </Col>
          </Row>

          
        </Form>
        <Row justify="end">
            <Col style={{ marginTop: "40px" ,marginLeft: "10px"}}>
              <Form.Item>
                <Space size="large" >
                  <Button
                    type="primary"
                    htmlType="submit"
                    // icon={<PlusOutlined />}
                    style={{
                      backgroundColor: "#42C2C2",
                      borderColor: "#42C2C2",
                      color: "#fff",
                    }}
                    form="basic" //เชื่อมกับชื่อฟอร์ม
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

export default EmployeeCreate;
