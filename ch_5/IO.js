import * as _ from 'node/util';

export class IO {
  constructor(effect) {
    if(!_.isFunction()) {
      throw 'IO 사용법 : 함수는 필수입니다.'; // 어떤 문법일까..
    }
    this.effect = effect;
  }

  static of(a) { // 값을 IO 모나드로 승급하는 단위 함수
    return new IO(() => a);
  }

  static from(fn) { // 함수를 IO 모나드로 승급하는 단위 함수
    return new IO(fn);
  }

  map(fn) {
    let self = this;
    return new IO(() => fn(self.effect())) // 전에 가진 effect 를 실행시킨 결과를 인자로 받으며 fn이 실행되는 effect 를 가진 IO
  }

  chain(fn) {
    return fn(this.effect());
  }

  run() {
    return this.effect(); // 모나드에 매핑된 모든 함수들이 실행된다. 느긋하게 초기화한 체인을 가동해서 IO 작업 시작
  }
}