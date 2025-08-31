import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Post } from './Post';
import { User } from './User';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  postId: string | null;

  @ManyToOne(() => Post, (post) => post.activities)
  post: Post;

  @ManyToOne(() => User, (user) => user.activities)
  user: User;

  constructor(type: string, user: User) {
    this.type = type;
    this.user = user;
  }
}
