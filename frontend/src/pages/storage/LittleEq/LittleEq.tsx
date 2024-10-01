import { useState, useEffect } from "react";
import { Space, Table, Col, Row, Divider, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { GetEquipmentsLittle } from "../../../services/https/storage/index";
import { EquipmentInterface } from "../../../interfaces/storage/IEquipment";
import { useNavigate} from "react-router-dom";
import "./LittleEq.css"; 
import { ExclamationCircleOutlined } from "@ant-design/icons";
import new_logo from "../../../assets/stock/new_logo.png";

function EquipmentsLittle() {
  
  const navigate = useNavigate();

  const [equipments, setEquipments] = useState<EquipmentInterface[]>([]);

  const [messageApi, contextHolder] = message.useMessage();

  const columns: ColumnsType<EquipmentInterface> = [
    {
      title: "รหัส",
      dataIndex: "ID",
      key: "id",
      align: 'center',
    },
    {
      title: "ชื่ออุปกรณ์",
      dataIndex: "EquipmentName",
      key: "EquipmentName",
      align: 'center',
    },
    {
      title: "หน่วย",
      dataIndex: "Unit",
      key: "Unit",
      align: 'center',
    },
    {
      title: "ต้นทุน/หน่วย (บาท)",
      dataIndex: "Cost",
      key: "Cost",
      render: (text) => <>{parseFloat(text as unknown as string).toFixed(2)}</>,
      align: 'center',
    },
    {
      title: "ในคลัง",
      dataIndex: "Quantity",
      key: "Quantity",
      align: 'center',
    },
    {
      key: "action",
      render: (record) => (
        <Space size="middle">
          <div className="form-buttons">
            <button type="submit" className="submit"
              onClick={() => navigate(`/Equipments/LittleEq/AddEq/${record.ID}`)}>เติม</button>
          </div>
        </Space>
      ),
    },
  ];

  const getEquipmentsLittle = async () => {
    let res = await GetEquipmentsLittle();
    if (res.status === 200) {
      setEquipments(res.data);
    } else {
      setEquipments([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getEquipmentsLittle();
  }, []);

  return (
    <>
      {contextHolder}
      <div className="logo-container">
        <img
          src={new_logo}
          alt="logo"
          className="logo1"
        />
      </div>
      <Row>
        <Col span={12} >
          <h1 style={{ marginTop: '-15px'}} >
            <ExclamationCircleOutlined style={{ marginRight: 8 }} />
            อุปกรณ์เหลือน้อย
          </h1>
        </Col>
        <Divider style={{ marginTop: -20, marginBottom: '16px' }} />
      </Row>
      <div style={{ marginTop: 20 }}>
        <Table 
        rowKey="ID" 
        columns={columns} 
        dataSource={equipments} 
        style={{ width: "95%", margin: "0 auto" }}
        pagination={{ pageSize:4 }} 
      />
      </div>
    </>
  );
}

export default EquipmentsLittle;