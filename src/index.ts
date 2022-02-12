import console from 'console';
import { Answers } from 'prompts';
import * as readline from 'readline';
import { couldStartTrivia } from 'typescript';
import { Booking } from './Booking';
import { Car } from './Car';
import { userBookingInfo } from './classes/dao/bookingInfo';
import { userData } from './classes/dao/userInterface';
import { Usermenus } from './classes/Menus';
import Console from './classes/singletons/Console';
import FileHandler from './classes/singletons/FileHandler';
import { User } from './classes/User';


namespace Project {
  export class Main {

    public user: User = new User();
    public car: Car = new Car();
    public booking: Booking = new Booking();

    /* public globalUserName: string = "";
    public globalUserPassword: string = "";
    public allUserInfo: userData[] = FileHandler.readJsonFile("json/user.json");
    public checkUserName: boolean = false;
    public checkUserPassword: boolean = false; */

    public async programStart() {

      let userName: string = "";
      let bookingInfoInterface: userBookingInfo;

      console.log("HIER PROGRAMM FÜR COOLE ANIMATION")
      let decision: Answers<string> = await Console.showMoreOptions(["Anmelden", "Registrieren", "Autos suchen", "Autos filtern", "Alle Autos anzeigen"], "Wilkommen, wie können wir Ihnen helfen");

      switch (decision.value) {
        case "1":
          await this.user.userLogin();
          userName = this.user.getUsername();
          if (userName != "") {
            await this.showUserMenu();
          } else {
            await this.programStart();
          }
          break;

        case "2":
          await this.user.userRegitser();
          userName = this.user.getUsername();
          if (userName != "") {
            await this.showUserMenu();
          } else {
            await this.programStart();
          }

          break;

        case "3":
          
         await this.car.searchCar()
         bookingInfoInterface = await this.car.requestCar();
         userName = this.user.getUsername();
         await this.booking.bookCar(bookingInfoInterface, userName);
          break;

        case "4":

          break;

        case "5":
          await this.car.showAllCars();
          await this.car.requestCar();
          //this.booking.bookCar(bookingInfoInterface, userName);
          break;

        default:
          console.log("WoooOW etwas ist schief gelaufen, versuche es nochmal!")
          this.programStart();
          break;
      }


    }

    public async showUserMenu() {

      let decision: Answers<string> = Console.showFourOptions(["Autos suchen", "Autos filtern", "Alle Autos anzeigen", "Statistiken"], "Was möchten Sie tun?");

      switch (decision.value) {
        case "1":

          break;

        case "2":

          break;

        case "3":

          break;

        case "4":

          break;

        default:
          break;
      }
    }



  }

  let main: Main = new Main();

  //let menu: Usermenus = new Usermenus();

  //main.userAnmeldung();
  //user.userLogin();
  //user.addCar();
  main.programStart();
  //menu.adminMenu();
  //user.showAllCars();
  //user.searchCar();
  //user.requestCar();
  //user.bookCar();
}