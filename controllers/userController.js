const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  let filtered = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) {
      filtered[key] = obj[key];
    }
  });
  return filtered;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

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

// ISSO RELACIONADO AO ADMIN MANIPULANDO OS USUARIOS
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not implemented yet',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not implemented yet',
  });
};

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
