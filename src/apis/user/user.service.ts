import { BadRequestException, Injectable } from '@nestjs/common';
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
			throw new BadRequestException('User Not Found');
		}
		if (user.isActive === false) {
			throw new BadRequestException('User has not been activated yet');
		}
		const comparePassword = await verify(user.password, password);
		if (!comparePassword) {
			throw new BadRequestException('Email or password incorrect');
		}
		return user;
	}

	async validateUserById(id: string): Promise<UserEntity> {
		return UserEntity.findOneOrFail({ where: { id }, relations: ['role', 'role.permissions'] });
	}

	async getAllUsers(): Promise<UserEntity[]> {
		return this.userRepo.find();
	}
}
