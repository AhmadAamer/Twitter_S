import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/user.entity';
import { Int } from 'type-graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Role {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id?: number;

  @Column({ type: 'varchar', length: 30 })
  @Field()
  name: string;

  @Field(() => [String])
  @Column({ type: 'simple-array' })
  permissions: string[];

  @Field(() => [User], { nullable: true })
  @OneToMany(() => User, (user) => user.role, { onDelete: 'SET NULL' })
  users?: User[];
}
