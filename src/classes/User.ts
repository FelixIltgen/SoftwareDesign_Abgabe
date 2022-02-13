import console from 'console';
import { mainModule } from 'process';
import { Answers } from 'prompts';
import * as readline from 'readline';
import { couldStartTrivia } from 'typescript';
import { bookingData } from './dao/booking';
import { carData } from './dao/carInformation';
import { userData } from './dao/userInterface';
import Console from './singletons/Console';
import FileHandler from './singletons/FileHandler';

export class User {

  public checkUsername: boolean = false;
  public globalUserName: string = "";
  public allUserInfo: userData[] = FileHandler.readJsonFile("json/user.json");
  public data: userData = { username: "", password: "" };
  
  public async userRegitser(): Promise<void> {

    console.log("Wilkommen bei der Registrierung!");
    console.log("--------------------------------");
    //ask user for name and password
    let username = await Console.benutzerAbfrage("Geben Sie ein Benutzername ein!");
    let userPassword = await Console.benutzerAbfragePw("Geben Sie ein Passwort ein!");

    //check if the input is filled with admin values
    if (username.value == "Admin" && userPassword.value == "123") {
      console.log("Du Vogel, als Admin musst du dich nicht Registrieren, los, auf zur Anmeldung!");
    
    } else {
      //check all usernames if input is equal
      for (let i = 0; i < this.allUserInfo.length; i++) {
        if (this.allUserInfo[i].username == username.value) {

          this.checkUsername = true;
          break;

        } else {
          this.checkUsername = false;
        }
      }
      //check value of checkUsername
      if (this.checkUsername == false) {
        //write values in interface and json
        this.data.username = username.value;
        this.data.password = userPassword.value;
        this.allUserInfo.push(this.data);
        FileHandler.writeJsonFile("json/user.json", this.allUserInfo);
        //answer user
        console.log("Username und Passwort wurden gespeichert!");
        console.log("Wilkommen " + username.value + " du bist jetzt Registriert, viel Spaß");
        this.globalUserName = username.value;

      } else {
        console.log("Der Benutzername ist bereits vergeben!");
      }
    }
  }

  public async userLogin(): Promise<void> {
    console.log("Wilkommen bei der Anmeldung!");
    console.log("----------------------------");

    //ask user for name and password
    let username = await Console.benutzerAbfrage("Geben Sie Ihren Benutzername ein!");
    let userPassword = await Console.benutzerAbfragePw("Geben Sie Ihr Passwort ein!");

    //check if the input is filled with admin values
    if (username.value == "Admin" && userPassword.value == "123") {

      console.log("Sie sind als Admin eingelogt");
      this.globalUserName = username.value;
    
    } else {

      // check all user inforamtion
      for (let i = 0; i < this.allUserInfo.length; i++) {

        if (this.allUserInfo[i].username == username.value && this.allUserInfo[i].password == userPassword.value) {
          this.checkUsername = true;
          break;

        } else {
          this.checkUsername = false;
        }
      }
      //check value of checkUsername
      if (this.checkUsername == true) {
        
        console.log("Hallo " + username.value + ", willkommen zurück, wie können wir dir helfen!");
        //set user name
        this.globalUserName = username.value;

      } else {
        console.log("Benutzername wurde leider nicht geunden!");
        console.log("Bitte versuchen Sie es erneut!");
      }
    }
  }

  public getUsername(): string{
    //return name of user
    return this.globalUserName;
  }
}
