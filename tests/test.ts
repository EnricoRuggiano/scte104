import 'reflect-metadata';
import 'zone.js';
import 'source-map-support/register';

import { suite } from 'razmin';
import '../src/index';

suite()
    .include(['**/*.test.js'])
    .run()
;