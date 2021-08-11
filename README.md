# solidarite

# 요구사항

## 1. API 에러 공통 응답 포맷

클라이언트에서 요청을 받아 응답 처리 시 에러를 내보낼 때 JSON 형식을 포맷화합니다. 

```json
{
	"statusCode" : 404,
  "message" : "해당 유저가 존재하지 않습니다."
}
```

`statusCode`에는 HTTP 에러 코드를 출력합니다.

`message`에는 에러 메시지가 출력됩니다.

성공 응답은 API마다 다릅니다. 

`EX` 유저 로그인 성공 응답

```json
{
	"token" : "eyV1QiLCJhbGciOiJIUzUxM..",
	"user": {
		"id": 1,
		"email": "assignment@example.com",
		...
	}
}
```

`EX` 유저 로그인 실패 응답

```json
{
	"statusCode" : 403,
  "message" : "비밀번호가 일치하지 않습니다."
}
```

## 2. 인증 구현

API 는 총 7개이며, 다음과 같습니다.

- 회원가입
- 로그인
- 게시물 리스트 조회
- 게시물 상세 조회
- 게시물 생성 `인증`
- 게시물 삭제 `인증`
- 게시물 좋아요 `인증`

**유의 사항**
- `인증` 마크가 달린 API는 로그인 상태에서만 접근 가능합니다. 
- 인증 토큰은 `JWT`를 이용하여 구현하여야 합니다.

로그인하여 발행된 `JWT` 토큰은 `Authorization` 헤더에 포함하여 요청이 오기 때문에 이를 파싱하여 인증 여부를 확인합니다.

```bash
$ curl -X POST localhost:3000 -H 'Authorization: Bearer eyV1QiLCJhbGciOiJIUzUxM..'
```

만일 유효한 토큰이 아닐 경우 401 에러를 반환합니다.

```json
{
	"statusCode" : 401,
  "message" : "권한이 없습니다."
}
```

## 3. API 상세

- 로그인 API
    - 회원가입: `POST` /api/users/join
    - 로그인: `POST` /api/users/login
- 게시물 API
    - 게시물 생성: `POST` /api/boards
    - 게시물 리스트 조회: `GET` /api/boards
    - 게시물 상세 조회: `GET` /api/boards/:id
    - 게시물 삭제: `DELETE` /api/boards/:id
    - 게시물 좋아요: `POST` /api/boards/:id/like

### 3.1. 회원가입

요구사항

- 이메일과 닉네임, 비밀번호를 받아 회원가입을 합니다.
- 닉네임은 10자까지 가능합니다.
- 비밀번호는 영문과 숫자가 포함되어야 합니다.
- 이메일은 고유 아이디이므로 테이블에 값이 중복되어선 안됩니다.
- 비밀번호는 단방향 암호화하여 테이블에 저장합니다.

URL `POST` /api/users/join

Request

```json
{
	"email": "assignment@example.com",
	"nickname": "팬더",
	"password": "abc123"
}
```

Reponse

```json
{
	"data": "OK"
}
```

에러처리

- 해당 이메일이 이미 존재할 경우 `403`
- 이메일, 닉네임, 비밀번호 컬럼이 비었을 경우 `400`
- 닉네임이 10자 초과인 경우 `403`
- 비밀번호에 영문과 숫자가 포함되지 않았을 경우 `403`

### 3.2 로그인

요구사항

- 이메일과 비밀번호로 로그인합니다.
- 이메일과 비밀번호가 일치하면 해당 유저의 JWT 토큰을 발행합니다.
- Response 값의 user 객체에는 비밀번호 필드를 포함시키지 않습니다.

URL `POST` /api/users/login

Request

```json
{
	"email": "assignment@example.com",
	"password": "abc123"
}
```

Reponse

```json
{
	"token": "eyV1QiLCJhbGciOiJIUzUxM..",
	"user": {
		"id": 1,
		"email": "assignment@example.com",
    "nickname": "팬더",
		...
	}
}
```

에러처리

- 존재하지 않은 이메일일 경우 `403`
- 비밀번호가 틀렸을 경우 `403`

### 3.3 게시물 생성

요구사항

- 게시물을 생성합니다.
- 헤더에 Authorization 토큰이 없을 경우 에러를 반환합니다.

