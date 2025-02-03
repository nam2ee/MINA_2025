import { Field, SmartContract, state, State, method, Provable, Circuit, Bool, Poseidon } from 'o1js';

/**
 * Basic Example
 * See https://docs.minaprotocol.com/zkapps for more info.
 *
 * The Add contract initializes the state variable 'num' to be a Field(1) value by default when deployed.
 * When the 'update' method is called, the Add contract adds Field(2) to its 'num' contract state.
 *
 * This file is safe to delete and replace with your own contract.
 */
export class Game extends SmartContract {
  @state(Field) x1 = State<Field>();
  @state(Bool) setup_flag = State<Bool>();


  init() {
    super.init();
    this.setup_flag.set(Bool(false));
  }

  @method async setup(value: Field) {
    let setup_flag =  this.setup_flag.getAndRequireEquals();
    setup_flag.assertEquals(Bool(false));


    value.assertLessThanOrEqual(Field(10));
    this.x1.set(Poseidon.hash([value]));
    this.setup_flag.set(Bool(true));

  }


  @method async guess(guess: Field ) {
    let setup_flag =  this.setup_flag.getAndRequireEquals();
    setup_flag.assertEquals(Bool(true));

    let value = this.x1.getAndRequireEquals();

    let guesser = Poseidon.hash([guess]);

    guesser.assertEquals(value);
  }


  
}
