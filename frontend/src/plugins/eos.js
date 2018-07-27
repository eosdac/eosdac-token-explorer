import eosjs from 'eosjs-api'
import config from '../statics/config/explorer_config.json';

const eos = eosjs({
              chainId: config.settings.chainid, 
              httpEndpoint: config.settings.httpendpoint_node,
              expireInSeconds: 60,
              logger: {
                log:  null,
                error: null // null to disable
              } 
            });

export default ({ Vue }) => {
  Vue.prototype.$eos = eos
}
