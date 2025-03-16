import { PostQuerys } from "../models/postModel";
import { PostsService } from "../services/posts.Service";
export class PostsController {
  static async createPost(req: any, res: any) {
    const post = await PostsService.createPost(req,res);
    res.json(post);
  }
  static async createTextPost(req: any, res: any) {
    // const post = await PostsService.createPost(req);
    // res.json(post);
    return
  }
}