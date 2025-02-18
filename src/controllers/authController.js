import { User } from "../models/userModel.js";

// register user controller
const registerUser = async (req, res) => {
    try {
        const { fName, lName, email, phone, password, confirmPassword } =
            req.body;

        // check if all fields are empty
        if (
            !fName &&
            !lName &&
            !email &&
            !phone &&
            !password &&
            !confirmPassword
        ) {
            return res.status(400).json({
                status: "error",
                message: "All fields are required",
            });
        }

        // check if password and confirm password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                status: "error",
                message: "Confirm password and password must match",
            });
        }

        // check if user already exists
        const existedUser = await User.findOne({
            $or: [{ email }, { phone }],
        });
        if (existedUser) {
            return res.status(409).json({
                status: "errpr",
                message: "User with this email or phone already exists.",
            });
        }

        // create the user
        const user = await User.create({
            fName,
            lName,
            email,
            phone,
            password,
        });

        // remove the password field in res
        const createdUser = await User.findById(user._id).select("-password");

        return res.status(200).json({
            status: "success",
            message: "User created successfully.",
            data: createdUser,
        });
    } catch (error) {
        console.error(`Internal Server Error : ${error}`);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
};

// login user controller
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if all fields are empty
        if (!email && !password) {
            return res.status(400).json({
                status: "error",
                message: "All fields are required",
            });
        }

        // find the user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User doesnot exists.",
            });
        }

        // check the password
        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: "error",
                message: "Invalid password",
            });
        }

        // generate access token
        const accessToken = await user.generateAccessToken();

        const foundUser = await User.findById(user._id).select("-password");

        const data = {
            accessToken,
            user: foundUser,
        };

        return res.status(201).json({
            status: "success",
            message: "Login successfull",
            data,
        });
    } catch (error) {
        console.error(`Internal Server Error : ${error}`);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
};

// logoutuser controller
const logoutUser = async () => {};

// renew jwt
const renewJwt = async () => {};

export { registerUser, loginUser, logoutUser, renewJwt };
