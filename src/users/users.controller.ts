import { Controller, Get } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

@Controller('letsHelp/Colombia/users/')
export class UsersController {
    constructor (private readonly firabaseService: FirebaseService){}

    @Get('test')
    async testFirebase(){
        const data = await this.firabaseService.getDocuments('users');
        return data;
    }
}

