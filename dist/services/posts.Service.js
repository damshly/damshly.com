"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const postModel_1 = require("../models/postModel");
class PostsService {
    static createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, description, sections } = req.body;
            const user_id = req.user.id;
            // console.log(title, description,sections, user_id);
            // const post ={user_id, title, description}
            // console.log(post);
            const post = yield postModel_1.PostQuerys.createPost(user_id, title, description);
            for (const section of sections) {
                if (section.type == "text") {
                    const text = yield postModel_1.PostQuerys.addSection(post.id, section.section_type, section.title, section.description, section.position);
                    console.log(text);
                }
                else if (section.type == "media") {
                    const media = yield postModel_1.PostQuerys.addSection(post.id, section.section_type, section.title, section.description, section.position);
                    console.log(media);
                }
            }
            res.send("ok");
            return;
        });
    }
    static createTextPost(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const account_id = req.user.id;
            const { title, description } = req.body;
            console.log(account_id, title, description);
            const post = yield postModel_1.PostQuerys.createPost(account_id, title, description);
            console.log(req.body.sections);
            console.log(Array.isArray(req.body.sections));
            const sections = req.body.sections.map((section) => JSON.parse(section));
            console.log(sections);
            yield postModel_1.PostQuerys.addSections(post.id, sections);
            // res.json(post);
            const texts = req.body.text;
            texts.forEach((text) => __awaiter(this, void 0, void 0, function* () {
                yield postModel_1.PostQuerys.addTextSection(post.id, text);
            }));
            return post;
        });
    }
}
exports.PostsService = PostsService;
