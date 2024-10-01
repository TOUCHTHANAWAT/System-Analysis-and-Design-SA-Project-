import { useState, useEffect } from "react";
import { Space, Table, Col, Row, Divider, message, Modal, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { GetEquipments, DeleteEquipmentById } from "../../../services/https/storage/index";
import { EquipmentInterface } from "../../../interfaces/storage/IEquipment";
import { Link, useNavigate } from "react-router-dom";
import "./Equipments.css"; 
import { ExclamationCircleOutlined } from "@ant-design/icons";
import new_logo from "../../../assets/stock/new_logo.png";
import stocks from "../../../assets/stock/stocks.jpg";

const { Search } = Input;

function Equipments() {
  const navigate = useNavigate();
  const [equipments, setEquipments] = useState<EquipmentInterface[]>([]);
  const [filteredEquipments, setFilteredEquipments] = useState<EquipmentInterface[]>([]);

  const [messageApi, contextHolder] = message.useMessage(); // เรียกใช้ messageApi
  const myId = localStorage.getItem("id");
  const [modal] = Modal.useModal();

  // ฟังก์ชันค้นหาอุปกรณ์ตามชื่อ
  const onSearch = (value: string) => {
    const filtered = equipments.filter(equipment => 
      equipment.EquipmentName?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredEquipments(filtered);
  };

  const showModal = (record: EquipmentInterface) => {
    const config = {
      title: 'ยืนยันการลบอุปกรณ์!',
      content: (
        <>
          คุณต้องการลบอุปกรณ์ {record.EquipmentName} ใช่หรือไม่?
          <br />
        </>
      ),
      icon: <ExclamationCircleOutlined />,
      okText: 'ยืนยัน',
      cancelText: 'ยกเลิก',
      okButtonProps: {
        style: {
          backgroundColor: '#42C2C2',
          borderColor: '#42C2C2',
          color: '#fff',
        },
      },
      cancelButtonProps: {
        style: {
          backgroundColor: '#fff',
          borderColor: '#d9d9d9',
          color: '#000',
        },
      },
      async onOk() {
        try {
          await deleteEquipmentById(String(record.ID));
        } catch (error) {
          messageApi.open({
            type: 'error',
            content: `ไม่สามารถลบอุปกรณ์ ${record.EquipmentName} ได้`,
          });
        }
      },
      onCancel() {
        console.log('ยกเลิกการลบอุปกรณ์');
      },
    };
    Modal.confirm(config);
  };
  

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
      key: "equipment_name",
      align: 'center',
    },
    {
      title: "หน่วย",
      dataIndex: "Unit",
      key: "unit",
      align: 'center',
    },
    {
      title: "ต้นทุน/หน่วย (บาท)",
      dataIndex: "Cost",
      key: "cost",
      render: (text) => <>{parseFloat(text as unknown as string).toFixed(2)}</>,
      align: 'center',
    },
    {
      title: "ในคลัง",
      dataIndex: "Quantity",
      key: "quantity",
      align: 'center',
    },
    {
      key: "action",
      render: (record) => (
        <Space size="middle">
          <button className="delete" onClick={() => showModal(record)}>
            ลบ
          </button>
          <button className="submit" onClick={() => navigate(`/Equipments/RequestEq/${record.ID}`)}>
            เบิก
          </button>
          <button className="reset" onClick={() => navigate(`/Equipments/EditEq/${record.ID}`)}>
            แก้ไข
          </button>
        </Space>
      ),
      width: 300,
    }    
  ];

  const deleteEquipmentById = async (id: string) => {
    let res = await DeleteEquipmentById(id);
    if (res.status === 200) {
      messageApi.open({ type: "success", content: res.data.message });
      await getEquipments();
    } else {
      messageApi.open({ type: "error", content: res.data.error });
    }
  };

  const getEquipments = async () => {
    try {
      let res = await GetEquipments();
      if (res.status === 200) {
        setEquipments(res.data);
        setFilteredEquipments(res.data); //เก็บข้อมูลสำหรับการแสดงผลเมื่อค้นหา
      } else {
        setEquipments([]);
        messageApi.open({ type: "error", content: res.data.error || "Error fetching data" });
      }
    } catch (error: any) {
      messageApi.open({ type: "error", content: error?.message || "Unexpected error occurred" });
    }
  };

  useEffect(() => {
    getEquipments();
  }, []);

  return (
    <>
      {contextHolder}
      <div className="logo-container">
        <img src={new_logo} alt="logo" className="logo1" />
      </div>
      <Row align="top">
        <Col>
          <div className="logo-icon">
            <img src={stocks} alt="logo" style={{ marginTop: '-43px', width: '100px', marginLeft: '0px', /* ขยับไปทางขวา */}} />
          </div>
        </Col>
        <Col xs={24} sm={12} md={9} lg={9}>
          <h1 style={{ marginTop: '-15px'}}>วัสดุอุปกรณ์</h1>
        </Col>
        <Divider style={{ marginTop: '-20px', marginBottom: '20px' }}  />
      </Row>

      <Row style={{ marginBottom: 16 }}>
      <Col span={1}></Col>
      <Col span={11}>
      {/* ช่องค้นหา */}
      <Search 
        placeholder="ค้นหาชื่ออุปกรณ์" 
        onSearch={onSearch} 
        onChange={(e) => {
        if (e.target.value === "") {
          getEquipments(); // โหลดข้อมูลทั้งหมดเมื่อช่องค้นหาถูกล้าง
        }
      }}
        allowClear
        enterButton 
        style={{ maxWidth: 300, backgroundColor: "#ffffff", borderColor: "#42C2C2" }} 
        className="custom-search"
      />
      </Col>
      
        <Col span={11} style={{ textAlign: "end",marginTop: '-6px'}}>
          <Space>
            <Link to="/Equipments/CreateEq">
              <button className="submit">+ เพิ่มอุปกรณ์</button>
            </Link>
          </Space>
        </Col>
      </Row>

      <Table 
        rowKey="ID" 
        columns={columns} 
        dataSource={filteredEquipments} 
        style={{ width: "92%", margin: "0 auto" }} 
        pagination={{ pageSize: 4 }} 
      />
      
      <Col
      span={4}
      style={{
      textAlign: 'right',
      position: 'fixed', 
      bottom: '69px', 
      left: '284px', 
      marginTop: '0', 
      backgroundColor: 'white',zIndex: 1000, 
      }}
      > 
        <Space>
          <Link to="/Equipments/LittleEq">
            <button className="reset">
              <ExclamationCircleOutlined /> อุปกรณ์เหลือน้อย
            </button>
          </Link>
        </Space>
      </Col>
    </>
  );
}

export default Equipments;