import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto{

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name?: string;
    
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    lastname?: string;
    
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    phone?: string;
    
    @IsOptional()
    image?: string;    

    @IsOptional()
    notification_token?: string;

}