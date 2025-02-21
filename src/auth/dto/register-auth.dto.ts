import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterAuthDto{

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    lastname: string;


    @IsNotEmpty()
    @IsString()
    @IsEmail({}, {message: 'El correo no es valido'})
    email: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, {message: 'La contraseña debe de tener minimo 6 caracteres'})
    password: string;

    rolesIds: String[]

}