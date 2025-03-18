import { postQuerys } from "../Repository/postModel";
import { PostsService } from "../services/posts.Service";
export class PostsController {
  static async createPost(req: any, res: any) {
    const post = await PostsService.createPost(req,res);
    res.json(post);
  }
  static async getPost(req: any, res: any) {
    const post = await PostsService.getPostById(req,res);
    res.json(post);
  }
}