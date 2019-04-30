'use babel';

import { CompositeDisposable } from 'atom'
import armlet from 'armlet'
import dotenv from 'dotenv'
import fs from 'fs'

export default {

  subscriptions: null,
  client: null,

  activate() {
    dotenv.config();
    this.subscriptions = new CompositeDisposable()
    if (!this.client) {
      this.client = new armlet.Client(
        {
          password: process.env.MYTHX_PASSWORD,
          ethAddress: process.env.MYTHX_ETH_ADDRESS,
        });
    }

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-mythx:analyze': () => this.analyze()
    }))
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  analyze() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let contractPath = editor.getPath()

      // compile this contract ?
      let bytecode="0x608060405234801561001057600080fd5b5060d48061001f6000396000f3fe608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806338d94193146044575b600080fd5b348015604f57600080fd5b50607960048036036020811015606457600080fd5b8101908080359060200190929190505050608f565b6040518082815260200191505060405180910390f35b600081600881101515609d57fe5b01600091509050548156fea165627a7a723058206f554b09240c9771a583534d72575fcfb4623ab4df3ddc139442047795fd383b0029";
      let data = {
      "bytecode": bytecode
    };
      this.client.analyzeWithStatus(
        {
	         "data": data,
	         "clientToolName": "atom-armlet"
        })
        .then(result => {
          console.log(result.status, {depth: null})
          console.log(result.issues, {depth: null})
        }).catch(err => {
          console.log(err)
        });

    }
  }

};
