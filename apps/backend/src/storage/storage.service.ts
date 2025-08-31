import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private base = process.env.STORAGE_ROOT ?? path.join(process.cwd(), 'var', 'storage');

  async save(buffer: Buffer, subpath: string, contentType: string): Promise<string> {
    const full = path.join(this.base, subpath);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, buffer);
    // return a file:// or local path; later swap for S3/Azure
    return full;
  }

  async read(uri: string): Promise<Buffer> {
    return fs.readFile(uri);
  }

  async exists(uri: string): Promise<boolean> {
    try {
      await fs.access(uri);
      return true;
    } catch {
      return false;
    }
  }
}
