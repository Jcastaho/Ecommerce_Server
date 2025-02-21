import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { hash } from "bcryptjs";
import { Rol } from "src/roles/rol.entity";
import { Address } from "src/address/address.entity";

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastname: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    phone: string;

    @Column({ nullable: true })
    image: string;

    @Column()
    password?: string;

    @Column({ nullable: true })
    notification_token: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;


    @JoinTable({
                name: 'user_has_roles',
                joinColumn: {
                    name: 'id_user'
                },
                inverseJoinColumn:{
                    name: 'id_rol'
                }

    })//tabla principal de la relacion
    @ManyToMany(() => Rol, (rol) => rol.users)//relacion muchos a muchos
    roles: Rol[];

    @OneToMany(() => Address, address => address.id)
    address: Address;


    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, Number(process.env.HASH_SALT));
    }



}