import { postQuerys} from "../Repository/postModel";

export class PostsService {
  static async createPost(req : Request, res : Response) {
    const{title, description,sections} = (req as any).body
    const user_id = (req as any).user.id
    // console.log(title, description,sections, user_id);
    // const post ={user_id, title, description}
    // console.log(sections);
    
    const post = await postQuerys.createPost(user_id, title, description);
    console.log(post);
    
    for (const section of sections) {
      if (section.type == "text") {
        // console.log(section);
        const text = await postQuerys.addSection(post.id, section.type, section.title, section.description, section.so);
        const text_section = await postQuerys.addTextSection(text.id, section.content);
        console.log(text , text_section);
        
      }
      else if (section.type == "media") {
        const media = await postQuerys.addSection(post.id, section.type, section.title, section.description, section.so);
        const media_section = await postQuerys.addMediaSection(media.id, section.location, section.caption, section.mimeType);
        console.log(media,media_section);
        
      }
    }
    // const endpost = {post,sections}
    return {post,sections}
  }
  static async getPostById(req : any, res : any) {
    
    const post = await postQuerys.getPostById(req.params.id);
    const sections = await postQuerys.getSectionsByPostId(req.params.id);
    const sectionContent = await Promise.all(sections.map(async (section) => {
      if (section.section_type == "text") {
        const text_section = await postQuerys.getTextSectionBySectionId(section.id);
        return text_section;
      }
      else if (section.section_type == "media") {
        const media_section = await postQuerys.getMediaSectionBySectionId(section.id);
        return media_section;
      }
    }))
    return {post,sections,sectionContent}
  }
}