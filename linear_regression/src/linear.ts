import { Field, SmartContract, state, State, method, Provable, Circuit } from 'o1js';

/**
 * Basic Example
 * See https://docs.minaprotocol.com/zkapps for more info.
 *
 * The Add contract initializes the state variable 'num' to be a Field(1) value by default when deployed.
 * When the 'update' method is called, the Add contract adds Field(2) to its 'num' contract state.
 *
 * This file is safe to delete and replace with your own contract.
 */
export class Linear extends SmartContract {
  @state(Field) x1 = State<Field>();
  @state(Field) x2 = State<Field>();
  @state(Field) x3 = State<Field>();
  @state(Field) x4 = State<Field>();



  init() {
    super.init();
    this.x1.set(Field(14));
    this.x2.set(Field(23));
    this.x3.set(Field(32));
    this.x4.set(Field(27));
  }

  async query(x: Field, y:Field, z: Field, w:Field) {
    let x1: Field = this.x1.getAndRequireEquals();
    let x2: Field = this.x2.getAndRequireEquals();
    let x3: Field = this.x3.getAndRequireEquals();
    let x4: Field = this.x4.getAndRequireEquals();

    let prediction: Field = x1.mul(x)
                              .add(x2.mul(y))
                              .add(x3.mul(z))
                              .add(x4.mul(w));


    return prediction;
  }


  @method async train(x: Field, y: Field, z: Field, w: Field, ground: Field) {
    const x1: Field = this.x1.getAndRequireEquals();
    const x2: Field = this.x2.getAndRequireEquals();
    const x3: Field = this.x3.getAndRequireEquals();
    const x4: Field = this.x4.getAndRequireEquals();
  
    const prediction: Field = x1.mul(x)
                                  .add(x2.mul(y))
                                  .add(x3.mul(z))
                                  .add(x4.mul(w));


    let error = Field(0);

    let y1  = prediction.sub(ground);
    let y2 = ground.sub(prediction);

    error = Provable.if(prediction.greaterThan(ground), y1 , y2 )

    error.assertLessThanOrEqual(Field(100)); // !너무 큰 음수 -> 오류로 간주
  
    
    const lr: Field = Field(1);

    const newX1: Field = x1.add(lr.mul(error).mul(x));
    const newX2: Field = x2.add(lr.mul(error).mul(y));
    const newX3: Field = x3.add(lr.mul(error).mul(z));
    const newX4: Field = x4.add(lr.mul(error).mul(w));

    this.x1.set(newX1);
    this.x2.set(newX2);
    this.x3.set(newX3);
    this.x4.set(newX4);
  }






  
}
