import { Button, Form, Input, Radio, Select, Space } from "antd"

// 引入新的弹框组件 ModalLqh2
import ModalLqh2 from "@/components/ModalLqh2"
import XzzBtn from "@/components/XzzBtn"
import { useSimpleTryApi } from "@/hooks/useTryApi"
import { createInvoiceApi, updateInvoiceApi } from "@/network/api/invoice"

interface InvoiceFormXzzProps {
  updateInvoiceList: () => void
}

const InvoiceFormXzz: React.FC<InvoiceFormXzzProps> = ({ updateInvoiceList }) => {
  const [form] = Form.useForm()
  const { editInvoiceModalVisible, setEditInvoiceModalVisible, isUpdate, editFormData, updateEditFormData } =
    useInvoiceStore((state) => state)
  // setInterval(() => {
  //   console.log("🚀 ~ editFormData:", editFormData)
  // }, 1000)

  const invoiceType = Form.useWatch("invoice_type", form) // 监听字段变化
  useEffect(() => {
    form.setFieldsValue(editFormData)
  }, [editFormData])

  const closeModal = () => {
    setEditInvoiceModalVisible(false)
    form.resetFields()
  }
  const { request, loading } = useSimpleTryApi({
    title: isUpdate ? "修改发票成功" : "添加发票成功",
    apiFunction: isUpdate ? updateInvoiceApi : createInvoiceApi,
    handler: () => {
      closeModal()
      updateInvoiceList()
    },
  })
  const onFinish = async (values: any) => {
    request(values)
  }

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 114,
          height: "46px",
          lineHeight: "46px",
          fontSize: "18px",
        }}
        labelRender={(props: any) => {
          return (
            <div style={{ fontSize: "18px" }}>
              <i className={"iconfont icon-shouji"} style={{ color: "#1366F0", width: "36px", height: "50px" }}></i>
              {"+"} {props.value}
            </div>
          )
        }}
      >
        <Select.Option value="86">+86</Select.Option>
        <Select.Option value="87">+87</Select.Option>
      </Select>
    </Form.Item>
  )
  return (
    <ModalLqh2
      open={editInvoiceModalVisible}
      onCancel={closeModal}
      onOk={closeModal}
      width="820px"
      title={isUpdate ? "修改发票" : "添加新发票"}
      classname="custom-modal-add-fp"
      closable={true} //显示右上角关闭按钮 />
      content={
        // h-[50vh] --需要用动态类名--来控制个人页面和企业页面的不同高度显示
        <div className={`p-[30px] pb-[0] w-[820px]`}>
          <Form
            {...{ labelCol: { span: 3 }, wrapperCol: { span: 21, offset: 1 } }}
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <Form.Item
              name="invoice_type"
              label="账号主体"
              rules={[{ required: true }]}
              style={{ height: "46px", lineHeight: "46px" }}
            >
              <Radio.Group>
                <Radio value="person">个人</Radio>
                <Radio value="company">企业</Radio>
              </Radio.Group>
            </Form.Item>

            {invoiceType == "person" ? (
              <>
                <Form.Item
                  name="name"
                  label="个人姓名"
                  rules={[{ required: true }]}
                  style={{ height: "46px", lineHeight: "46px" }}
                >
                  <Input style={{ height: "46px" }} />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[{ required: true }, { type: "email", message: "请输入正确的邮箱地址" }]}
                  style={{ height: "46px", lineHeight: "46px" }}
                >
                  <Input style={{ height: "46px" }} />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  name="bank_name"
                  label="企业名称"
                  rules={[{ required: true }]}
                  style={{ height: "46px", lineHeight: "46px" }}
                >
                  <Input style={{ height: "46px" }} />
                </Form.Item>
                <Form.Item
                  name="tax_no"
                  label="税号"
                  rules={[{ required: true }]}
                  style={{ height: "46px", lineHeight: "46px" }}
                >
                  <Input style={{ height: "46px" }} />
                </Form.Item>
                <Form.Item
                  name="bank_no"
                  label="开户行"
                  rules={[{ required: true }]}
                  style={{ height: "46px", lineHeight: "46px" }}
                >
                  <Input style={{ height: "46px" }} />
                </Form.Item>
                <Form.Item
                  name="address"
                  label="地址"
                  rules={[{ required: true }]}
                  style={{ height: "46px", lineHeight: "46px" }}
                >
                  <Input style={{ height: "46px" }} />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[{ required: true }, { type: "email", message: "请输入正确的邮箱地址" }]}
                  style={{ height: "46px", lineHeight: "46px" }}
                >
                  <Input style={{ height: "46px" }} />
                </Form.Item>
              </>
            )}

            <Form.Item
              name="phone"
              label="手机号码"
              rules={[{ required: true }]}
              style={{ height: "46px", lineHeight: "46px" }}
            >
              <Input style={{ height: "46px" }} addonBefore={prefixSelector} classNames={{ input: "h-[46px]" }} />
            </Form.Item>

            <Form.Item
              name="code"
              label="验证码"
              rules={[{ required: true }]}
              style={{ height: "46px", lineHeight: "46px" }}
            >
              <Input style={{ height: "46px", lineHeight: "46px" }} suffix={<CodeBtn />} />
            </Form.Item>

            {/* 3.24lqh添加新发票企业添加一个发票类型代码 */}
            <Form.Item name="InvoiceType" label="发票类型" rules={[{ required: true }]}>
              <div
                style={{
                  display: "flex",
                }}
                className="text-[#222] text-[18px]"
              >
                <div style={{ marginRight: "30px" }}>
                  <XzzBtn00
                    disabled={editFormData.invoice_type == "个人"}
                    border={editFormData.invoiceType == "special"}
                    onClick={() => updateEditFormData({ invoiceType: "special" })}
                  >
                    <div>增值税专用发票</div>
                    <div
                      style={{
                        color: "#fff",
                        background: "#1366F0",
                        borderRadius: "8px 0px",
                        fontSize: "14px",
                        padding: "0 14px",
                        position: "absolute",
                        top: "0",
                        left: "-1px",
                      }}
                    >
                      可抵税
                    </div>
                  </XzzBtn00>
                </div>
                <div>
                  <XzzBtn00
                    border={editFormData.invoiceType == "normal"}
                    onClick={() => updateEditFormData({ invoiceType: "normal" })}
                  >
                    <div>增值税普通发票</div>
                    <div
                      style={{
                        color: "#999",
                        background: "#F5F5F5",
                        borderRadius: "8px 0px",
                        fontSize: "14px",
                        padding: "0 14px",
                        position: "absolute",
                        top: "0",
                        left: "0",
                      }}
                    >
                      不可抵税
                    </div>
                  </XzzBtn00>
                </div>
              </div>
            </Form.Item>

            <Form.Item
              {...{ wrapperCol: { span: 24 } }}
              style={{ marginBottom: "auto", display: "flex", justifyContent: "center", paddingBottom: "30px" }}
            >
              <Space size={20}>
                <XzzBtn htmlType="button">
                  <div style={{ width: "98px" }} onClick={closeModal}>
                    取消
                  </div>
                </XzzBtn>
                <XzzBtn type="primary" htmlType="submit" loading={loading}>
                  <div style={{ width: "98px" }}>保存</div>
                </XzzBtn>
              </Space>
            </Form.Item>
          </Form>
        </div>
      }
    />
  )
}

