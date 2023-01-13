/* eslint-disable @typescript-eslint/no-non-null-assertion */
import jwt from "jsonwebtoken";
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
}
function generateRefreshToken(user, req) {
    req.session.refreshToken = [];
    const token = req.session.refreshToken;
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "2d" });
    token.push(refreshToken);
    console.log(req.user);
    return refreshToken;
}
function refreshToken(req, res) {
    return res.json("token refresh");
}
export { generateAccessToken, generateRefreshToken, refreshToken };
