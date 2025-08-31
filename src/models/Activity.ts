import { Entity, Index, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm'
import { Post } from './Post';
import { User } from './User';

export enum ActivityType {
  POST = 'POST',
  COMMENT = 'COMMENT',
  LIKE = 'LIKE',
}

@Entity()
@Index("idx_feed_user_type_created_id", ["userId", "type", "createdAt", "id"], { 
    unique: false,
})
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postId: string | null;
  
  @Column()
  userId: string;

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

  constructor(type: ActivityType, user: User, post: Post | null) {
    this.type = type;
    this.user = user;
    this.userId = user.id;
    this.postId = post ? post.id : null;
  }
}
