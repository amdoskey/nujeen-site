import { createReader } from '@keystatic/core/reader';
import path from 'node:path';
import keystaticConfig from '../../keystatic.config';

export const reader = createReader(path.join(process.cwd()), keystaticConfig);
