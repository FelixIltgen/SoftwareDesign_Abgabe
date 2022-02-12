import console from 'console';
import { mainModule } from 'process';
import { Answers } from 'prompts';
import * as readline from 'readline';
import { couldStartTrivia } from 'typescript';
import Console from './singletons/Console';
import FileHandler from './singletons/FileHandler';
import { User } from './User';



export class Usermenus {

    public async registeredUserMenu() {

        let regUMenu: Answers<string> = await Console.showMoreOptions(["Autos Suchen", "Autos Anfragen", "Buchungsverlauf", "Buchungen"], "Wilkommen im Admin Hauptmenü was möchten Sie tun");

        switch (regUMenu.value) {
            case "1":
                //user.searchCar();
                break;

            case "2":

                break;

            case "3":

                break;
            case "4":

                break;
            case "5":

                break;

            default:
                console.log("WoooOW etwas ist schief gelaufen, versuche es nochmal!")

                break;
        }
    }
    public async adminMenu() {

        let aMenu: Answers<string> = await Console.showMoreOptions(
            ["Autos hinzufügen", "Auto buchen", "Autos Anfragen", "Buchungsverlauf", "Buchungen"], "Wilkommen im Admin Hauptmenü was möchten Sie tun");

        switch (aMenu.value) {
            case "1":
                //user.addCar();
                break;

            case "2":

                break;

            case "3":

                break;
            case "4":

                break;
            case "5":

                break;

            default:
                console.log("WoooOW etwas ist schief gelaufen, versuche es nochmal!")

                break;
        }
    }

}

