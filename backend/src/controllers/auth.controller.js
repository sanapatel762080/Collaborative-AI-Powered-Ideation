import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signAccessToken, signRefreshToken, setAuthCookies, clearAuthCookies } from '../utils/generateTokens.js';
import jwt from 'jsonwebtoken';


export const signup = async (req, res) => {
const { name, email, password } = req.body;
if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
const exist = await User.findOne({ email });
if (exist) return res.status(409).json({ error: 'Email already in use' });
const passwordHash = await bcrypt.hash(password, 10);
const user = await User.create({ name, email, passwordHash });
const payload = { id: user._id, role: user.role, name: user.name, email: user.email };
const atk = signAccessToken(payload);
const rtk = signRefreshToken({ id: user._id });
setAuthCookies(res, atk, rtk);
res.status(201).json({ user });
};

export const login = async (req, res) => {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(401).json({ error: 'Invalid credentials' });
const ok = await bcrypt.compare(password, user.passwordHash);
if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
const payload = { id: user._id, role: user.role, name: user.name, email: user.email };
const atk = signAccessToken(payload);
const rtk = signRefreshToken({ id: user._id });
setAuthCookies(res, atk, rtk);
res.json({ user });
};


export const me = async (req, res) => {
const user = await User.findById(req.user.id).select('-passwordHash');
res.json({ user });
};

export const refresh = async (req, res) => {
const token = req.cookies.rtk;
if (!token) return res.status(401).json({ error: 'No refresh token' });
try {
const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
const user = await User.findById(decoded.id);
if (!user) return res.status(401).json({ error: 'User not found' });
const payload = { id: user._id, role: user.role, name: user.name, email: user.email };
const atk = signAccessToken(payload);
const rtk = signRefreshToken({ id: user._id });
setAuthCookies(res, atk, rtk);
res.json({ user });
} catch (e) {
return res.status(401).json({ error: 'Invalid refresh token' });
}
};


export const logout = async (req, res) => {
clearAuthCookies(res);
res.json({ success: true });
};

// One-time helper to create an admin user (remove or secure later)
export const seedAdmin = async (req, res) => {
const { email, password, name } = req.body;
if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });
const exist = await User.findOne({ email });
if (exist) return res.status(409).json({ error: 'Email already used' });
const passwordHash = await bcrypt.hash(password, 10);
const user = await User.create({ name, email, passwordHash, role: 'ADMIN' });
res.status(201).json({ user });
};