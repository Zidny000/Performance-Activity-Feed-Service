import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm'
import { Post } from './Post';
import { User } from './User';

export enum ActivityType {
  POST = 'POST',
  COMMENT = 'COMMENT',
  LIKE = 'LIKE',
}

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postId: string | null;

  @Column({
    type: 'enum',
    enum: ActivityType,
  })
  type: ActivityType;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Post, (post) => post.activities)
  post: Post;

  @ManyToOne(() => User, (user) => user.activities)
  user: User;

  constructor(type: ActivityType, user: User) {
    this.type = type;
    this.user = user;
  }
}
