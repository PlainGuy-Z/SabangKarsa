const jwt = require("jsonwebtoken");

exports.checkToken = async (req, res) => {
    let token;
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ error: "Token tidak ditemukan" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded) {
            return res.status(200).json({
                active: true,
                token,
            });
        }

        return res.status(200).json({
            active: false,
            token,
        })
    } catch (error) {
        return res.status(200).json({
            active: false,
        });
    }
}