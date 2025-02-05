export class CreateUserDto{

    name: string;
    lastname: string;
    email: string;
    phone: string;
    image?: string;
    password: string;
    notification_token?: string;
}