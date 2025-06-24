const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

exports.login = async (req, res) => {
  const { name, password } = req.body;

  try {
    if (!name || !password) {
      return res.status(400).send({ message: 'Name and password are required.' });
    }

    // หา user จากชื่อก่อน
    const existingUser = await prisma.users.findFirst({
      where: { name: name },
    });

    if (existingUser) {
      // มี user แล้ว → ตรวจสอบ password
      const isMatch = await bcrypt.compare(password, existingUser.phone_number); // phone_number แทน hashed password
      if (!isMatch) {
        return res.status(401).send({ message: 'Invalid credentials.' });
      }

      return res.status(200).send({ message: 'Login successful.', user: existingUser });
    }

    // ยังไม่มี user → สร้างใหม่
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        name: name,
        phone_number: hashedPassword, // เก็บ password แบบแฮชไว้ใน phone_number
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
