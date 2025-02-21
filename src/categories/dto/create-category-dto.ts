import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto{
    
    @IsNotEmpty()
    @IsString()
    name: String;

    @IsNotEmpty()
    @IsString()
    description: String;

    image: String;
}