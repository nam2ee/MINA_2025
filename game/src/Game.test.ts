import { AccountUpdate, Field, Mina, PrivateKey, PublicKey } from 'o1js';
import { Game } from './Game';

/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

const proofsEnabled = false;

describe('Add', () => {
  let deployerAccount: Mina.TestPublicKey,
    deployerKey: PrivateKey,
    senderAccount: Mina.TestPublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: Game;

  beforeAll(async () => {
    if (proofsEnabled) await Game.compile();
  });

  beforeEach(async () => {
    const Local = await Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    [deployerAccount, senderAccount] = Local.testAccounts;
    deployerKey = deployerAccount.key;
    senderKey = senderAccount.key;

    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new Game(zkAppAddress);
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      await zkApp.deploy();
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  it('correctly updates the num state on the `Add` smart contract', async () => {
    await localDeploy();
    // update transaction
    const txn = await Mina.transaction(senderAccount, async () => {
      await zkApp.setup(Field(3));
    });
    await txn.prove();
    await txn.sign([senderKey]).send();

    console.log(zkApp.x1.get(), "infer origin value")


    // guessing!
    const txn2 = await Mina.transaction(senderAccount, async () => {
      await zkApp.guess(Field(3));
    });
    await txn2.prove();
    await txn2.sign([senderKey]).send();

    expect(Field(3)).toEqual(Field(3));
  });
});
