import jwt from 'jsonwebtoken';


export const signAccessToken = (payload) => {
return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
};


export const signRefreshToken = (payload) => {
return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};


export const setAuthCookies = (res, accessToken, refreshToken) => {
const isProd = process.env.NODE_ENV === 'production';
res.cookie('atk', accessToken, {
httpOnly: true,
sameSite: isProd ? 'none' : 'lax',
secure: isProd,
path: '/',
maxAge: 15 * 60 * 1000,
});
res.cookie('rtk', refreshToken, {
httpOnly: true,
sameSite: isProd ? 'none' : 'lax',
secure: isProd,
path: '/auth/refresh',
maxAge: 7 * 24 * 60 * 60 * 1000,
});
};


export const clearAuthCookies = (res) => {
const isProd = process.env.NODE_ENV === 'production';
res.clearCookie('atk', { httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: isProd, path: '/' });
res.clearCookie('rtk', { httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: isProd, path: '/auth/refresh' });
};