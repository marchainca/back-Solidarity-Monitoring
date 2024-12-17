import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { FirebaseService } from 'src/firebase/firebase.service';
import { errorResponse } from 'src/tools/function.tools';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    private collectionName = 'users';
    constructor(
        private readonly jwtService: JwtService,
        private readonly firebaseService: FirebaseService
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        try {
            console.log("validateUser", email, password)
            const user = await this.firebaseService.findUserByField("email", email, this.collectionName);
            console.log("valor de user", user[0].password);
            if (user.length < 1) {
                throw await errorResponse("Error: Invalid email", "validateUser");
            }

            if (user[0].password != password) {
                throw await errorResponse("Error: Invalid password", "validateUser");
            }
            return { id: user[0].id, email: user[0].email, name: user[0].name, role: user[0].role};
        } catch (error) {
            throw error;
        }
        
    }
    
    // Generar un JWT
    async login(user: any): Promise<{ accessToken: string }> {
        try {
            const payload = { sub: user.id, email: user.email, roles: user.role };
            console.log("payload", payload)
            return {
            accessToken: this.jwtService.sign(payload),
            };
        } catch (error) {
            console.log("Error login", error)
            throw error;
        }
    }
      
}
