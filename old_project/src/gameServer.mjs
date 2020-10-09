import {GameClient} from "./game.mjs";
import {default as _} from '../../src/common/lodash.js'

export class GameServer extends GameClient {
  getAllUsers() {
    return this.enemies
  }

  getCopy() {
    return _.cloneDeep(this)
  }
}