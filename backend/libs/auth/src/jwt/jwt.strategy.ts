import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Dependency } from '@libs/decorator'
import { ExtractJwt } from 'passport-jwt'
import { Strategy } from 'passport-jwt'
import { AuthenticatedUser } from '../authenticated-user.class'
import type { JwtObject } from './jwt.interface'

@Dependency()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET')
    })
  }

  async validate(payload: JwtObject): Promise<AuthenticatedUser> {
    return new AuthenticatedUser(payload.userId, payload.username)
  }
}
