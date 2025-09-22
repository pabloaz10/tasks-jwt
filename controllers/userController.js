const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require('../middlewares/authMiddleware')
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } })
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    const passwordIsValid = bcrypt.compareSync(
      password, user.password
    );
    if (!passwordIsValid) {
      return res.status(401)
        .send({ error: 'Invalid password' });
    }
    const token = generateToken(user);
    res.status(200).send({
      user: {
        id: user.id,
        name: user.name,
        username: user.username
      },
      token
    });

  } catch (error) {
    res.status(500).send({
      error: 'Error logging in',
      details: error,
    });
  }
};

const register = async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const newPassword = bcrypt.hashSync(password, 10);

    const user = await User.create(
      {
        name,
        username,
        password: newPassword
      }
    );

    res.status(201).send({
      user: {
        id: user.id,
        name: user.name,
        username: user.username
      },
      redirect: '/login'
    });


  } catch (error) {
    res.status(500).send({
      error: 'Error registering user',
      details: error,
    });
  }
};

module.exports = {
  login,
  register,
};
