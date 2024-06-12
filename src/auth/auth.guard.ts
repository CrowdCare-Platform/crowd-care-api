import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpStatus,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import {Roles} from "./roles.decorator";
import {Reflector} from "@nestjs/core";

@Injectable()
export class LogtoAuthGuard implements CanActivate {
    private discoveryCache: DiscoveryResponseData;

    constructor(private readonly configService: ConfigService, private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest() as Request;
        await this.verifyAuthFromRequest(request);

        const roles = this.reflector.get(Roles, context.getHandler());
        if (!roles) {
            return true;
        }
        const user = request['user'];
        return this.matchRoles(roles, user.organizationRoles);
    }

    private async verifyAuthFromRequest(request: Request) {
        const token = this.extractBearerTokenFromHeaders(request);
        if (!this.discoveryCache) {
            console.log("Fetching discovery");
            this.discoveryCache = await this.fetchDiscovery();
        }

        try {
            const logToAud = this.configService.get('LOGTO_AUD');
            const { payload } = await jwtVerify(
                token,
                createRemoteJWKSet(new URL(this.discoveryCache.jwks_uri)),
                {
                    issuer: this.discoveryCache.issuer,
                    audience: logToAud,
                },
            );
            // console.log("Payload", payload);
            request['user'] = payload.user;
        } catch (e) {
            throw new UnauthorizedException('JWT verification failed!');
        }
    }

    private async fetchDiscovery() {
        const logToDomain = this.configService.get('LOGTO_DOMAIN');
        const discoveryUrl = `${logToDomain}/oidc/.well-known/openid-configuration`;
        const response = await axios.get<DiscoveryResponseData>(discoveryUrl);
        if (response.status !== HttpStatus.OK) {
            throw new BadRequestException(`Could not fetch ${discoveryUrl}`);
        }

        return response.data;
    }

    private extractBearerTokenFromHeaders(request: Request) {
        const authorization = request.get('Authorization');
        const bearerTokenIdentifier = 'Bearer';
        if (!authorization) {
            throw new UnauthorizedException('Authorization header is missing');
        }

        if (!authorization.startsWith(bearerTokenIdentifier)) {
            throw new UnauthorizedException(
                'Authorization token type is not supported. Only Bearer tokens are supported.'
            );
        }

        return authorization.slice(bearerTokenIdentifier.length + 1);
    }

    private matchRoles(roles: string[], userRoles: any[]): boolean {
        console.log(roles, userRoles);
        return roles.some(role => userRoles.map(_ => _.roleName.toLowerCase()).includes(role.toLowerCase()));
    }
}

interface DiscoveryResponseData {
    jwks_uri: string;
    issuer: string;
}
