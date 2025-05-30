const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
exports.login = async (req, res) => {
  const { name, phone } = req.body;

  try {
    if (!name || !phone) {
      return res.status(400).send({ message: 'Name and phone are required.' });
    }

    // หา user ที่มีเบอร์นี้
    const existingUserByPhone = await prisma.users.findFirst({
      where: { phone_number: phone },
    });

    if (existingUserByPhone) {
      // ถ้าเจอเบอร์แล้ว เช็คว่าชื่อที่ส่งมาเหมือนกับใน DB หรือเปล่า
      if (existingUserByPhone.name !== name) {
        // ชื่อไม่ตรงกับเบอร์ที่มีอยู่ ไม่อนุญาต
        return res.status(400).send({ message: 'Phone number is already registered with a different name.' });
      }

      // ถ้าชื่อและเบอร์ตรงกัน → login สำเร็จ
      return res.status(200).send({ message: 'Login successful.', user: existingUserByPhone });
    }

    // ถ้าเบอร์ยังไม่เคยมีในระบบ → เช็คว่าชื่อซ้ำไหม (ชื่อซ้ำไม่ได้)
    const existingUserByName = await prisma.users.findFirst({
      where: { name: name },
    });
    if (existingUserByName) {
      return res.status(400).send({ message: 'Name is already taken.' });
    }

    // ถ้าไม่ซ้ำเลย → สร้าง user ใหม่ (สมัครใหม่)
    const newUser = await prisma.users.create({
      data: {
        name: name,
        phone_number: phone,
      },
    });

    return res.status(201).send({ message: 'User created successfully.', user: newUser });

  } catch (error) {
    return res.status(500).send({
      message: 'An error occurred.',
      error: error.message,
    });
  }
};
