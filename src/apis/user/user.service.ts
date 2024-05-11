import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { verify } from 'argon2';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { IUserService } from './user.interface';

@Injectable()
export class UserService extends IUserService {
	notFoundMessage = 'User Not Found!';

	constructor(@InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>) {
		super(userRepo);
	}

	async validateUserByEmailPassword(email: string, password: string): Promise<UserEntity> {
		const user = await this.getOne({ where: { email } });
		if (!user) {
			throw new UnauthorizedException('User Not Found');
		}
		if (user.isActive === false) {
			throw new UnauthorizedException('User has not been activated yet');
		}
		const comparePassword = await verify(user.password, password);
		if (!comparePassword) {
			throw new UnauthorizedException('Password Incorrect');
		}
		return user;
	}

	async validateUserById(id: string): Promise<UserEntity> {
		return this.getOneByIdOrFail(id);
	}
}
