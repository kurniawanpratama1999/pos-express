import app from "./app";
import { Config } from "./modules/configs/Config";

app.listen(Config.port(), () => {
  console.log("berjalan di port 3000");
});
