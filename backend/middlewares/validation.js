module.exports = {
  validForJoin: (req, res, next) => {
    const { email, password, nickname } = req.body;
    if (email.length === 0 || password.length === 0 || nickname.length === 0) {
      res.status(400);
      throw new Error("빈칸이 있음");
    }
    if (nickname.length > 10) {
      res.status(403);
      throw new Error("닉네임 길이가 김");
    }
    if (password.search(/\d/) == -1 || password.search(/[a-zA-Z]/) == -1) {
      res.status(403);
      throw new Error("비번에 문자나 숫자가 없음");
    }
    next();
  },

  validForBoard: (req, res, next) => {
    const { title, content } = req.body;
    if (title.length === 0 || content.length === 0) {
      res.status(400);
      throw new Error("빈칸이 있음");
    }
    if (title.length > 30) {
      res.status(403);
      throw new Error("제목이 30자 초과");
    }
    next();
  },
};
