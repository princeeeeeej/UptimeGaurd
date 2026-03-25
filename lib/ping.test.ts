import { pingUrl } from "./ping";

async function test() {
  console.log("Google url");
  const resultUrl = await pingUrl("https://google.com");
  console.log(resultUrl);

  console.log("Testing fake site...");
  const result2 = await pingUrl("https://thiswebsitedoesnotexist12345.com");
  console.log(result2);
}

test();