const CodeBtn = () => {
  const [count, setCount] = useState(10)
  const [isCode, setIsCode] = useState(true)

  useEffect(() => {
    let timer: any = null
    if (count > 0 && !isCode) {
      timer = setInterval(() => {
        setCount((prev) => prev - 1)
      }, 1000)
    } else {
      setCount(10)
      setIsCode(true)
    }
    return () => {
      clearInterval(timer)
    }
  }, [count, isCode])

  const getCode = () => {
    setIsCode(false)
    // 获取验证码的逻辑
    console.log("获取验证码")
    // 使用定时器 倒数count 到0 时暂停  并重置为10 isCode 设为true
  }

  {
    return isCode ? (
      <Button type="link" style={{ fontSize: "18px" }} onClick={getCode}>
        获取验证码
      </Button>
    ) : (
      <div style={{ fontSize: "18px", width: "122px", textAlign: "center" }}>{count}</div>
    )
  }
}

// 3.24 以下是lqh添加的发票类型代码
interface XzzBtn00Props {
  children: React.ReactNode
  disabled?: boolean
  border?: boolean
  onClick?: () => void
}
const XzzBtn00: React.FC<XzzBtn00Props> = (props) => {
  const { children, disabled = false, border = false, ...rest } = props
  const btnStyle: any = {
    height: "90px",
    borderRadius: "8px",
    fontFamily: "Microsoft YaHei",
    fontWeight: 400,
    Position: "relative",
    width: "300px",
    border: border ? "1px solid #1677ff" : "",
  }

  return (
    <Button style={btnStyle} disabled={disabled} {...rest}>
      <div className="text-[18px]">{children}</div>
    </Button>
  )
}
export default InvoiceFormXzz
