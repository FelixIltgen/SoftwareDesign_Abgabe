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
import { Statistic } from './Statistic';


namespace Project {
  export class Main {

    public user: User = new User();
    public car: Car = new Car();
    public booking: Booking = new Booking();
    public statistics: Statistic = new Statistic();

    public userName: string = "";
    public bookingInfoInterface: userBookingInfo = { date: new Date(), car: 0, duration: 0, price: 0 };

    public async programStart() {

      let decision: Answers<string> = await Console.showMoreOptions(["Anmelden", "Registrieren", "Autos suchen", "Autos filtern", "Alle Autos anzeigen"], "Wilkommen, wie können wir Ihnen helfen");

      switch (decision.value) {
        case "1":
          await this.user.userLogin();
          this.userName = this.user.getUsername();
    
          if (this.userName == "Admin") {
            await this.showAdminMenu();

          } else if (this.userName != "") {
            await this.showUserMenu();

          } else {
            await this.programStart();
          }

          break;

        case "2":
          await this.user.userRegitser();
          this.userName = this.user.getUsername();
          if (this.userName != "") {
            await this.showUserMenu();
          } else {
            await this.programStart();
          }
          break;

        case "3":
          await this.car.searchCar()
          this.bookingInfoInterface = await this.car.requestCar();
          this.userName = this.user.getUsername();

          if (this.userName == "") {
            console.log("Sie sind nicht angemeldet");
            console.log("-------------------------");
            this.programStart();
          } else {
            await this.booking.bookCar(this.bookingInfoInterface, this.userName);
          }
          break;

        case "4":
          await this.car.filterCar();

          if (this.userName == "") {
            console.log("Sie sind nicht angemeldet");
            console.log("-------------------------");
            this.programStart();
          } else {
            await this.booking.bookCar(this.bookingInfoInterface, this.userName);
          }
          break;

        case "5":
          await this.car.showAllCars();
          await this.car.requestCar();
          if (this.userName == "") {
            console.log("Sie sind nicht angemeldet");
            console.log("-------------------------");
            this.programStart();
          } else {
            await this.booking.bookCar(this.bookingInfoInterface, this.userName);
          }
          break;

        default:
          console.log("WoooOW etwas ist schief gelaufen, versuche es nochmal!")
          this.programStart();
          break;
      }
    }
    public async showUserMenu() {

      let decision: Answers<string> = await Console.showMoreOptions(["Autos suchen", "Autos filtern", "Alle Autos anzeigen", "Statistiken", "Abmelden"], "Was möchten Sie tun?");

      switch (decision.value) {
        case "1":
          await this.car.searchCar()
          this.bookingInfoInterface = await this.car.requestCar();
          this.userName = this.user.getUsername();

          if (this.userName == "") {
            console.log("Sie sind nicht angemeldet");
            console.log("-------------------------");
            this.programStart();
          } else {
            await this.booking.bookCar(this.bookingInfoInterface, this.userName);
          }
          this.showUserMenu();
          break;

        case "2":
          this.bookingInfoInterface = await this.car.filterCar();
          this.userName = this.user.getUsername();

          if (this.userName == "") {
            console.log("Sie sind nicht angemeldet");
            console.log("-------------------------");
            this.programStart();
          } else {
            await this.booking.bookCar(this.bookingInfoInterface, this.userName);
          }
          this.showUserMenu();

          break;

        case "3":
          await this.car.showAllCars();
          this.bookingInfoInterface = await this.car.requestCar();
          this.userName = this.user.getUsername();

          if (this.userName == "") {
            console.log("Sie sind nicht angemeldet");
            console.log("-------------------------");
            this.programStart();
          } else {
            await this.booking.bookCar(this.bookingInfoInterface, this.userName);
          }
          this.showUserMenu();
          break;

        case "4":
          let decision: Answers<string> = await Console.showOptions(["Alle buchungen Anzeigen", "kumulierten Betrag anzeigen", "Durchschnittsbetrag anzeigen"], "Was möchten Sie genau sehen");
          switch (decision.value) {
            case "1":
              this.statistics.showbookings(this.userName);
              this.showUserMenu();
              break;

            case "2":
              this.statistics.showBookingSum(this.userName);
              this.showUserMenu();
              break;

            case "3":
              this.statistics.showAverageCost(this.userName);
              this.showUserMenu();
              break;

            default:
              break;
          }
          break;

        case "5":
          console.log("Sie werden abgemeldet!")
          this.userName = "";
          this.programStart();
          break;

        default:
          break;
      }
    }

    public async showAdminMenu() {

      let decision: Answers<string> = await Console.showSixOptions(["Autos suchen", "Autos filtern", "Alle Autos anzeigen", "Statistiken", "Autos hinzufügen", "Abmelden"], "Was möchten Sie tun");

      switch (decision.value) {
        case "1":
          await this.car.searchCar()
          this.bookingInfoInterface = await this.car.requestCar();
          this.userName = this.user.getUsername();

          if (this.userName == "") {
            console.log("Sie sind nicht angemeldet");
            console.log("-------------------------");
            this.programStart();
          } else {
            await this.booking.bookCar(this.bookingInfoInterface, this.userName);
          }
          this.showAdminMenu();
          break;

        case "2":
          this.bookingInfoInterface = await this.car.filterCar();
          this.userName = this.user.getUsername();

          if (this.userName == "") {
            console.log("Sie sind nicht angemeldet");
            console.log("-------------------------");
            this.programStart();
          } else {
            await this.booking.bookCar(this.bookingInfoInterface, this.userName);
          }
          this.showAdminMenu();
          break;

        case "3":
          await this.car.showAllCars();
          this.bookingInfoInterface = await this.car.requestCar();
          this.userName = this.user.getUsername();

          if (this.userName == "") {
            console.log("Sie sind nicht angemeldet");
            console.log("-------------------------");
            this.programStart();
          } else {
            await this.booking.bookCar(this.bookingInfoInterface, this.userName);
          }
          this.showAdminMenu;
          break;

        case "4":
          let decision: Answers<string> = await Console.showOptions(["Alle buchungen Anzeigen", "kumulierten Betrag anzeigen", "Durchschnittsbetrag anzeigen"], "Was möchten Sie genau sehen");
          switch (decision.value) {
            case "1":
              this.statistics.showbookings(this.userName);
              this.showUserMenu();
              break;

            case "2":
              this.statistics.showBookingSum(this.userName);
              this.showUserMenu();
              break;

            case "3":
              this.statistics.showAverageCost(this.userName);
              this.showUserMenu();
              break;

            default:
              break;
          }
          break;
        
        case "5":
          await this.car.addCar()
          this.showAdminMenu();
          break;

        case "6":
          console.log("Sie werden abgemeldet!")
          this.userName = "";
          this.programStart();

          break;

        default:
          break;
      }
    }
  }
  let main: Main = new Main();
  main.programStart();
}