const express = require("express");
const router = express.Router();
const {
    body
} = require("express-validator");
const validate = require("../middlewares/validation-req");
//Khai báo Controller để tiếp nhận yêu cầu
const SessionController = require("../controllers/session");

const CheckAuthMiddleWare = require("../middlewares/check-auth");

// Lấy một ca thi
router.get(
    "/get-one-session/:id",
    CheckAuthMiddleWare.isAdmin,
    SessionController.get_one_session
);

// Lấy các sinh viên đã đăng kí thi tại phòng này
router.get(
    "/students-in-room/:id",
    CheckAuthMiddleWare.isAdmin,
    SessionController.get_students_in_room
);

// Thêm một ca thi
router.post(
    "/add-one-session",
    [
        body("date").isNumeric().isLength({max:10}),
        body("duration").isNumeric().isLength({max: 3}),
        body(['from', 'name', 'term_id']).isString(),
        body(['selected.*.id', 'selected.*.course_code', 'selected.*.course_name']).isString(),
    ],
    validate.check,
    CheckAuthMiddleWare.isAdmin,
    SessionController.set_one_session
);

// Hủy bỏ một hoặc nhiều ca thi của học phần
router.post(
    "/disable-multi-session-of-a-course",
    [
        body(['term_id', 'course_id', 'session_to_remove.*']).isString().trim(),
    ],
    validate.check,
    CheckAuthMiddleWare.isAdmin,
    SessionController.disable_session_of_course
);

// Chỉnh sửa thông tin của phòng thi
router.post(
    "/modify-room-in-session",
    [
        body(['id', 'session_id', 'mode', 'place']).isString().trim(),
        body(['length', 'room_num']).isNumeric(),
    ],
    validate.check,
    CheckAuthMiddleWare.isAdmin,
    SessionController.modify_room_in_session
);

module.exports = router;