const express = require("express");
const router = express.Router();

const {
  body
} = require("express-validator");
const validate = require("../middlewares/validation-req");

//Khai báo Controller để tiếp nhận yêu cầu
const TermController = require("../controllers/term");
const CheckAuthMiddleWare = require("../middlewares/check-auth");

// Lấy tất cả kì thi có sẵn
router.get(
  "/get-all-terms",
  CheckAuthMiddleWare.isAdmin,
  TermController.get_all_term
);

// Lấy một kì thi
router.get(
  "/get-one-term/:id",
  CheckAuthMiddleWare.isAdmin,
  TermController.get_one_term
);

// lấy toàn bộ kì thi có sẵn và trong kì hạn đăng kí
router.get(
  "/get-all-terms-active",
  CheckAuthMiddleWare.isAdmin,
  TermController.get_all_term_active
);

// Chỉnh sửa thông tin cho kì thi
router.post(
  "/modify/:id",
  CheckAuthMiddleWare.isAdmin,
  TermController.modify_term
);

// Thêm một kì thi
router.post(
  "/add-one-term",
  [
    body(['from', 'to']).isNumeric().isLength({max: 10}),
    body('name').isString().trim()
  ],
  validate.check,
  CheckAuthMiddleWare.isAdmin,
  TermController.add_one_term
);

module.exports = router;
