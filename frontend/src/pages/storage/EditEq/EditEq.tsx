  import { useEffect } from "react";
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
  import { GetEquipmentById, UpdateEquipmentById } from "../../../services/https/storage";
  import { EquipmentInterface } from "../../../interfaces/storage/IEquipment";
  import { useNavigate, Link, useParams } from "react-router-dom";
  import new_logo from "../../../assets/stock/new_logo.png";
  import save from "../../../assets/stock/save.gif";
  import "./EditEq.css";

  function EquipmentEdit() {

    const navigate = useNavigate();

    const { id } = useParams<{ id: any }>();

    const [messageApi, contextHolder] = message.useMessage();

    const [form] = Form.useForm();


    const getEquipmentById = async (id: string) => {

      let res = await GetEquipmentById(id);

      if (res.status == 200) {

        const costAsFloat = parseFloat(res.data.Cost.toString());
  
        form.setFieldsValue({
          equipment_name: res.data.EquipmentName,
          Unit: res.data.Unit,
          Cost: costAsFloat,
          Quantity: res.data.Quantity
        });
  
      } else {
        messageApi.open({
          type: "error",
          content: "ไม่พบข้อมูลอุปกรณ์",
        });
        setTimeout(() => {
          navigate("/equipment");
        }, 2000);
      }
    };

    const onFinish = async (values: EquipmentInterface) => {
      // แปลง Cost เป็น float ก่อนส่งข้อมูล
      const payload = {
        ...values,
      };

      console.log("Payload:", payload);
    
      const res = await UpdateEquipmentById(id, payload);
    
      if (res.status === 200) {
        messageApi.open({
          type: "success",
          content: "แก้ไขข้อมูลสำเร็จ",
          icon: <img src={save} alt="success" style={{ width: 40, height: 40 }} />,
        });
        setTimeout(() => {
          navigate("/Equipments");
        }, 1600);
      } else {
        messageApi.open({
          type: "error",
          content: res.data.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        });
      }
    };
    
  
    useEffect(() => {
      getEquipmentById(id);
    }, []);
    
  
    return (
      <div className="equipment-create-container">
        {contextHolder}
        <Card className="equipment-card">
          <div className="logo-container">
            <img src={new_logo} alt="logo" className="logo1" />
          </div>
          <form className="formhEdit">
            <div className="label1Edit">แก้ไขอุปกรณ์</div>
          </form>
          <Divider />
          <Form
            form={form}
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="ชื่ออุปกรณ์"
                  name="equipment_name"
                  rules={[{ required: true, message: "กรุณากรอกชื่ออุปกรณ์!" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
  
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="หน่วย"
                  name="Unit"
                  rules={[{ required: true, message: "กรุณากรอกหน่วย!" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
  
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="ต้นทุน/หน่วย (บาท)"
                  name="Cost"
                  rules={[{ required: true, message: "กรุณากรอกต้นทุน/หน่วย!" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
  
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  label="จำนวน"
                  name="Quantity"
                  rules={[{ required: true, message: "กรุณากรอกจำนวน!" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
  
            <Row justify="end" style={{ marginTop: "40px" }}>
              <Space size="middle">
                <div className="form-buttons">
                  <Link to="/Equipments">
                    <button type="button" className="cancel">ยกเลิก</button>
                  </Link>
                    <button type="submit" className="submit">บันทึก</button>
                </div>
              </Space>
            </Row>
          </Form>
        </Card>
      </div>
    );
  }
  
  export default EquipmentEdit;