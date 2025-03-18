import { PostQuerys} from "../models/postModel";

export class PostsService {
  static async createPost(req : any, res : any) {
    const{title, description,sections} = req.body
    const user_id = (req as any).user.id
    // console.log(title, description,sections, user_id);
    // const post ={user_id, title, description}
    // console.log(sections);
    
    const post = await PostQuerys.createPost(user_id, title, description);
    console.log(post);
    
    for (const section of sections) {
      if (section.type == "text") {
        // console.log(section);
        const text = await PostQuerys.addSection(post.id, section.type, section.title, section.description, section.so);
        const text_section = await PostQuerys.addTextSection(text.id, section.content);
        console.log(text , text_section);
        
      }
      else if (section.type == "media") {
        const media = await PostQuerys.addSection(post.id, section.type, section.title, section.description, section.so);
        const media_section = await PostQuerys.addMediaSection(media.id, section.location, section.caption, section.mimeType);
        console.log(media,media_section);
        
      }
    }
    // const endpost = {post,sections}
    res.send("ok")
    return
  }
}