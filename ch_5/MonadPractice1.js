const {Either, Left, Right} = require('./Either');
const {Maybe, Just, Nothing} = require('./Maybe');
const IO = require('./IO');
const {R} = require('../index');
const {count} = require('ramda');
const f = require('ramda/src/F');

// 예제 시나리오 짜보기
// - 검색어를 입력할 수 있는 input과 검색 시작 button이 존재한다.
// - 검색어를 입력하고 button을 누르면
// - 유효성 검사를 한다. (사용이 예상되는 모나드 : Either)
// - 유효한 경우 로직을 계속 진행
// - 유효하지 않을 경우 => 화면에 유효성 검사 결과를 알리고 플로우가 끝난다.
// - api에 결과를 요청한다. (사용이 예상되는 모나드 : Promise)
// - 요청 결과가 비었는지 확인한다. (사용이 예상되는 모나드 : Maybe... 하지만 보통 결과로 null이 오진 않을텐데!)
// - 결과가 비었을 경우 => 화면에 검색결과가 없음 알리고 플로우가 끝난다. 혹은 다른 선택지를 제안 (다른 pipe가 시작될 수 있도록?)
// - 결과가 존재할 경우 => 화면에 나열하고 플로우가 끝난다.
//
//     사용이 예상되는 모나드
// - IO
// - Either
// - Maybe (사용하지 않거나 Either로 대체될 수 있음)

class ValidationError extends Error {
  constructor(conditions) {
    super();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
    this.conditions = conditions;
  }
}

const map = R.curry((f, container) => container.map(f));
const chain = R.curry((f, container) => container.chain(f));
const orElse = R.curry((f, container) => container.orElse(f));

//  input에 입력된 검색어 읽는 함수 (라고 가정)
const getSearchStr = () => 'hello monad';
// document.querySelector('#searchInput').value;

//  검색어 유효성 검사 (반환타입: Either)
const safeGetValidatedStr = R.curry((str) => {
  // 유효성 검사 함수 목록을 정의한다.
  const validateFnList = [
    (str) => true ? Either.right(str) : Either.left('condition_1'),
    (str) => true ? Either.right(str) : Either.left('condition_2'),
    (str) => true ? Either.right(str) : Either.left('condition_3'),
  ];

  // 유효성 검사 실행
  const failedList = []; // 실패 항목이 담김
  R.reduce(
      (str, fn) => {
        const validateResult =
            fn(str).orElse(conditionName => conditionName + ' 가 유효하지 않습니다.');
        const isFailed = !(validateResult instanceof Right);
        if (isFailed) failedList.push(validateResult);
      }
      , failedList
      , validateFnList,
  );

  return failedList.length === 0 ?
      Either.right(str) :
      Either.left(new ValidationError(failedList));
});

//  검색어 등을 조회 조건으로 해서 api를 호출하고 결과를 반환 (반환타입: Promise -> Either 로 변환해서 반환)
const getDataInPromise = (searchStr) => {

  let resultEither; // 반환 값 (Either)

  const fetch = new Promise((resolve, reject) => {
    // fetch가 성공했다고 가정할 경우
    resolve({
      totalCount: 10,
      list: [
        {a: 'a1', b: 'b1'},
        {a: 'a2', b: 'b2'},
        {a: 'a3', b: 'b3'},
      ],
    });

    // fetch가 실패했다고 가정할 경우
    // reject(new Error('api failed'));
  })

  // fetch 결과를 Either로 변환하기 --> 실퍠: then, catch 블록에 진입하지 않음.
  fetch
    .then((value) => {
      console.log(value);
      resultEither = Either.right(value);
    })
    .catch((err) => {
      console.log(err);
      resultEither = Either.left(err);
    })

    // return resultEither;
  console.log(resultEither)
  return resultEither;
};

const showList = (list) => {
  let html = '';
  list.forEach(el =>
      html += `<tr> <td>${el.a}</td> <td>${el.b}</td> </tr>`,
  );

  // document.querySelector('#tbody').innerHTML = html; // 맞나;;..
  console.log(html);
};

const showCount = (count) => {
  console.log('count', count);
};

const test = R.pipe(
    getSearchStr,                   //  검색어 읽기
    safeGetValidatedStr,            //  유효성 검사 (Either 를 반환함)
    chain(getDataInPromise),        //  api 요청 (Promise resolve 이면 Right, reject 이면 Left 반환)
    map(console.log),
    // map((data) => {   //  화면에 표시 (조회 결과 존재 유무에 따라 분기)
    //   showList(data.list);
    //   showCount(data.totalCount);
    // }),
    orElse((either) => {    // 실패 처리
      // console.log(either);
      if (either instanceof ValidationError) { // 유효성 실패했을 경우
        console.log(either.conditions.join('\n'));
      } else { // api 요청이 실패한 경우
        console.log('alert', either);
      }
    }),
);

test();
