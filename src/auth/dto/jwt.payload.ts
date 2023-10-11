export class JwtPayload {
  sub: string; // 토큰 제목 ( username)
  iat?: number; // 발급된 시간
  exp?: number; // 만료 시간
}
