const { PrismaClient } = require("@prisma/client");
const jsonwebtoken = require("jsonwebtoken");
const prisma = new PrismaClient();

const createUser = async (user) => {
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      name: user.name,
    },
  });

  return newUser;
};

const loginUser = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) return null;

  const token = jsonwebtoken.sign({ id: user.id, email: user.email }, "abc123");

  return token;
};

module.exports = {
  createUser,
  loginUser,
};
