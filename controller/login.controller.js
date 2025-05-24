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

    const user = await prisma.users.findFirst({
      where: { phone_number: phone },
   
    });

    if (!user) {
      const newUser = await prisma.users.create({
        data: { 
          name: name,
          phone_number:phone },
      });
      return res.status(201).send({ message: 'User created successfully.', user: newUser });
    } else {
      return res.status(200).send({ message: 'Login successful.', user });
    }

  } catch (error) {
    return res.status(500).send({
      message: 'An error occurred.',
      error: error.message,
    });
  }
};
