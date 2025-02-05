import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginAuthDto{

    @IsNotEmpty()
    @IsString()
    @IsEmail({}, {message: 'El correo no es valido'})
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, {message: 'La contraseña debe de tener minimo 6 caracteres'})
    password: String;

}