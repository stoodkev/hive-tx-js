const signTransaction = require("./transactions/signTransaction");
const createTransaction = require("./transactions/createTransaction");
const broadcastTransaction = require("./transactions/broadcastTransaction");
const broadcastTransactionNoResult = require("./transactions/broadcastTransactionNoResult");
const PrivateKey = require("./helpers/PrivateKey");
const call = require("./helpers/call");
const config = require("./config");
const updateOperations = require("./helpers/serializer").updateOperations;
const bf = require("buffer/").Buffer;
console.log(bf);
global.Buffer = bf;
/** Transaction for Steem blockchain */
class Transaction {
  /** A transaction object could be passed or created later
   * @param {{}} trx Object of transaction - Optional
   */
  constructor(trx = null) {
    this.created = true;
    if (!trx) {
      this.created = false;
    }
    this.transaction = trx;
  }

  /** Create the transaction by operations
   * @param {[Array]} operations
   * @param {Number} expiration Optional - Default 60 seconds
   */
  async create(operations, expiration = 60) {
    this.transaction = await createTransaction(operations);
    this.created = true;
    return this.transaction;
  }

  /** Sign the transaction by key or keys[] (supports multi signature)
   * @param {PrivateKey|[PrivateKey]} keys single key or multiple keys in array
   */
  sign(keys) {
    if (!this.created) {
      throw new Error("First create a transaction by .create(operations)");
    }
    const { signedTransaction, txId } = signTransaction(this.transaction, keys);
    this.signedTransaction = signedTransaction;
    this.txId = txId;
    return this.signedTransaction;
  }

  async broadcast() {
    if (!this.created) {
      throw new Error("First create a transaction by .create(operations)");
    }
    if (!this.signedTransaction) {
      throw new Error("First sign the transaction by .sign(keys)");
    }
    const result = await broadcastTransaction(this.signedTransaction);
    return result;
  }

  /** Fast broadcast - No open connection
   * TODO: return trx_id
   */
  async broadcastNoResult() {
    if (!this.created) {
      throw new Error("First create a transaction by .create(operations)");
    }
    if (!this.signedTransaction) {
      throw new Error("First sign the transaction by .sign(keys)");
    }
    await broadcastTransactionNoResult(this.signedTransaction);
    return {
      id: 1,
      jsonrpc: "2.0",
      result: { tx_id: this.txId, status: "unkown" }
    }; // result
  }
}

module.exports = { Transaction, PrivateKey, call, config, updateOperations };
