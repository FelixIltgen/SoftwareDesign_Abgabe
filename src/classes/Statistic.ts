import { bookingData } from "./dao/booking";
import FileHandler from "./singletons/FileHandler";

export class Statistic {

    public booking: bookingData = { date: new Date(), car: "", customer: "", duration: 0, price: 0 };
    public allBookingInfo: bookingData[] = FileHandler.readJsonFile("json/booking.json");

    public bookSum: number = 0;
    public noBookings: boolean = false;

    public showbookings(name: string) {

        this.noBookings = false;
        //check if any bookings exists
        if (this.allBookingInfo.length == 0) {
            console.log("Es liegen keine Buchungen vor!");
        } else {
            //check for every booking if the given name matches the customer name in the booking
            for (let i = 0; i < this.allBookingInfo.length; i++) {
                if (name == this.allBookingInfo[i].customer) {
                    //show user booking information
                    console.log("Buchungsnummer: " + i);
                    console.log("Datum und Uhrzeit: " + this.allBookingInfo[i].date);
                    console.log("Autobeschreibung: " + this.allBookingInfo[i].car);
                    console.log("Dauer der Buchung: " + this.allBookingInfo[i].duration);
                    console.log("Preis der Buchung: " + this.allBookingInfo[i].price);
                    console.log("--------------------");
                } else {
                    this.noBookings = true;
                    break;
                }
            }
            //no booking with given name
            if (this.noBookings == true) {
                console.log("Sie haben keine Buchungen vorliegen");
            }
        }
    }

    public showBookingSum(name: string) {

        this.bookSum = 0;
        this.noBookings = false;
        //check if any bookings exists
        if (this.allBookingInfo.length == 0) {
            console.log("Es liegen keine Buchungen vor");
        } else {
            //check for every booking if the given name matches the customer name in the booking
            for (let i = 0; i < this.allBookingInfo.length; i++) {
                if (name == this.allBookingInfo[i].customer) {
                    //calculate the sum of all bookings
                    this.bookSum = this.bookSum + this.allBookingInfo[i].price;
                } else {
                    this.noBookings = true;
                }
            }
            //no bookings with given name
            if (this.noBookings == true) {
                console.log("Sie haben keine Buchungen vorliegen");
            } else {
                //show user the calculated sum 
                console.log("Ihre gesammten Kosten betragen: " + this.bookSum + " Euro");
            }
        }
    }

    public showAverageCost(name: string) {

        let averageBookSum: number = 0;
        this.bookSum = 0;
        this.noBookings = false;
        let count: number = 0;
        //check if any bookings exists
        if (this.allBookingInfo.length == 0) {
            console.log("Es liegen keine Buchungen vor");
        } else {
            //check for every booking if the given name matches the customer name in the booking
            for (let i = 0; i < this.allBookingInfo.length; i++) {
                if (name == this.allBookingInfo[i].customer) {
                    //calculate the sum of all bookings
                    this.bookSum = this.bookSum + this.allBookingInfo[i].price;
                    //increment one every step 
                    count++;
                } else {
                    this.noBookings = true;
                }
            }
            //check result 
            if (this.noBookings == true) {
                console.log("Sie haben keine Buchungen vorliegen");
            } else {
                //calculate the average sum of all bookings
                averageBookSum = this.bookSum / count;
                //show user calculated sum
                console.log("Ihre Durchschnittskosten pro Fahrt bertragen: " + averageBookSum + " Euro");
            }
        }
    }
}