import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { verify } from 'argon2';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { IUserService } from './user.interface';

@Injectable()
export class UserService extends IUserService {
	notFoundMessage = 'Không tìm thấy User';

	constructor(@InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>) {
		super(userRepo);
	}

	async validateUserByEmailPassword(email: string, password: string): Promise<UserEntity> {
		try {
			const user = await this.getOne({ where: { email } });
			if (!user) {
				throw new UnauthorizedException('Không tìm thấy user');
			}
			if (user.isActive === false) {
				throw new UnauthorizedException('User chưa được kích hoạt');
			}
			const comparePassword = await verify(user.password, password);
			if (!comparePassword) {
				throw new UnauthorizedException('Sai mật khẩu');
			}
			return user;
		} catch (error) {
			throw error;
		}
	}

	async validateUserById(id: string): Promise<UserEntity> {
		return this.getOneByIdOrFail(id);
	}
}
