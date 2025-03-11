import { PostQuerys } from "../models/postModel";
import { PostsService } from "../services/posts.Service";
export class PostsController {
  static async createPost(req: any, res: any) {
    const account_id :number = (req as any).user.id;
    const { title, description } = req.body;
    console.log(account_id, title, description);
    
    const post = await PostQuerys.createPost(account_id, title, description);
    res.json(post.id);
  }
  static async createTextPost(req: any, res: any) {
    const post = await PostsService.createTextPost(req);
    res.json(post);
  }
}