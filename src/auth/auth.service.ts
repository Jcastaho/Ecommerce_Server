import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { In, Repository } from 'typeorm';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compare } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/roles/rol.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        @InjectRepository(Rol) private rolesRepository: Repository<Rol>,
        private jwService: JwtService

    ) { }


    async register(user: RegisterAuthDto) {
        const { email, phone } = user
        const emailExist = await this.usersRepository.findOneBy({ email: email })

        if (emailExist) {
            throw new HttpException('El correo ya existe', HttpStatus.CONFLICT)//error 409
        }

        const phoneExist = await this.usersRepository.findOneBy({ phone: phone })

        if (phoneExist) {
            throw new HttpException('El telefono ya existe', HttpStatus.CONFLICT)//error 409
        }


        const newUser = this.usersRepository.create(user);

        let rolesIds: String[] = []; // Especifica el tipo
        if (user.rolesIds !== undefined && user.rolesIds !== null) {
            rolesIds = user.rolesIds;
        }else{
            rolesIds.push('CLIENT')
        }

        const roles = await this.rolesRepository.findBy({ id: In(rolesIds) });

        newUser.roles = roles;

        const userSaved = await this.usersRepository.save(newUser)
        const rolesString = userSaved.roles.map(rol => rol.id)

        const payload = {
            id: userSaved.id,
            name: userSaved.name,
            roles: rolesString
        }
        const token = this.jwService.sign(payload)

        const data = {
            user: userSaved,
            token: 'Bearer ' + token
        }

        delete data.user.password
        return data
    }

    async login(loginData: LoginAuthDto) {
        const { email, password } = loginData
        const userFound = await this.usersRepository.findOne({
            where: { email: email },
            relations: ['roles']//     @ManyToMany(() => Rol, (rol) => rol.users) roles: Rol[]; user.entity.ts se coloca tal cual como esta alli y es roles

        })
        if (!userFound) {
            throw new HttpException('El correo no existe', HttpStatus.NOT_FOUND)//error 404
        }

        const isPasswordValid = await compare(password, userFound.password)

        if (!isPasswordValid) {
            throw new HttpException('La contraseña es incorrecta', HttpStatus.FORBIDDEN)//error 403 FORBIDDEN
        }

        const rolesIds = userFound.roles.map(rol => rol.id);

        const payload = {
            id: userFound.id,
            name: userFound.name,
            roles: rolesIds
        }
        const token = this.jwService.sign(payload)

        const data = {
            user: userFound,
            token: 'Bearer ' + token
        }

        delete data.user.password
        return data

    }

}
