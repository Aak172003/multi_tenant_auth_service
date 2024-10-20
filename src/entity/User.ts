import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from "typeorm";
import { Tenant } from "./tenant";

@Entity({ name: "users" })
export class User {
    // Primary Key
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    role: string;

    @Column()
    dob: string;

    @UpdateDateColumn()
    updatedAt: number;

    @CreateDateColumn()
    createdAt: number;

    // Foreign Key
    @ManyToOne(() => Tenant)
    // tenantId is a attribute which is a type of Tenant
    tenant: Tenant;
}
