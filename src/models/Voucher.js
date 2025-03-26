const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Voucher code is required"],
    unique: true,
    uppercase: true,
    trim: true
  },
  value: {
    type: Number,
    required: [true, "Voucher value is required"],
    min: [0, "Value must be greater than or equal to 0"]
  },
  useLimit: {
    type: Number,
    default: 1, // Số lần một user có thể sử dụng
    min: [1, "Use limit must be at least 1"]
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0, "Quantity must be greater than or equal to 0"]
  },
  expireDate: {
    type: Date,
    required: [true, "Expire date is required"],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: "Expire date must be in the future"
    }
  }
}, { timestamps: true });

const Voucher = mongoose.model("Voucher", voucherSchema);

export default Voucher;
