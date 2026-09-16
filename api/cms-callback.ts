import { finishCmsAuth } from "../server/cms-oauth.js";

export async function GET(request: Request) {
  return finishCmsAuth(request);
}

