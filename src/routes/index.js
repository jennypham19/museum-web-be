// src/routes/v1/index.js
const express = require('express');

// Import các file route riêng lẻ
const authRoute = require('../routes/auth.route');
const packageRoute = require('../routes/package.route');
const userRoute = require('../routes/user.route');
const permissionRoute = require('../routes/permission.route');
const postRoute = require('../routes/post.route');
const uploadRoute = require('../routes/upload.route');
const displayRoute = require('../routes/display.route');

const router = express.Router();

// Tạo một mảng chứa các route và đường dẫn của chúng
const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/packages',
    route: packageRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/permissions',
    route: permissionRoute
  },
  {
    path: '/posts',
    route: postRoute
  },
  {
    path: '/image',
    route: uploadRoute
  },
  {
    path: '/display',
    route: displayRoute
  }
]

// Dùng vòng lặp để gắn tất cả các route vào router chính
defaultRoutes.forEach((routeEntry) => {
    router.use(routeEntry.path, routeEntry.route);
})

// Bạn có thể thêm các route chỉ dành cho môi trường development ở đây nếu cần
// if (config.env === 'development') {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }

module.exports = router;