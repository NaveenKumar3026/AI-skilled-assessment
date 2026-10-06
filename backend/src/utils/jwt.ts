import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { JwtPayload, RefreshTokenPayload } from '../types';

/**
 * Sign a short-lived access token (default: 15 minutes).
 */
export function signAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, config.jwtAccessSecret, {
    expiresIn: config.jwtAccessExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

/**
 * Sign a refresh token (default: 7 days).
 */
export function signRefreshToken(payload: Omit<RefreshTokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

/**
 * Verify an access token.
 */
export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwtAccessSecret) as JwtPayload;
}

/**
 * Verify a refresh token.
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, config.jwtRefreshSecret) as RefreshTokenPayload;
}

// Backward-compatible aliases for existing calls
export function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return signAccessToken(payload);
}

export function verifyToken(token: string): JwtPayload {
  return verifyAccessToken(token);
}
