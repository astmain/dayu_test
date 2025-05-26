import { Button, Form, Input, Select } from "antd"

import LoginAgree from "@/components/LoginAgree"
import useCountdown from "@/hooks/useCountdown"
import { useTryApi } from "@/hooks/useTryApi"
// 引入获取验证码接口 注册用户接口 --
import { RegisterData, Verification } from "@/network/api/login"
import { GetVerificationData } from "@/network/api/login/api-params-moudle"
import { RegPhoneRes } from "@/network/api/login/api-res-model"
import { validatePassword, validatePhoneNumber, validateVerificationCode } from "@/utils/validators"

const { Option } = Select

// 手机注册页面
function MobileregistrationpageLqh() {
  const { setCurrentComponent, setTipTitleLqh } = useLoginStore((state) => {
    return state
  })

  // 倒计时方法
  const { remainingTime, startCountdown } = useCountdown(60, "PhoneReg")

  // 手机注册接口优化代码
  const { request } = useTryApi<RegPhoneRes>({
    title: "注册成功,正在进入登录",
    apiFunction: RegisterData,
    handler: (data: RegPhoneRes) => {
      // 注册成功状态跳转到登录页面
      const { token } = data
      // 用户注册成功判断后端有返回token值的情况下跳转到首页
      if (token) {
        setCurrentComponent("login")
      }
    },
    onError: (error: any) => {
      console.error("注册失败:", error)
    },
  })

  const onFinish = async (values: { name: string; code: string; phone: string; password: number }) => {
    setTipTitleLqh("正在注册...")
    request(values)
  }
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed123:", errorInfo)
  }

  const [form] = Form.useForm()

  // 点击获取验证码
  const handleGetCaptcha = async () => {
    try {
      const phoneValue = form.getFieldValue(["phone"])
      await validatePhoneNumber(phoneValue)
      const data: GetVerificationData = {
        phone: phoneValue, //传默认手机号给获取验证码接口
        type: "register", //明确指定类型--注册
      }

      // 内层调用获取验证码接口
      try {
        // 调用获取验证码接口
        const res = await Verification(data)
        console.log("-----成功情况", res)
        // if (res.successful) {
        // }
        // 捕获内层错误
      } catch (error) {
        console.log("错误情况", error)
      }
      startCountdown() // 开始倒计时
    } catch (errorInfo) {
      //捕获外层错误 失败的状态
      console.log("校验失败:", errorInfo)
      // 不需要手动处理错误提示，Form.Item 会自动显示
    }
  }

  const prefixSelector = (
    <Form.Item noStyle>
      <Select
        defaultValue="86"
        className="w-[92] h-[66px] leading-[66px] text-[18px]"
        labelRender={(props: any) => {
          return (
            <div className="text-[18px]">
              <i className={"iconfont icon-shouji text-[#1366F0] w-[18px] h-[50px]"}></i>
              {"+"} {props.value}
            </div>
          )
        }}
      >
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  )

  return (
    <div className="flex h-[100%] flex-col justify-center items-center">
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        initialValues={{
          prefix: "86",
          phone: "13077908822",
        }}
        form={form}
      >
        <Form.Item
          name="username"
          className="text-left"
          rules={[
            {
              required: true,
              message: "请设置账户名（例如：DAYU-3D）",
            },
          ]}
        >
          <Input
            className="w-[430px] h-[66px] leading-[66px] text-[18px]"
            prefix={<i className={"iconfont icon-zhanghao text-[#1366F0] w-[20px]"}></i>}
            placeholder="请设置账户名（例如：DAYU-3D）"
            onChange={(e) => form.setFieldValue("name", e.target.value.replaceAll(" ", ""))}
          />
        </Form.Item>

        <Form.Item
          name="phone"
          className="text-left"
          rules={[
            {
              validator: (_, value) => validatePhoneNumber(value),
            },
          ]}
        >
          <Input
            addonBefore={prefixSelector}
            placeholder="请输入手机号"
            className="bind-phone-number"
            maxLength={11}
            onChange={(e) => form.setFieldValue("phone", e.target.value.replaceAll(" ", ""))}
          />
        </Form.Item>
        <Form.Item
          name="code"
          className="text-left"
          rules={[
            {
              validator: (_, value) => validateVerificationCode(value),
            },
          ]}
        >
          <Input
            prefix={<i className={"iconfont icon-yanzhengma w-[20px] text-[#1366F0]"}></i>}
            className="w-[430px] h-[66px] leading-[66px] text-[18px] text-[#999999]"
            placeholder="请输入验证码"
            onChange={(e) => form.setFieldValue("code", e.target.value.replaceAll(" ", ""))}
            maxLength={6}
            suffix={
              <Button onClick={handleGetCaptcha} disabled={remainingTime > 0} type="link" className="text-[18px]">
                {remainingTime || "获取验证码"}
              </Button>
            }
          />
        </Form.Item>
        <Form.Item
          name="password"
          className="text-left"
          rules={[
            {
              validator: (_, value) => validatePassword(value),
            },
          ]}
        >
          <Input.Password
            className="w-[430px] mb-[0px] h-[66px] leading-[66px] text-[18px]"
            prefix={<i className={"iconfont icon-mima text-[#1366F0] w-[20px]"}></i>}
            type="password"
            maxLength={12}
            placeholder="请输入密码"
            autoComplete="off" //关闭自动填充,用户每次都需要手动输入内容。
            onChange={(e) => form.setFieldValue("password", e.target.value.replaceAll(" ", ""))}
          />
        </Form.Item>

        <Form.Item>
          <Button className="w-[430px] h-[66px] leading-[66px] text-[22px]" type="primary" htmlType="submit">
            完成注册
          </Button>
        </Form.Item>

        <Form.Item>
          <div className="w-[430px] text-center">
            <span className="text-[16px] inline-block mr-[8px]">已有账号?</span>
            <span className="text-[16px] text-[#1366F0] cursor-pointer" onClick={() => setCurrentComponent("login")}>
              点此登录
            </span>
          </div>
        </Form.Item>

        <Form.Item className="mb-[0]">
          <LoginAgree />
        </Form.Item>
      </Form>
    </div>
  )
}

export default MobileregistrationpageLqh
