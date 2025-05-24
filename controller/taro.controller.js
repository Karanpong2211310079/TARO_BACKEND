const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})


exports.getTaroCard = async (req, res) => {
    try{
        const taroCard = await prisma.cards.findMany();
        return res.status(200).send({
            message: 'Get Taro Card Success',
            data: taroCard
        })

    }catch(error){
        return res.status(500).send({
            message: 'An error occurred.',
            error: error.message
        })
    }
}

exports.getTaroCardById = async (req, res) => {
    const { id } = req.params;
    try{
        const taroCard = await prisma.taro_card.findUnique({
            where: {
                id: Number(id)
            }
        });
        if(!taroCard){
            return res.status(404).send({
                message: 'Taro Card Not Found'
            })
        }
        return res.status(200).send({
            message: 'Get Taro Card Success',
            data: taroCard
        })

    }catch(error){
        return res.status(500).send({
            message: 'An error occurred.',
            error: error.message
        })
    }
}
exports.createTaroCard = async (req, res) => {
    const { name, image, description } = req.body;
  
    try {
      // เช็คว่ามีข้อมูลครบไหม
      if (!name || !image || !description) {
        return res.status(400).send({
          message: 'Name, image และ description จำเป็นต้องกรอกให้ครบ',
        });
      }
  
      // บันทึกข้อมูลลงในฐานข้อมูล
      const newTaroCard = await prisma.cards.create({
        data: {
          name,
          image_url: image,
          description,
        },
      });
  
      // ส่ง response กลับ
      return res.status(201).send({
        message: 'สร้าง Taro Card สำเร็จ',
        data: newTaroCard,
      });
  
    } catch (error) {
      // ดัก error กรณีเกิดปัญหา
      return res.status(500).send({
        message: 'เกิดข้อผิดพลาดในการสร้าง Taro Card',
        error: error.message,
      });
    }
}
exports.AddTaroCard = async (req, res) => {
  const { card_id, user_id } = req.body;
  
  // ตรวจสอบว่า card_id และ user_id มาหรือไม่
  if (!card_id || !user_id) {
      return res.status(400).send({
          message: 'Card ID and User ID are required.'
      });
  }

  try {
      // ตรวจสอบว่า user มีการ์ดนี้อยู่แล้วหรือไม่
      const userCard = await prisma.user_cards.findFirst({
          where: {
              card_id: card_id,
              user_id: user_id
          }
      });

      // ถ้ามีการ์ดนี้แล้ว ให้ตอบกลับว่า User Card Already Exist
      if (userCard) {
          return res.status(400).send({
              message: 'User Card Already Exist'
          });
      }

      // ถ้าไม่มีการ์ดนี้, สร้างการ์ดใหม่
      const newUserCard = await prisma.user_cards.create({
          data: {
              card_id: card_id,
              user_id: user_id
          }
      });

      // ส่ง response กลับไปว่าเพิ่มการ์ดสำเร็จ
      return res.status(201).send({
          message: 'Add Taro Card Success',
          data: newUserCard
      });

  } catch (error) {
      // ถ้ามีข้อผิดพลาดเกิดขึ้น ให้ตอบกลับด้วย error
      return res.status(500).send({
          message: 'An error occurred.',
          error: error.message
      });
  }
};
