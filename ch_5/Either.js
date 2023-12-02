class Either {
  constructor(value) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  static left(a) {
    return new Left(a);
  }

  static right(a) {
    return new Right(a);
  }

  static fromNullable(val) { // 값이 올바른지 판단해서 반환
    return val !== null && val !== undefined ? Either.right(val) : Either.left(val);
  }

  static of(a) {
    return Either.right(a);
  }
}

class Left extends Either {
  map(_) { // 함수를 매핑하여 Right 값을 변환하는 메서드지만, Left는 변환할 값 자체가 없다. --> this._value는 있는데?!
    return this; // 쓰지 않음
  }

  get value() {
    throw new TypeError('Left(a) 값을 가져올 수 없습니다');
  }

  getOrElse(other) {
    return other;
  }

  orElse(f) {
    return f(this._value);
  }

  chain(f) { // Right 에 함수 적용, Left 는 아무일도 하지 않는다.
    return this;
  }

  getOrElseThrow(a) {
    throw new Error(a); // Left 에서만 주어진 값으로 예외를 던진다.
  }

  filter(f) {
    return this; // 주어진 술어를 만족하는 값이 존재하면 Right, 그렇지 않으면 빈 Left 반환
  }

  toString() {
    return `Either.Left(${this._value})`;
  }
}

class Right extends Either {
  map(f) { // Right 만 함수 매핑해서 변환, Left 는 아무것도 하지 않음
    return Either.of(f(this._value));
  }

  getOrElse(other) {
    return this._value;
  }

  orElse() {
    return this; // 쓰지 않음
  }

  chain(f) {
    return f(this._value);
  }

  getOrElseThrow(_) {
    return this._value;
  }

  filter(f) {
    return Either.fromNullable(f(this._value) ? this._value : null );
  }

  toString() {
    return `Either.Right(${this._value})`;
  }
}

module.exports = {Either, Left, Right};