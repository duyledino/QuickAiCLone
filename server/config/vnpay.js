import { VNPay, ignoreLogger } from "vnpay";
import "dotenv/config";

const vnpay = new VNPay({
  // ⚡ Cấu hình bắt buộc
  tmnCode: `${process.env.vnp_TmnCode}`,
  secureSecret: `${process.env.vnp_HashSecret}`,
  vnpayHost: "https://sandbox.vnpayment.vn",
  // 🔧 Cấu hình tùy chọn
  testMode: true, // Chế độ test
  hashAlgorithm: "SHA512", // Thuật toán mã hóa
  enableLog: true, // Bật/tắt log
  loggerFn: ignoreLogger, // Custom logger

  // 🔧 Custom endpoints
  endpoints: {
    paymentEndpoint: "paymentv2/vpcpay.html",
    queryDrRefundEndpoint: "merchant_webapi/api/transaction",
    getBankListEndpoint: "qrpayauth/api/merchant/get_bank_list",
  },
});

export default vnpay;
