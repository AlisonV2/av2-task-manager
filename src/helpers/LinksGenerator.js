import dotenv from 'dotenv';
import apiLinks from './links';
dotenv.config();

class LinksGenerator {

  static getLink(model, id) {
    const baseUrl = process.env.BASE_URL;
    console.log(model)
    switch (model) {
      case 'task':
        return `${baseUrl}/tasks/${id}`;
      case 'tasks':
        return `${baseUrl}/tasks`;
      case 'users':
        return `${baseUrl}/users/current`;
      case 'sessions':
        return `${baseUrl}/sessions`;
      case 'tokens':
        return `${baseUrl}/tokens`;
      default:
        return '';
    }
  }

  static generateLinks(ref, id = null) {
    let links = [];

    const schema = apiLinks.find((item) => item.ref === ref);
    for (let i in schema.links) {
      console.log(schema.links[i].model)
      const rel = schema.links[i].type === 'collection' ? schema.links[i].model : 'self';
      const href = this.getLink(schema.links[i].model, id);

      const link = {
        rel,
        href,
      };
      links.push(link);
    }
    return links;
  }
}

export default LinksGenerator;
