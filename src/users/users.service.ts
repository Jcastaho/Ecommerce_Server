import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import storage = require('../utils/cloud_storage');
import { Rol } from 'src/roles/rol.entity';


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>
    ) { }

    create(user: CreateUserDto) {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser)
    }

    
    findAll() {
        return this.usersRepository.find({ relations: ['roles'] })
    }


    async update(id: number, user: UpdateUserDto) {
        const userFound = await this.usersRepository.findOneBy({ id: id });

        if (!userFound) {
            throw new HttpException('Userio no existe', HttpStatus.NOT_FOUND);
        }

        const updatedUser = Object.assign(userFound, user);

        return this.usersRepository.save(updatedUser)
    }


    async updateWithImage(file: Express.Multer.File, id: number, user:UpdateUserDto ) {
        const userFound = await this.usersRepository.findOneBy({ id: id });
        if (!userFound) {
            throw new HttpException('Userio no existe', HttpStatus.NOT_FOUND);
        }else{
            const folder = 'IMAGE_USER' + userFound.name +'_'+ userFound.lastname +'_'+ userFound.phone;  // La carpeta donde se guardará la imagen
            const fileName = file.originalname;  // El nombre original del archivo
            const filePath = `${folder}/${fileName}`;
            const url = await storage(file, filePath);  // Almacenamos la imagen en la ruta especificada
            console.log('URL: ' + url)
    
            if(url === undefined && url === null){
                throw new HttpException('La imagen no se pudo guardar', HttpStatus.INTERNAL_SERVER_ERROR);
            } 
            user.image = url;
            const updatedUser = Object.assign(userFound, user);
    
            return this.usersRepository.save(updatedUser)
        }



    }

}
