import jwt, { JwtPayload } from 'jsonwebtoken';

const generateToken = (isModerator: boolean): string => {
    return jwt.sign({ isModerator }, process.env.PRIVATE_KEY, {
        expiresIn: '30d',
    });
};

const verifyToken = (token: string):  JwtPayload | null => {
    try {
        return jwt.verify(token, process.env.PRIVATE_KEY) as JwtPayload;
    } catch (error) {
        return null;
    };
};

export { generateToken, verifyToken };