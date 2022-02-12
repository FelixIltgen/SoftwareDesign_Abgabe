import { readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";

export class FileHandler {
  private static _instance : FileHandler = new FileHandler();
  private rootDir : Array<string> = [__dirname, "../../../../"];

  private constructor() {
    if(FileHandler._instance) 
      throw new Error("Instead of using new FileHandler(), please use FileHandler.getInstance() for Singleton!")
    FileHandler._instance = this;
  }

  public static getInstance() : FileHandler {
    return FileHandler._instance;
  }

  public readJsonFile(pathToFile: string) : any {
    let jsonRaw : Buffer = readFileSync(resolve(this.rootDir + pathToFile));
    let json : any = JSON.parse(jsonRaw.toString());

    return json;
  }

  public writeJsonFile(pathToFile : string, dataToFile: any) : void {
    writeFileSync(resolve(this.rootDir + pathToFile), JSON.stringify(dataToFile));
  }
}

export default FileHandler.getInstance();