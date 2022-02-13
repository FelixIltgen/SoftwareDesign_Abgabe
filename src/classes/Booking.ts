import { Answers } from "prompts";
import { bookingData } from "./dao/booking";
import { userBookingInfo } from "./dao/bookingInfo";
import { carData } from "./dao/carInformation";
import Console from "./singletons/Console";
import FileHandler from "./singletons/FileHandler";



export class Booking{

    public checkUser: boolean = false;

    public booking: bookingData = { date: new Date(), car: "", customer: "", duration: 0, price: 0 };
    public allBookingInfo: bookingData[] = FileHandler.readJsonFile("json/booking.json");

    public car: carData = { id: 0, description: "", type: false, earliestTime: new Date(), latestTime: new Date, maxUse: 0, price: 0, pricePerMin: 0 };
    public allCarInfo: carData[] = FileHandler.readJsonFile("json/car.json");

    public async bookCar(information: userBookingInfo, name: string) {
          //write all booking information into booking interface
          this.booking.date = information.date;
          this.booking.car = this.allCarInfo[information.car].description;
          this.booking.customer = name; 
          this.booking.duration = information.duration;
          this.booking.price = information.price;
          //show user the information 
          console.log("------------------------------------------------------");
          console.log("Ihr Gewünschtes Datum und Ihre gewünschte Uhrzeit:" + this.booking.date);
          console.log("Angefragtes Auto: "+this.booking.car);
          console.log("Ihr Name: "+this.booking.customer);
          console.log("Dauer Ihrer Buchung: "+this.booking.duration+" Minuten.");
          console.log("Kompletter Buchungspreis: "+this.booking.price+" Euro.");
          //ask user if he wants to book the shown car
          let wiriteBooking: Answers<string> = await Console.yesNo("Wollen Sie mit den Oben angegebenen Daten das Auto buchen?");
          if (wiriteBooking.value == true) {
            //write the interface into the arry
            this.allBookingInfo.push(this.booking);
            //write array into the json file. 
            FileHandler.writeJsonFile("json/booking.json", this.allBookingInfo);
            console.log("Ihre Buchung wurde erfolgreich gespeichert.");
          }else{
            console.log("Ihre Buchung wurde abgebrochen.");
          }
      }
}