"use strict";
const {SHA256} = require('crypto-js');

class Block {
    constructor(timeStamp, data, previousHash = '') {
        this.previousHash = previousHash;
        this.timeStamp = timeStamp;
        this.data = data;
        //When creating a new block, automatically calculate its hash
        this.hash = this.calculateHash();
    }
    calculateHash () {
        return SHA256(this.previousHash + this.timeStamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }
    createGenesisBlock () {
        return new Block("01/01/2018", "Genesis Block", "0");
    }
    getLatestBlock () {
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock) {
        //New block points to hash of latest block in chain
        newBlock.previousHash = this.getLatestBlock().hash;
        //Calculate hash of new block
        newBlock.hash = newBlock.calculateHash();
        //Add new block to chain
        this.chain.push(newBlock);
    }
    isChainValid(){
        const realGenesis = JSON.stringify(this.createGenesisBlock());

        if (realGenesis !== JSON.stringify(this.chain[0])) {
            return false;
        };

        for (let i = 1; i < this.chain.length; i++){
          const currentBlock = this.chain[i];
          const previousBlock = this.chain[i - 1];

          // Recalculate the hash of the block and see if it matches up.
              // This allows us to detect changes to a single block
          if (currentBlock.hash !== currentBlock.calculateHash()) {
            return false;
          }

          // Check if this block actually points to the previous block (hash)
          if (currentBlock.previousHash !== previousBlock.hash) {
                  return false;
              }

        }
          // chain is valid!
        return true;
      }
}

let savjeeCoin = new Blockchain();

savjeeCoin.addBlock(new Block("20/07/2018", {amount: 4}));
savjeeCoin.addBlock(new Block("22/07/2018", {amount: 10}));

savjeeCoin.chain[1].data = {amount: 100};

//console.log(JSON.stringify(savjeeCoin, null, 4));
console.log('Blockchain valid? ' + savjeeCoin.isChainValid());

