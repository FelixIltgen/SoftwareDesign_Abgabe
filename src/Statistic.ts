import { bookingData } from "./classes/dao/booking";
import FileHandler from "./classes/singletons/FileHandler";

export class Statistic {

    public booking: bookingData = { date: new Date(), car: "", customer: "", duration: 0, price: 0 };
    public allBokkingInfo: bookingData[] = FileHandler.readJsonFile("json/booking.json");

    
    public bookSum: number = 0;
    public noBookings: boolean = false;

    public showbookings(name:string) {

        this.noBookings = false;
        if (this.allBokkingInfo.length == 0) {
            console.log("Es liegen keine Buchungen vor!")
        } else {
            for (let i = 0; i < this.allBokkingInfo.length; i++) {
                if (name == this.allBokkingInfo[i].customer) {
                    console.log(this.allBokkingInfo[i]);
                    console.log("--------------------");
                } else {
                    this.noBookings = true;
                }
            }
            if (this.noBookings == true) {
                console.log("Sie haben keine Buchungen vorliegen");
            }
        }
    }

    public showBookingSum(name:string) {

        this.bookSum = 0;
        this.noBookings = false;
        for (let i = 0; i < this.allBokkingInfo.length; i++) {
            if (name == this.allBokkingInfo[i].customer) {
                this.bookSum = this.bookSum + this.allBokkingInfo[i].price
            } else {
                this.noBookings = true;
            }
        }
        if (this.noBookings == true) {
            console.log("Sie haben keine Buchungen vorliegen");
        } else {
            console.log("Ihre gesammten Kosten betragen: " + this.bookSum + " Euro");
        }
    }

    public showAverageCost(name:string) {

        let averageBookSum: number = 0;
        this.bookSum = 0;
        this.noBookings = false;
        let count: number = 0;

        if (this.allBokkingInfo.length == 0) {
            console.log("Es liegen keine Buchungen vor");
        } else {
            for (let i = 0; i < this.allBokkingInfo.length; i++) {
                if (name == this.allBokkingInfo[i].customer) {
                    this.bookSum = this.bookSum + this.allBokkingInfo[i].price;
                    count ++;
                } else {
                    this.noBookings = true;
                }
            }
            if (this.noBookings == true) {
                console.log("Sie haben keine Buchungen vorliegen");
            } else {
                averageBookSum = this.bookSum / count;
                console.log("Ihre Durchschnittskosten pro Fahrt bertragen: " + averageBookSum + " Euro");
            }
        }
    }

}