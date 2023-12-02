class Maybe {
  static just(a) {
    return new Just(a);
  }

  static nothing() {
    return new Nothing();
  }

  static fromNullable(a) {
    return a != null ? Maybe.just(a) : Maybe.nothing();
  }

  static of(a) {
    return Maybe.just(a);
  }

  get isNothing() {
    return false;
  }

  get isJust() {
    return false;
  }
}

class Just extends Maybe {
  constructor(value) {
    super();
    this._value = value;
  }

  get value() {
    return this._value;
  }

  map(f) {
    return Maybe.fromNullable(f(this._value)); // Just 함수에 매핑하고 값을 변환 후 다시 컨테이너에 담는다.
  }

  getOrElse() {
    return this._value;
  }

  filter(f) {
    Maybe.fromNullable(f(this._value) ? this._value : null );
  }

  chain(f) {
    return f(this.value);
  }
}

class Nothing extends Maybe {
  map(f) {
    return this;
  }

  get value() {
    throw new TypeError('Nothing 값을 가져올 수 없습니다.');
  }

  getOrElse(other) {
    return other; // 무조건 other 반환
  }

  filter(f) {
    return this._value; // this._value === null 일까요
  }

  chain(f) {
    return this;
  }

  toString() {
    return 'Maybe.Nothing';
  }
}

module.exports = {Maybe, Nothing, Just}
