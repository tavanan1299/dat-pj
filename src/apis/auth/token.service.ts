import { TokenError } from '@app/common/enums/tokenError.enum';
import { TokenType } from '@app/common/enums/tokenType.enum';
import {
	AccessTokenExpiredException,
	InvalidTokenException,
	RefreshTokenExpiredException
} from '@app/common/http/exceptions';
import { IJwtService } from '@app/modules/jwt';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenEntity } from '../user/entities/refreshToken.entity';
import { UserEntity } from '../user/entities/user.entity';
import { TokenDto } from './dto/token.dto';
const sha1 = require('sha1');

@Injectable()
export class TokenService {
	constructor(
		// private jwtService: JwtService,
		private readonly jwtService: IJwtService,
		private configService: ConfigService
	) {}

	/**
	 * Generate Auth token(JWT) service for login user
	 * @param JwtPayload {JwtPayload}
	 * @returns TokenDto Returns access and refresh tokens with expiry
	 */
	public async generateAuthToken(payload: JwtPayload): Promise<TokenDto> {
		const accessTokenExpires = this.configService.get('ACCESS_TOKEN_EXPIRES_IN');
		const refreshTokenExpires = this.configService.get('REFRESH_TOKEN_EXPIRES_IN');
		const tokenType = this.configService.get('TOKEN_TYPE');
		const accessToken = await this.generateToken(payload, accessTokenExpires);
		const refreshToken = await this.generateToken(payload, refreshTokenExpires);

		return {
			tokenType,
			accessToken,
			accessTokenExpires,
			refreshToken
		};
	}

	/**
	 * Generate Refresh token(JWT) service for generating new refresh and access tokens
	 * @param payload {JwtPayload}
	 * @returns  Returns access and refresh tokens with expiry or error
	 */
	public async generateRefreshToken(refreshToken: string): Promise<TokenDto> {
		try {
			const rt = await RefreshTokenEntity.findOne({
				where: {
					refresh: await sha1(refreshToken)
				}
			});

			if (!rt) {
				throw new UnauthorizedException('User does not exist');
			}

			const { id } = await this.verifyToken(refreshToken, TokenType.RefreshToken);
			return this.generateAuthToken({ id });
		} catch (error) {
			throw new UnauthorizedException(error);
		}
	}

	/**
	 * Verify JWT service
	 * @param token JWT token
	 * @param type {TokenType} "refresh" or "access"
	 * @returns decrypted payload from JWT
	 */
	public verifyToken(token: string, type: TokenType) {
		try {
			return this.jwtService.verify(token);
		} catch (error: any) {
			if (error.name == TokenError.TokenExpiredError && type == TokenType.AccessToken) {
				throw new AccessTokenExpiredException();
			}
			if (error.name == TokenError.TokenExpiredError && type == TokenType.RefreshToken) {
				throw new RefreshTokenExpiredException();
			}
			throw new InvalidTokenException();
		}
	}

	/**
	 * Validate received JWT
	 * @param token {string}
	 * @returns valid: boolean
	 */
	public async validateToken(token: string): Promise<{ valid: boolean }> {
		try {
			const { id } = await this.jwtService.verify(token);
			const user = await UserEntity.findOne({
				where: { id }
			});
			if (!user || user.isActive == false) {
				return { valid: false };
			}

			return { valid: !!id };
		} catch (error) {
			Logger.error('Validation token error', error);
			return { valid: false };
		}
	}

	/**
	 * Generate JWT token
	 * @private
	 * @param payload {JwtPayload}
	 * @param expiresIn {string}
	 * @returns JWT
	 */
	private async generateToken(payload: JwtPayload, expiresIn: string): Promise<string> {
		const token = await this.jwtService.sign(payload, { expiresIn });
		return token;
	}
}
