import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('letsHelp/Colombia/users/')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // Ruta para crear un usuario
    @Post()
    async createUser(@Body() userData: CreateUserDto): Promise<{ id: string }> {
        try {
            // Llama al servicio para crear un usuario y retorna el ID del documento
            const id = await this.usersService.createUser(userData);
            return { id };
        } catch (error) {
            return  error
        }
    }

    // Ruta para obtener todos los usuarios
    @Get()
    async getUsers(): Promise<any[]> {
        // Llama al servicio para obtener todos los documentos de la colección
        return await this.usersService.getUsers();
    }

    // Ruta para actualizar un usuario por ID
    @Patch(':id')
    async updateUser(@Param('id') userId: string, @Body() updateData: UpdateUserDto): Promise<string> {
        // Llama al servicio para actualizar un documento
        await this.usersService.updateUser(userId, updateData);
        return `User with ID ${userId} updated successfully.`;
    }

    // Ruta para eliminar un usuario por ID
    @Delete(':id')
    async deleteUser(@Param('id') userId: string): Promise<string> {
        // Llama al servicio para eliminar un documento
        await this.usersService.deleteUser(userId);
        return `User with ID ${userId} deleted successfully.`;
    }




}

