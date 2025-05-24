const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})


exports.getUserProfile = async (req, res) => {
    try{
        const userProfile = await prisma.users.findMany();
        return res.status(200).send({
            message: 'Get User Profile Success',
            data: userProfile
        })

    }catch(error){
        return res.status(500).send({
            message: 'An error occurred.',
            error: error.message
        })
    }
}
exports.updateUserPoint = async (req, res) => {
    let { id, point } = req.body;
  
    try {
      if (!id || point === undefined) {
        return res.status(400).send({ message: 'ID and point are required.' });
      }
  
      id = parseInt(id); // ✅ แปลง id เป็น Int
  
      const user = await prisma.users.findFirst({
        where: { user_id : id },
      });
  
      if (!user) {
        return res.status(404).send({ message: 'User not found.' });
      }
  
      const updatePoint = await prisma.users.update({
        where: { user_id: id },
        data: { token: point },
      });
  
      return res.status(200).send({
        message: 'Update User Point Success',
        data: updatePoint
      });
  
    } catch (error) {
      return res.status(500).send({
        message: 'An error occurred.',
        error: error.message
      });
    }
  };
exports.getUsercard = async (req, res) => {
  const { user_id } = req.body; // หรือ req.body ก็ได้ถ้าส่งใน body

  if (!user_id) {
      return res.status(400).send({
          message: 'User ID is required.'
      });
  }

  try {
      // ค้นหาการ์ดทั้งหมดที่ผู้ใช้คนนี้ครอบครอง
      const userCards = await prisma.user_cards.findMany({
          where: {
              user_id: user_id // ใช้ user_id เพื่อค้นหาการ์ดของผู้ใช้
          },
          include: {
            cards: true, // ถ้าคุณต้องการข้อมูลจากตาราง card เช่นชื่อการ์ดหรือข้อมูลอื่น ๆ ที่เชื่อมโยงกับ card_id
          }
      });

      // ถ้าผู้ใช้ไม่มีการ์ด
      if (!userCards.length) {
          return res.status(404).send({
              message: 'No cards found for this user.'
          });
      }

      return res.status(200).send({
          message: 'User Cards retrieved successfully',
          data: userCards
      });

  } catch (error) {
      return res.status(500).send({
          message: 'An error occurred.',
          error: error.message
      });
  }
};
  