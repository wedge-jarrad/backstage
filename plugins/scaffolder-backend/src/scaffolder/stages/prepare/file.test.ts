/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { getVoidLogger } from '@backstage/backend-common';
import fs from 'fs-extra';
import { FilePreparer } from './file';

jest.mock('fs-extra');

describe('File preparer', () => {
  const logger = getVoidLogger();
  const preparer = new FilePreparer();
  it('prepares templates from a file path', async () => {
    await preparer.prepare({
      url: 'file:///path/to/template',
      logger,
      workspacePath: '/tmp',
    });
    expect(fs.copy).toHaveBeenCalledWith('/path/to/template', '/tmp/checkout', {
      recursive: true,
    });
    expect(fs.ensureDir).toHaveBeenCalledWith('/tmp/checkout');

    await expect(
      preparer.prepare({
        url: 'file://not/full/path',
        logger,
        workspacePath: '/tmp',
      }),
    ).rejects.toThrow(
      "Wrong location protocol, should be 'file', file://not/full/path",
    );
  });
});
