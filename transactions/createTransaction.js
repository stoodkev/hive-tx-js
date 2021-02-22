const globalProps = require("../helpers/globalProps");
const hfVersion = require("../helpers/hfVersion");
const config = require("../config");

const HF24_CHAIN_ID =
  "beeab0de00000000000000000000000000000000000000000000000000000000";

/** Create transaction by operations */
const createTransaction = async (operations, exp) => {
  const expireTime = exp ? 1000 * exp : 1000 * 60;
  config.chain_id = HF24_CHAIN_ID;
  const props = await globalProps();
  const refBlockNum = props.head_block_number & 0xffff;
  const refBlockPrefix = Buffer.from(props.head_block_id, "hex").readUInt32LE(
    4
  );
  const expiration = new Date(Date.now() + expireTime)
    .toISOString()
    .slice(0, -5);
  const extensions = [];

  return {
    expiration,
    extensions,
    operations,
    ref_block_num: refBlockNum,
    ref_block_prefix: refBlockPrefix
  };
};

module.exports = createTransaction;
