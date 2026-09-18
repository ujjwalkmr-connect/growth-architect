import { startCmsAuth } from "../server/cms-oauth.js";

export async function GET(request: Request) {
  return startCmsAuth(request);
}

