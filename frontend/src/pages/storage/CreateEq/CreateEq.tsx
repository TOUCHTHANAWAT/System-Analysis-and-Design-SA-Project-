import {
  Space,
  Col,
  Row,
  Divider,
  Form,
  Input,
  Card,
  message,
  InputNumber,
} from "antd";

import { EquipmentInterface } from "../../../interfaces/storage/IEquipment";
import { useNavigate, Link } from "react-router-dom";
import { CreateEquipment } from "../../../services/https/storage";
import new_logo from "../../../assets/stock/new_logo.png";
import complete from "../../../assets/stock/complete.gif";
import warning from "../../../assets/stock/warning.gif"
import "./CreateEq.css";

function EquipmentCreate() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: EquipmentInterface) => {
    try {
      let res = await CreateEquipment(values);
  
      if (res.status === 201) { // สถานะ HTTP 201 สำหรับการสร้างสำเร็จ
        messageApi.open({
          type: "success",
          content: "เพิ่มอุปกรณ์สำเร็จ",
          icon: <img src={complete} alt="success" style={{ width: 40, height: 40 }} />,
        });
        setTimeout(() => {
          navigate("/equipments");
        }, 1600);
      } else if (res.status === 409) { // สถานะ HTTP 409 สำหรับกรณ์อุปกรณ์มีอยู่แล้ว
        messageApi.open({
          type: "error",
          content: res.message || "อุปกรณ์นี้มีอยู่แล้ว",
          icon: <img src={warning} alt="success" style={{ width: 40, height: 40 }} />,
        });
      } else {
        messageApi.open({
          type: "error",
          content: res.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        });
      }
    } catch (error) {
      console.error("ไม่สามารถบันทึกข้อมูลได้:", error);
      messageApi.open({
        type: "error",
        content: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองอีกครั้ง",
      });
    }
  };
  

  return (
    <div className="equipment-create-container">
      {contextHolder}
      <Card className="equipment-card">
        <div className="logo-container">
          <img
            src={new_logo}
            alt="logo"
            className="logo1"
          />
        </div>
        <form className="formhAdd">
          <div className="label1Add">เพิ่มอุปกรณ์</div>
        </form>
        <Divider />
        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 0]}>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label="ชื่ออุปกรณ์"
                name="EquipmentName"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกชื่ออุปกรณ์!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label="หน่วย"
                name="unit"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกหน่วย!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label="ต้นทุน/หน่วย (บาท)"
                name="cost"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกต้นทุน/หน่วย!",
                  },
                ]}
              >
                 <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item
                label="จำนวน"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกจำนวน!",
                  },
                ]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12} lg={12} xl={12}></Col>
          </Row>
          
          <Row justify="end" style={{ marginTop: "40px" }}>
            <Col span={24} style={{ textAlign: "end", alignSelf: "center" }} xs={24} sm={24} md={12} lg={12} xl={12}></Col>
            <Space size="middle">
              <div className="form-buttons">
                <Link to="/Equipments">
                  <button type="button" className="cancel">ยกเลิก</button>
                </Link>
                <button type="reset" className="reset">รีเซต</button>
                <button type="submit" className="submit">ตกลง</button>
              </div>
            </Space>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default EquipmentCreate;