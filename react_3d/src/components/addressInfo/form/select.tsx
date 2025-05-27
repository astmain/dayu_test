import { Cascader, CascaderProps } from "antd"



import { childrenJson } from "./area"

const SelectXzz: React.FC = () => {
  const { SHOW_CHILD } = Cascader

  interface Option {
    label: string
    value: string
    children?: Option[]
  }
  const { formData, setFormData } = useConsigneeStore((state) => state)
  // const [childrenJson, setChildrenJson] = useState<Option2[]>([])
  const onChange: CascaderProps<Option>["onChange"] = (
    value: (string | number | Option[])[],
    _selectedOptions: Option[],
  ) => {
    setFormData({ region: value as number[] })
  }

  return (
    <>
      <Cascader
        style={{ height: "56px", width: "576px" }}
        options={childrenJson}
        onChange={onChange}
        showCheckedStrategy={SHOW_CHILD}
        displayRender={(label) => label.join("/")}
        multiple={false}
        popupClassName="custom-cascader-menu"
        allowClear={false}
        // value={formData.region}
        expandTrigger="click"
        fieldNames={{ label: "label", value: "value", children: "children" }}
      />
    </>
  )
}

export default SelectXzz
