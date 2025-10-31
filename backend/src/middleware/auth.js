import jwt from 'jsonwebtoken';


export const requireAuth = (req, res, next) => {
const token = req.cookies.atk;
if (!token) return res.status(401).json({ error: 'Not authenticated' });
try {
const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
req.user = decoded;
next();
} catch (e) {
return res.status(401).json({ error: 'Invalid/expired token' });
}
};


export const requireRole = (roles = []) => {
return (req, res, next) => {
if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
next();
};
};