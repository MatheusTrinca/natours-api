const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError('File is not an image. Please upload only images', 400),
      false
    );
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.resizeImage = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 }) // 90%
    .toFile(`public/img/users/${req.file.filename}`);
  next();
};

exports.uploadUserPhoto = upload.single('photo');

const filterObj = (obj, ...allowedFields) => {
  const filtered = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) {
      filtered[key] = obj[key];
    }
  });
  return filtered;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create Error if try to update password in this route
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. To update password, please use /updateMyPassword',
        400
      )
    );
  }
  // 2) Filter only allowed filters to update
  const fields = filterObj(req.body, 'name', 'email');

  if (req.file) {
    fields.photo = req.file.filename;
  }

  // 3) Update User
  const updatedUser = await User.findByIdAndUpdate(req.user.id, fields, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user.id,
    { active: false },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUserId = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// ISSO RELACIONADO AO ADMIN MANIPULANDO OS USUARIOS
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route does not exists. Please use /signup.',
  });
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
