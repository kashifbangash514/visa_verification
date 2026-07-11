import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const admin = await this.adminRepository.findOne({ where: { username: dto.username } });

    const passwordMatches = admin ? await bcrypt.compare(dto.password, admin.passwordHash) : false;

    if (!admin || !passwordMatches) {
      throw new UnauthorizedException('Invalid username or password.');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: admin.id,
      username: admin.username,
    });

    return { accessToken };
  }
}
