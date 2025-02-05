import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'roles'})
export class Rol {
    
    @PrimaryColumn()
    id: String;

    @Column({unique: true})
    name: String;

    @Column()
    image: String;

    @Column()
    route: String;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    
    @UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;


    @ManyToMany(() => User, (user)=> user.roles)
    users: User[];


}