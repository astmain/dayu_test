// This file is auto-generated, don't edit it
// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
import Dysmsapi20170525, { SendSmsRequest } from '@alicloud/dysmsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';
import * as $Util from '@alicloud/tea-util';
// import * as $tea from '@alicloud/tea-typescript';

export default class AliSmsClient {
  static client: Dysmsapi20170525;
  static runtime: $Util.RuntimeOptions;
  static initClient() {
    if (!this.runtime) {
      this.runtime = new $Util.RuntimeOptions({});
    }
    // 判断是否存在client
    if (!this.client) {
      const config = new $OpenApi.Config({
        accessKeyId: process.env['ALIBABA_CLOUD_ACCESS_KEY_ID'],
        accessKeySecret: process.env['ALIBABA_CLOUD_ACCESS_KEY_SECRET'],
      });
      config.endpoint = `dysmsapi.aliyuncs.com`;
      this.client = new Dysmsapi20170525(config);
    }
  }
  constructor() {
    AliSmsClient.initClient();
  }

  async main(_args: { code: number; phone: string }): Promise<any> {
    const { code, phone } = _args;
    const sendSmsRequest = new SendSmsRequest({
      signName: '泉州大宇三维打印科技',
      templateCode: 'SMS_476845523',
      phoneNumbers: phone,
      templateParam: `{"code":"${code}"}`,
    });
    try {
      // 复制代码运行请自行打印 API 的返回值
      const res = await AliSmsClient.client.sendSmsWithOptions(sendSmsRequest, AliSmsClient.runtime);
      return res;
    } catch (error) {
      // 此处仅做打印展示，请谨慎对待异常处理，在工程项目中切勿直接忽略异常。
      // 错误 message
      console.log(error.message);
      // 诊断地址
      console.log(error.data['Recommend']);
      return { message: error.message };
    }
  }
}
