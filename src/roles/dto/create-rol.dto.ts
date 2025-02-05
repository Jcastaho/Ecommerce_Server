import { IsNotEmpty, IsString } from "class-validator";

export class CreateRolDto{

    @IsNotEmpty()
    @IsString()
    id: String;

    @IsNotEmpty()
    @IsString()
    name: String;

    @IsNotEmpty()
    @IsString()
    image: String;

    @IsNotEmpty()
    @IsString()
    route: String;


}