const express = require("express");
const router = express.Router();

// khai báo thư viện validator
const {
    body
} = require("express-validator");
const validate = require("../middlewares/validation-req");

//Khai báo Controller để tiếp nhận yêu cầu
const CourseControllers = require("../controllers/course");

// Khai báo middleWare để kiểm tra client gửi request
const CheckAuthMiddleWare = require("../middlewares/check-auth");

// Lấy toàn bộ học phần
router.get(
    "/get-all-courses",
    CheckAuthMiddleWare.isAdmin,
    CourseControllers.get_all_courses
);

// Lấy một học phần
router.get(
    "/get-one-course/:id",
    CheckAuthMiddleWare.isAdmin,
    CourseControllers.get_one_course
);

// Thêm sinh viên đủ/không đủ điều kiện thi cho học phần
router.post(
    "/add-student-for-course/:id",
    [
        body(['data.*.fullName', 'data.*.mssv']).isString().trim(),
        body('data.*.active').isBoolean()
    ],
    validate.check,
    CheckAuthMiddleWare.isAdmin,
    CourseControllers.add_students_for_course
);

//Thêm một học phần
router.post(
    "/add-one-course",
    [
        body(['course_name', 'course_code', 'course_teacher', 'course_of']).isString().trim().escape()
    ],
    validate.check,
    CheckAuthMiddleWare.isAdmin,
    CourseControllers.add_one_course
);

//sửa 1 học phần
router.post(
    "/update-one-course/:id",
    [
        body('active').isBoolean()
    ],
    validate.check,
    CheckAuthMiddleWare.isAdmin,
    CourseControllers.update_one_course
);

// chọn kì thi cho học phần
router.post(
    "/set-term-for-courses",
    [
        body(['courses.*.id', 'courses.*.course_code', 'courses.*.course_name', 'term.id', 'term.name']).isString().trim().escape()
    ],
    validate.check,
    CheckAuthMiddleWare.isAdmin,
    CourseControllers.set_term_for_courses
);

module.exports = router;