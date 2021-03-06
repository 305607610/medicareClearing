const fs = require("fs");
const path = require("path");
 
const AlipaySDK = require("alipay-sdk").default;
const AlipayFormData = require("alipay-sdk/lib/form").default;
 
const Controller = require("egg").Controller;
 
class AlipayController extends Controller {
  async index() {
    const { ctx } = this;
 
    const alipaySdk = new AlipaySDK({
      appId: "2016102400753319",
      privateKey: fs.readFileSync(
        path.join(__dirname, "../config/pem/app_private_key.pem"),
        "ascii"
      ), // 私钥
      signType: "RSA2", // 签名类型
      alipayPublicKey: fs.readFileSync(
        path.join(__dirname, "../config/pem/alipay_public_key.pem"),
        "ascii"
      ), // 支付宝公钥
      gateway: "https://openapi.alipaydev.com/gateway.do", // 网关地址
      timeout: 5000, // 网关超时时间
      camelcase: true // 是否把网关返回的下划线 key 转换为驼峰写法
    });
    /**
     * 返回支付链接（PC支付接口）
     */
    const formData = new AlipayFormData();
    formData.setMethod("get");
    formData.addField("appId", "2016102400753319");
    formData.addField("charset", "utf-8");
    formData.addField("signType", "RSA2");
    formData.addField("bizContent", {
      outTradeNo: "1569380127322",// 【必选】商户订单号：64个字符内，包含数字，字母，下划线；需要保证在商户端不重复
      productCode: "FAST_INSTANT_TRADE_PAY",// 【必选】销售产品码，目前仅支持FAST_INSTANT_TRADE_PAY
      totalAmount: "0.01",// 【必选】订单总金额，精确到小数点后两位
      subject: "test",// 【必选】 订单标题
      body: "test" // 【可选】订单描述
    });
    /**
     * exec对应参数：
     * method（调用支付宝api）
     * params（api请求的参数（包含“公共请求参数”和“业务参数”））
     * options（validateSign，formData，log）
     */
 
    const result = await alipaySdk.exec(
      "alipay.trade.page.pay",
      {},
      { formData }
    );
    console.log(result); // result为可以跳转到支付连接的url
    ctx.body = result;
  }
}
 
module.exports = AlipayController;