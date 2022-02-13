import readline from 'readline';
import prompts, { Answers } from 'prompts';

class Console {
  private static _instance : Console = new Console();

  public consoleLine : readline.ReadLine = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

  constructor() {
    if(Console._instance) 
      throw new Error("Instead of using new Console(), please use Console.getInstance() for Singleton!")
    Console._instance = this;
  }

  public static getInstance() : Console {
    return Console._instance;
  }

  public printLine(line : string) : void {
    this.consoleLine.write(line);
    this.consoleLine.write("\n");
  }

  public showOptions(options : string[], question: string) : Promise<Answers<string>> {
    return prompts({
      type: 'select',
      name: 'value',
      message: question,
      choices: [
        { title: options[0], value: '1' },
        { title: options[1], value: '2' },
        { title: options[2], value: '3' }
      ],
      initial: 1
    })
  }
  public showOnlyTwoOptions(options : string[], question: string) : Promise<Answers<string>> {
    return prompts({
      type: 'select',
      name: 'value',
      message: question,
      choices: [
        { title: options[0], value: '1' },
        { title: options[1], value: '2' }
      ],
      initial: 1
    })
  }
  public showFourOptions(options : string[], question: string) : Promise<Answers<string>> {
    return prompts({
      type: 'select',
      name: 'value',
      message: question,
      choices: [
        { title: options[0], value: '1' },
        { title: options[1], value: '2' },
        { title: options[2], value: '3' },
        { title: options[3], value: '4' }
      ],
      initial: 1
    })
  }
  public showMoreOptions(options : string[], question: string) : Promise<Answers<string>> {
    return prompts({
      type: 'select',
      name: 'value',
      message: question,
      choices: [
        { title: options[0], value: '1' },
        { title: options[1], value: '2' },
        { title: options[2], value: '3' },
        { title: options[3], value: '4' },
        { title: options[4], value: '5' }
      ],
      initial: 1
    })
  }
  public showSixOptions(options : string[], question: string) : Promise<Answers<string>> {
    return prompts({
      type: 'select',
      name: 'value',
      message: question,
      choices: [
        { title: options[0], value: '1' },
        { title: options[1], value: '2' },
        { title: options[2], value: '3' },
        { title: options[3], value: '4' },
        { title: options[4], value: '5' },
        { title: options[5], value: '6' }
      ],
      initial: 1
    })
  }
  public async dateQuestion(question: string) : Promise<Answers<string>> {
    return prompts({
      type: 'date',
      name: 'value',
      message: question,
    })
  }
  public async numberQuestion(question: string) : Promise<Answers<string>> {
    return prompts({
      type: 'number',
      name: 'value',
      message: question,
      initial: 0,
      min: 60,
      max: 7200
    })
  }
  public async userQuestion(question: string) : Promise<Answers<string>> {
    return prompts({
      type: 'text',
      name: 'value',
      message: question,
       
    })
  }
  public userQuestionPw(question: string) : Promise<Answers<string>> {
    return prompts({
      type: 'password',
      name: 'value',
      message: question,
       
    })
  }
  public yesNo(question: string) : Promise<Answers<string>> {
    return prompts({
      type: 'toggle',
      name: 'value',
      message: question,
      initial: true,
      active: "Ja",
      inactive: "Nein" 
    })
  }
}

export default Console.getInstance();