const router = require('express').Router();
const userRouter = require('./userRoute');
const articleRouter = require('./articleRoute');

router.use(userRouter);
router.use(articleRouter);

module.exports = router;
