exports.createPostValidator = (req,res,next) =>{
  //title Validator
  req.check("title","Write a title").notEmpty();
  req.check("title","Title must be between 4 to 150 characters").isLength({
    min:4,
    max:150
  });
// Body Validator
  req.check("body","Write a body").notEmpty();
  req.check("body","Body must be between 4 to 2000 characters").isLength({
    min:4,
    max:2000
  });

  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors[0].msg;
    return res.status(400).json({error:firstError});
  }
  next();
}

exports.userSignupValidator = (req,res,next) => {
  req.check('name','Please enter something in name').notEmpty().withMessage('Cannot be empty');

  req.check('email','Please enter something in name')
  .matches(/.+\@.+\..+/)
  .withMessage('Email must contain @')
  .isLength({
    min:4,
    max:2000
  });

  req.check('password','Please enter something in name').notEmpty();
  req.check('password').isLength({min:6})
  .withMessage('Password must contain atleast 6 characters')
  .matches(/\d/)
  .withMessage('Password must contain a number')

  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors[0].msg;
    return res.status(400).json({error:firstError});
}

  next();
}
