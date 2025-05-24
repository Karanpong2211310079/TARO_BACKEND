const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
exports.redeem = async (req, res) => {
    const { code, user_id } = req.body;
  
    try {
      if (!code || !user_id) {
        return res.status(400).send({
          success: false,
          message: 'Code and user_id are required.'
        });
      }
  
      const CheckCode = await prisma.secret_codes.findFirst({
        where: {
          code: code,
          is_used: false
        }
      });
  
      const CheckUser = await prisma.users.findFirst({
        where: {
          user_id: user_id
        }
      });
  
      if (!CheckCode) {
        return res.status(404).send({
          success: false,
          message: 'Code not found or already redeemed.'
        });
      }
  
      if (!CheckUser) {
        return res.status(404).send({
          success: false,
          message: 'User not found.'
        });
      }
  
      await prisma.secret_codes.update({
        where: { id: CheckCode.id },
        data: { is_used: true },
      });
  
      const updateUserToken = await prisma.users.update({
        where: { user_id: user_id },
        data: { token: CheckUser.token + 1 },
      });
  
      return res.status(200).send({
        success: true,
        message: 'Redeem Code Success',
        user: updateUserToken
      });
  
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: 'An error occurred.',
        error: error.message
      });
    }
  };
  