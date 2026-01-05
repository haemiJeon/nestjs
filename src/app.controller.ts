import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import bcrypt from 'bcrypt';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('hello')
  getHelloMsg(): string {
    return '안녕하세요!';
  }

  @Post('signup')
  async signUp(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    // 비밀번호 암호화 (보안 강도: 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    return {
      message: '회원가입 성공',
      userEmail: email,
      secret: hashedPassword,
    };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    // DB에서 정보 가져왔다고 가정
    const user = { email: 'test@example.com', password: '1234' };

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const payload = { email: user.email, sub: 'user-id-123' };

      return {
        access_token: '이곳에_서버만_아는_비밀키로_서명된_토큰이_들어갑니다',
        message: '로그인 성공!',
      };
    } else {
      return { message: '비밀번호가 틀렸습니다!' };
    }
  }
}
