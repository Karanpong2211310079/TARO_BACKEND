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

    // เช็คว่ามี user ที่ชื่อเดียวกันหรือเบอร์เดียวกันไหม
    const existingUserByName = await prisma.users.findFirst({
      where: { name: name },
    });
    if (existingUserByName) {
      return res.status(400).send({ message: 'Name is already taken.' });
    }

    const existingUserByPhone = await prisma.users.findFirst({
      where: { phone_number: phone },
    });
    if (existingUserByPhone) {
      return res.status(400).send({ message: 'Phone number is already taken.' });
    }

    // ถ้าไม่ซ้ำ สร้าง user ใหม่
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
