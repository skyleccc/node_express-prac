const userService = require("../services/userService");

const registerController = async (req, res) => {
    const {email, name} = req.body;
    const user = await userService.createUser({ email, name });

    res.json(user);
}

const loginController = async (req, res) => {
    const { email } = req.body;
    const token = await userService.loginUser(email);

    if(!token){
        return res.status(401).json({ message: "Invalid email" });
    }

    res.json({ token });
}

module.exports = {
    registerController,
    loginController,
}