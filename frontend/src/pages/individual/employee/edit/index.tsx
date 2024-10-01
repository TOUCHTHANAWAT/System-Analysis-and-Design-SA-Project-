import { useState, useEffect } from "react";
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
  DatePicker,
  Select,
} from "antd";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
import { EmployeesInterface } from "../../../../interfaces/individual/IEmployee";
import { GendersInterface } from "../../../../interfaces/individual/IGender";
import { JobPositionsInterface } from "../../../../interfaces/individual/IJobPosition";
import { GetGenders, GetEmployeeById, UpdateEmployee, GetJobPositions } from "../../../../services/https/individual/index";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

function EmployeeEdit() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [employee, setEmployee] = useState<EmployeesInterface>();
  const [genders, setGenders] = useState<GendersInterface[]>([]);
  const [jobPositions, setJobPositions] = useState<JobPositionsInterface[]>([]);

  // รับข้อมูลจาก params
  let { id } = useParams();
  // อ้างอิง form กรอกข้อมูล
  const [form] = Form.useForm();

  const onFinish = async (values: EmployeesInterface) => {
    values.ID = employee?.ID;
    let res = await UpdateEmployee(values);
    if (res) {
      messageApi.open({
        type: "success",
        content: res.message,
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
 
  const getEmployeeById = async () => {
    let res = await GetEmployeeById(Number(id));
    if (res) {
      setEmployee(res);
      // set form ข้อมูลเริ่มของผู่้ใช้ที่เราแก้ไข
      form.setFieldsValue({
        FirstName: res.FirstName,
        LastName: res.LastName,
        GenderID: res.GenderID,
        Email: res.Email,
        Birthday: dayjs(res.Birthday),

        Address: res.Address,
        Tel: res.Tel,
        JobPositionID: res.JobPositionID,
      });
    }
  };
  const onCancel = () => {
    navigate("/employee"); // เปลี่ยนเส้นทางไปยังหน้าที่ต้องการเมื่อกดยกเลิก
  };

  useEffect(() => {
    getGender();
    getEmployeeById();
    getJobPosition();
  }, []);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2> แก้ไขข้อมูลพนักงาน</h2>
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
                label="วัน/เดือน/ปี เกิด"
                name="Birthday"
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกวันเกิด !",
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
          </Row>
            
          <Row gutter={[16, 16]}>
            
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

export default EmployeeEdit;
