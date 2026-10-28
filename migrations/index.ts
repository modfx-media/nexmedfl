import * as migration_20261026_162938 from './20261026_162938';
import * as migration_20261026_163130 from './20261026_163130';

export const migrations = [
  {
    up: migration_20261026_162938.up,
    down: migration_20261026_162938.down,
    name: '20261026_162938',
  },
  {
    up: migration_20261026_163130.up,
    down: migration_20261026_163130.down,
    name: '20261026_163130'
  },
];
