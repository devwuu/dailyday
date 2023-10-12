export class JwtPayload {
  sub: string; // 토큰 제목 (id)
  iat?: number; // 발급된 시간
  exp?: number; // 만료 시간
}
