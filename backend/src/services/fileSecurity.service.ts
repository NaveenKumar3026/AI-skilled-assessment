import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { securityConfig } from '../config/security.config';

export interface FileValidationResult {
  isValid: boolean;
  detectedMimeType?: string;
  error?: string;
}

export interface MalwareScanResult {
  isClean: boolean;
  scanner: 'MockScanner' | 'ClamAV' | 'CloudScanner';
  threatName?: string;
  timestamp: string;
}

export class FileSecurityService {
  /**
   * Validate file signature by inspecting magic bytes directly from file header
   */
  static async validateFileSignature(filePath: string, claimedExt: string): Promise<FileValidationResult> {
    try {
      const buffer = Buffer.alloc(32);
      const fd = await fs.promises.open(filePath, 'r');
      await fd.read(buffer, 0, 32, 0);
      await fd.close();

      const ext = claimedExt.toLowerCase();

      // PDF: %PDF (25 50 44 46)
      if (ext === '.pdf') {
        const isPdf = buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
        if (!isPdf) return { isValid: false, error: 'File content does not match genuine PDF header.' };
        return { isValid: true, detectedMimeType: 'application/pdf' };
      }

      // JPEG: FF D8 FF
      if (ext === '.jpg' || ext === '.jpeg') {
        const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
        if (!isJpeg) return { isValid: false, error: 'File content does not match genuine JPEG header.' };
        return { isValid: true, detectedMimeType: 'image/jpeg' };
      }

      // PNG: 89 50 4E 47 0D 0A 1A 0A
      if (ext === '.png') {
        const isPng =
          buffer[0] === 0x89 &&
          buffer[1] === 0x50 &&
          buffer[2] === 0x4e &&
          buffer[3] === 0x47 &&
          buffer[4] === 0x0d &&
          buffer[5] === 0x0a &&
          buffer[6] === 0x1a &&
          buffer[7] === 0x0a;
        if (!isPng) return { isValid: false, error: 'File content does not match genuine PNG header.' };
        return { isValid: true, detectedMimeType: 'image/png' };
      }

      // WebP: RIFF .... WEBP
      if (ext === '.webp') {
        const isRiff = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
        const isWebp = buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
        if (!isRiff || !isWebp) return { isValid: false, error: 'File content does not match genuine WebP header.' };
        return { isValid: true, detectedMimeType: 'image/webp' };
      }

      // MP4: ftyp box in first 16 bytes
      if (ext === '.mp4') {
        const ftypIndex = buffer.indexOf('ftyp');
        if (ftypIndex === -1 || ftypIndex > 12) {
          return { isValid: false, error: 'File content does not match genuine MP4 container.' };
        }
        return { isValid: true, detectedMimeType: 'video/mp4' };
      }

      return { isValid: false, error: `Unsupported or disallowed file extension: ${ext}` };
    } catch (err) {
      return { isValid: false, error: 'Could not inspect file signature.' };
    }
  }

  /**
   * Enterprise Malware Scanning Abstraction (Requirement 20)
   * Prototype implements a signature heuristic scanner (EICAR, shellcode patterns, embedded executables).
   * In production, this integrates with ClamAV daemon or Cloud Anti-Malware API.
   */
  static async scan(filePath: string): Promise<MalwareScanResult> {
    try {
      // Read first 64KB for malware heuristics
      const buffer = Buffer.alloc(65536);
      const fd = await fs.promises.open(filePath, 'r');
      const { bytesRead } = await fd.read(buffer, 0, 65536, 0);
      await fd.close();

      const sample = buffer.subarray(0, bytesRead).toString('latin1');

      // Standard EICAR Antivirus Test String heuristic
      const EICAR = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';
      if (sample.includes(EICAR)) {
        return {
          isClean: false,
          scanner: 'MockScanner',
          threatName: 'EICAR-Test-Signature.Trojan',
          timestamp: new Date().toISOString(),
        };
      }

      // Check for dangerous executable shell scripts or HTML script tags in uploaded documents
      const dangerousSignatures = [
        '#!/bin/sh',
        '#!/bin/bash',
        '<?php',
        '<script',
        'powershell -',
        'cmd.exe',
      ];

      for (const sig of dangerousSignatures) {
        if (sample.toLowerCase().includes(sig.toLowerCase())) {
          return {
            isClean: false,
            scanner: 'MockScanner',
            threatName: `SuspiciousPayload:${sig}`,
            timestamp: new Date().toISOString(),
          };
        }
      }

      return {
        isClean: true,
        scanner: 'MockScanner',
        timestamp: new Date().toISOString(),
      };
    } catch {
      // Fail closed: if scanner cannot read file, reject it
      return {
        isClean: false,
        scanner: 'MockScanner',
        threatName: 'ScanFailure.UnreadableFile',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Prevent path traversal and enforce safe storage location
   */
  static sanitizeStoragePath(baseDir: string, filename: string): string {
    const safeName = path.basename(filename);
    const resolvedPath = path.resolve(baseDir, safeName);
    const resolvedBase = path.resolve(baseDir);

    if (!resolvedPath.startsWith(resolvedBase)) {
      throw new Error('[SECURITY ERROR] Path traversal detected in upload filename.');
    }

    return resolvedPath;
  }

  /**
   * Generate an unguessable cryptographic random server filename
   */
  static generateRandomFilename(originalExt: string): string {
    const ext = originalExt.toLowerCase();
    const allowed = securityConfig.uploads.allowedExtensions;
    if (!allowed.includes(ext)) {
      throw new Error(`Extension ${ext} not allowed.`);
    }
    return `${crypto.randomUUID()}${ext}`;
  }
}
