import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import bcrypt from 'bcrypt';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

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

    // TODO: 이미 존재하는 이메일이면 에러

    // Prisma로 DB에 데이터 저장
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return {
      message: '회원가입 성공',
      user,
    };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    // DB에서 정보 가져왔다고 가정
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return { message: '존재하지 않는 이메일입니다.' };
    }

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return { message: '비밀번호가 일치하지 않습니다.' };
    }

    // 로그인 성공
    return {
      message: '로그인 성공',
      user: { id: user.id, email: user.email },
    };
  }
}
