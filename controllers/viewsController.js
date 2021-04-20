const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', { title: 'All Tours', tours });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'user review rating',
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  res.status(200).render('tour', { title: `${tour.name} Tour`, tour });
});

exports.getLogin = (req, res) => {
  res.status(200).render('login', {
    title: 'Login',
  });
};

exports.getSignup = (req, res) => {
  res.status(200).render('signup', {
    title: 'Signup',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account',
  });
};

// exports.updateUserData = catchAsync(async (req, res) => {
//   const { name, email } = req.body;
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     { name, email },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   res.status(200).render('account', {
//     title: 'Your Account',
//     user: updatedUser,
//   });
// });
