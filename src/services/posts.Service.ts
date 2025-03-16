import { PostQuerys } from "../models/postModel";

export class PostsService {
  static async createPost(req : any, res : any) {
    const{title, description,sections} = req.body
    const user_id = (req as any).user.id
    // console.log(title, description,sections, user_id);
    const post ={user_id, title, description}
    console.log(post);
    for (const section of sections) {
      if (section.type == "text") {
        // console.log(section);
      }
      else if (section.type == "media") {
        console.log(section);
      }
    }
    res.send("ok")
    return
  }
    static async createTextPost(req: any) {
        const account_id :number = (req as any).user.id;
        const { title, description } = req.body;
        console.log(account_id, title, description);
        
        const post = await PostQuerys.createPost(account_id, title, description);

        
        console.log(req.body.sections);
        console.log(Array.isArray(req.body.sections));
        const sections = req.body.sections.map((section: string) => JSON.parse(section));
        console.log(sections);
        await PostQuerys.addSections(post.id, sections);
        // res.json(post);
        const texts = req.body.text;
        texts.forEach(async (text: any) => {
          await PostQuerys.addTextSection(post.id, text);
        });
        return post
    
      }
}