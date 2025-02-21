import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {

    @IsOptional()
    @IsString()
    name?: String;

    @IsOptional()
    @IsString()
    description?: String;

    @IsOptional()
    image?: String;
}