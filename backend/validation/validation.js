module.exports = {
  validation: (values) => {
    if (
      values.email.length === 0 ||
      values.password.length === 0 ||
      values.nickname.length === 0 ||
      values.title.length === 0 ||
      values.content.length === 0
    ) {
      res.status(400);
      throw new Error("빈칸이 있음");
    }
    if (values.nickname.length > 10) {
      res.status(403);
      throw new Error("닉네임 길이가 김");
    }
    if (
      values.password.search(/\d/) == -1 ||
      values.password.search(/[a-zA-Z]/) == -1
    ) {
      res.status(403);
      throw new Error("비번에 문자나 숫자가 없음");
    }
    if (values.title.length > 30) {
      res.status(403);
      throw new Error("제목이 30자를 초과");
    }
  },
};