URL `POST` /api/boards `인증`

Request

```json
{
	"title": "제목입니다",
	"content": "내용입니다"
}
```

Reponse

```json
{
	"id": 1,
	"userId" : 1,
	"user": {
		"nickname": "팬더"
	},
	"title": "제목입니다",
	"content": "내용입니다",
	"like": 0,
	"createdAt": "2021-08-01T02:02:00.000Z"
}
```

에러처리

- 제목이 없을 경우 `400`
- 내용이 없을 경우 `400`
- 제목이 30자 넘어갈 경우 `403`
- 인증 정보가 없을 경우 `401`

### 3.4 게시물 리스트 조회

요구사항

- 생성된 게시물을 모두 불러옵니다.
- 만약 게시물이 없을 시 빈 배열을 반환합니다.
- Response의 user 객체의 경우  게시물을 작성한 유저의 닉네임만 가져옵니다.

URL `GET` /api/boards

Reponse

```json
[
	{
		"id": 2,
		"userId" : 1,
		"user": {
			"nickname": "팬더"
		},
		"title": "제목입니다2",
		"content": "내용입니다2",
		"like": 0,
		"createdAt": "2021-08-01T06:02:00.000Z"
	},
	{
		"id": 1,
		"userId" : 1,
		"user": {
			"nickname": "팬더"
		},
		"title": "제목입니다",
		"content": "내용입니다",
		"like": 1,
		"createdAt": "2021-08-01T02:02:00.000Z"
	}
]
```

에러처리

- 없음

### 3.5 게시물 상세 조회

요구사항

- 해당 id를 가진 게시물을 반환합니다.
- 만일 로그인했고, 해당 유저가 게시물에 좋아요를 눌렀을 경우 isLike는 true 값을 가집니다.
- 로그인을 하지 않았거나, 로그인 했어도 좋아요를 누르지 않았을 경우 isLike는 false 값을 가집니다.

URL `GET` /api/boards/:id

Reponse

```json
{
	"id": 1,
	"userId" : 1,
	"user": {
		"nickname": "팬더"
	},
	"title": "제목입니다",
	"content": "내용입니다",
	"like": 0,
	"isLike": false,
	"createdAt": "2021-08-01T02:02:00.000Z"
}
```

에러처리

- 해당 번호의 게시물이 없을 경우 `404`

### 3.6 게시물 삭제

요구사항

- 로그인했고, 해당 게시물의 작성자만 호출 가능합니다.

URL `DELETE` /api/boards/:id `인증`

Reponse

```json
{
	"data": "OK"
}
```

에러처리

- 인증 정보가 없을 경우 `401`
- 해당 게시물의 작성자가 아닐 경우 `401`
- 해당 번호의 게시물이 없을 경우 `404`

### 3.7 게시물 좋아요

요구사항

- 해당 id의 게시물에 좋아요를 누를 시 호출하는 API입니다. (좋아요 취소는 없습니다)
- 게시물 당 유저가 누를 수 있는 좋아요는 최대 1번입니다.
    - 예를 들어 좋아요가 3개인 게시물에 좋아요를 처음 누를 경우, 4가 됩니다.
    - 그 이후 같은 유저가 좋아요를 계속 호출해도 4에서 더 늘어나지 않습니다.
- 좋아요가 눌린 게시물의 객체가 반환됩니다.
- 만일 로그인했고, 해당 유저가 게시물에 좋아요를 눌렀을 경우 isLike는 true 값을 가집니다.
- 로그인을 하지 않았거나, 로그인 했어도 좋아요를 누르지 않았을 경우 isLike는 false 값을 가집니다.

URL `POST` /api/boards/:id/like `인증`

Reponse

```json
{
	"id": 1,
	"userId" : 1,
	"user": {
		"nickname": "팬더"
	},
	"title": "제목입니다",
	"content": "내용입니다",
	"like": 1,
	"isLike": true,
	"createdAt": "2021-08-01T02:02:00.000Z"
}
```

에러처리

- 인증 정보가 없을 경우 `401`

# 구현 시 유의사항

이번 과제는 문제 해결 능력, 비즈니스 로직의 분리 능력을 확인합니다.

- 코드 가독성에 최대한 신경써주세요
- 보안에 민감한 데이터(`password`)는 외부에 노출시키지 마세요.
