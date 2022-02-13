import console from 'console';
import { Answers } from 'prompts';
import * as readline from 'readline';
import { couldStartTrivia } from 'typescript';
import { Booking } from './Booking';
import { Car } from './Car';
import { userBookingInfo } from './classes/dao/bookingInfo';
import { userData } from './classes/dao/userInterface';
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

    //start program
    public async programStart() {

      //show user first Menu, wait for decision
      let decision: Answers<string> = await Console.showMoreOptions(["Anmelden", "Registrieren", "Autos suchen", "Autos filtern", "Alle Autos anzeigen"], "Wilkommen, wie können wir Ihnen helfen");

      switch (decision.value) {
        case "1":
          //show user login
          await this.user.userLogin();
          //get username
          this.userName = this.user.getUsername();
          //check if admin 
          if (this.userName == "Admin") {
            await this.showAdminMenu();
            //check if user ist registered or loggein 
          } else if (this.userName != "") {
            await this.showUserMenu();

          } else {
            await this.programStart();
          }

          break;

        case "2":
          //show user registration 
          await this.user.userRegitser();
          //get username
          this.userName = this.user.getUsername();
          //check if user ist registered or loggein 
          if (this.userName != "") {
            await this.showUserMenu();
          } else {
            await this.programStart();
          }
          break;

        case "3":
          await this.car.searchCar()
          //load return values from requestCar() in interface 
          this.bookingInfoInterface = await this.car.requestCar();
          //get username
          this.userName = this.user.getUsername();
          //check if user ist registered or logged in
          if (this.userName == "") {
            //fallback text
            console.log("Sie sind nicht angemeldet");
            console.log("-------------------------");
            this.programStart();
          } else {
            await this.booking.bookCar(this.bookingInfoInterface, this.userName);
          }
          break;

        case "4":
          // load values from filterCar in interface
          this.bookingInfoInterface = await this.car.filterCar();
          //get username
          this.userName = this.user.getUsername();
          //check if user ist registered or logged in
          if (this.userName == "") {
            //fallback text
            console.log("Sie sind nicht angemeldet");
            console.log("-------------------------");
            this.programStart();
          } else {
            await this.booking.bookCar(this.bookingInfoInterface, this.userName);
          }
          break;

        case "5":
          await this.car.showAllCars();
          //load return values from requestCar in interface
          this.bookingInfoInterface = await this.car.requestCar();
          //check if user ist registered or logged in
          if (this.userName == "") {
            //fallback text
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
      // show logged in user userMenu, wait for desision
      let decision: Answers<string> = await Console.showMoreOptions(["Autos suchen", "Autos filtern", "Alle Autos anzeigen", "Statistiken", "Abmelden"], "Was möchten Sie tun?");

      switch (decision.value) {
        case "1":
          await this.car.searchCar()
          //load return values in interface
          this.bookingInfoInterface = await this.car.requestCar();
          //get username
          this.userName = this.user.getUsername();
          //check if user ist registered or logged in
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
          // load return values in interface
          this.bookingInfoInterface = await this.car.filterCar();
          //get username
          this.userName = this.user.getUsername();
          //check if user ist registered or logged in
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
          //load return values in interface
          this.bookingInfoInterface = await this.car.requestCar();
          //get username
          this.userName = this.user.getUsername();
          //check if user ist registered or logged in
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
          // show user statitic menu, wait for desision 
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
          console.log("Du wirst abgemeldet!");
          //clear username
          this.userName = "";
          this.programStart();
          break;

        default:
          break;
      }
    }

    public async showAdminMenu() {
      //show admin menu, wair for decision
      let decision: Answers<string> = await Console.showSixOptions(["Autos suchen", "Autos filtern", "Alle Autos anzeigen", "Statistiken", "Autos hinzufügen", "Abmelden"], "Was möchten Sie tun");

      switch (decision.value) {
        case "1":
          await this.car.searchCar()
          //load return values in interface
          this.bookingInfoInterface = await this.car.requestCar();
          //get username
          this.userName = this.user.getUsername();
          //check if user ist registered or logged in
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
          //load return values 
          this.bookingInfoInterface = await this.car.filterCar();
          //get username
          this.userName = this.user.getUsername();
          //check if user ist registered or logged in
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
          //load return values in interface
          this.bookingInfoInterface = await this.car.requestCar();
          //get username
          this.userName = this.user.getUsername();
          //check if user ist registered or logged in
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
          // show user statitic menu, wait for desision
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
          await this.car.addCar();
          this.showAdminMenu();
          break;

        case "6":
          console.log("Sie werden abgemeldet!");
          //clear username
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