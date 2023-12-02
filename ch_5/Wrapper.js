class Wrapper { // 형식 생성자.
  constructor(value) {
    this._value = value;
  }

  static of(a) { // 단위 함수
    return new Wrapper(a);
  }

  map(f) { // 바인드 함수 (함수자)
    // 주어진 함수를 매핑하고 컨테이너의 대문을 닫는 일 -> 중립 함수자
    return Wrapper.of(f(this._value));
  }

  join() { // 중첩된 계층 눌러펴기
    if(!(this._value instanceof Wrapper)) {
      return this;
    }
    return this._value.join(); // _value가 wrapper면 join 호출
  }

  get() {
    return this._value;
  }

  toString() {
    return `Wrapper (${this._value})`;
  }
}



