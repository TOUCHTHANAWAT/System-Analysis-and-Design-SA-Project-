/*import { Button, Card, Form, Input, message, Flex, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { SignIn } from "../../../services/https/login/";
import { SignInInterface } from "../../../interfaces/SignIn";
import logo from "../../../assets/logoSamgt.png";


function SignInPages() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: SignInInterface) => {
        console.log(values)
        let res = await SignIn(values);
        console.log(res)
        if (res.status == 200) {
            messageApi.success("Sign-in successful");
            localStorage.setItem("isLogin", "true");
            localStorage.setItem("page", "dashboard");
            localStorage.setItem("token_type", res.data.token_type);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("id", res.data.id);

            setTimeout(() => {
                location.href = "/";
            }, 2000);

        } else {
            messageApi.error(res.data.error);
        }

    };


    return (

        <>

            {contextHolder}
            <Flex justify="center" align="center" className="login">
                <Card className="card-login" style={{ width: 500 }}>
                    <Row align={"middle"} justify={"center"} style={{ height: "400px" }}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <img
                                alt="logo"
                                style={{ width: "80%" }}
                                src={logo}
                                className="images-logo"
                            />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Form
                                name="basic"
                                onFinish={onFinish}
                                autoComplete="off"
                                layout="vertical"
                            >
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        { required: true, message: "Please input your username!" },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[
                                        { required: true, message: "Please input your password!" },
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="login-form-button"
                                        style={{ marginBottom: 20 }}
                                    >
                                        Log in
                                    </Button>
                                    Or <a onClick={() => navigate("/signup")}>signup now !</a>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Card>
            </Flex>
        </>
    );

}
export default SignInPages;*/


//ของกิ๊ฟ//
import { Button, Card, Form, Input, message, Row, Col } from 'antd';
import { useNavigate } from "react-router-dom";
import { SignIn } from "../../../services/https/login";
import { SignInInterface } from "../../../interfaces/SignIn";
import new_logo from "../../../assets/stock/new_logo.png";
import { UserOutlined, KeyOutlined } from '@ant-design/icons'; 
import backgroundImage from "../../../assets/bg.png"; // เพิ่มไฟล์รูปภาพพื้นหลัง



import './Login.css';

function SignInPages() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: SignInInterface) => {
        console.log(values)
        let res = await SignIn(values);
        console.log(res)
        if (res.status == 200) {
            messageApi.success("เข้าสู่ระบบสำเร็จ");
            localStorage.setItem("isLogin", "true");
            localStorage.setItem("page", "dashboard");
            localStorage.setItem("token_type", res.data.token_type);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("id", res.data.id);

            setTimeout(() => {
                location.href = "/";
            }, 1700);

        } else {
            messageApi.error(res.data.error);
        }

    };

  return (
    <>
      {contextHolder}
      <Row 
        justify="center" 
        align="middle" 
        className="login-container"
        style={{
          height: '100vh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat' 
        }}
      >
        <Card className="login-box">
          <Row justify="center">
            <Col>
              <img src={new_logo} alt="Logo" className="logo" />
            </Col>
          </Row>
          <Form name="login" onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
              style={{ marginBottom: '20px' }}
            >
              {/* <Input type="email" style={{ width: '106%' }}/> */}
              {/* <Input placeholder="  กรุณากรอก email" variant="filled" style={{ width: '106%' }} /> */}
              <Input 
                placeholder="กรุณากรอก email" 
                prefix={<UserOutlined />} 
                variant="filled" 
                style={{ width: '106%' }} 
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
              style={{ marginBottom: '20px' }}
            >
              {/* <Input.Password style={{ width: '106%' }}/> */}
              <Input.Password
                placeholder="กรุณากรอก password" 
                prefix={<KeyOutlined />} 
                variant="filled" 
                style={{ width: '106%' }} 
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-btn">
                Login
              </Button>
              {/* Or <a onClick={() => navigate("/signup")}>signup now !</a> */}
            </Form.Item>
          </Form>
        </Card>
      </Row>
    </>
  );
}

export default SignInPages;