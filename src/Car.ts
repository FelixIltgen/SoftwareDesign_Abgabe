import { Answers } from "prompts";
import { bookingData } from "./classes/dao/booking";
import { userBookingInfo } from "./classes/dao/bookingInfo";
import { carData } from "./classes/dao/carInformation";
import { userData } from "./classes/dao/userInterface";
import Console from "./classes/singletons/Console";
import FileHandler from "./classes/singletons/FileHandler";


export class Car {

    public car: carData = { id: 0, description: "", type: false, earliestTime: new Date(), latestTime: new Date, maxUse: 0, price: 0, pricePerMin: 0 }
    public allCarInfo: carData[] = FileHandler.readJsonFile("json/car.json");

    public allUserInfo: userData[] = FileHandler.readJsonFile("json/user.json");
    public data: userData = { username: "", password: "" };

    public booking: bookingData = { date: new Date(), car: "", customer: "", duration: 0, price: 0 };
    public allBokkingInfo: bookingData[] = FileHandler.readJsonFile("json/booking.json");

    public bookingInfo: userBookingInfo = { date: new Date(), car: 0, duration: 0, price: 0 };

    public currentCar: number = 0;
    public finalPrice: number = 0;
    public userDate: Answers<string> = [];
    public userTime: Answers<string> = [];

    public async showAllCars() {
        //Check if there are more then ten cars.
        if (this.allCarInfo.length > 10) {
            //When more than ten cars, print the first ten and wait.
            console.log("Es werden die ersten 10 Autos angezeigt!")
            console.log("-----------------------------");
            //Print first ten cars.
            for (let i = 0; i = 9; i++) {

                console.log([i] + ": " + this.allCarInfo[i].description);
            }
            //Ask user for the next step
            let userDesition: Answers<string> = await Console.showOnlyTwoOptions(["Alle restlichen Autos anzeigen", "Auto auswählen"], "Ihre weitere Möglichkeiten");
            //Choice one: show remaining cars
            if (userDesition.value == 1) {
                //Print the reamining cars, start at the 10th. 
                for (let i = 9; i < this.allCarInfo.length; i++) {
                    console.log(this.allCarInfo[i].description);
                }
                //Ask user to chose one car 
                let carNumber: Answers<string> = await Console.benutzerAbfrage("Bitte wählen Sie ein angezeigtes Auto, durch eingabe der Nummer aus!");
                //show chosen car.
                console.log(this.allCarInfo[carNumber.value]);
                this.currentCar = carNumber.value;
                
            } else {
                //Choice two: chose one car out of the first ten
                let carNumber: Answers<string> = await Console.benutzerAbfrage("Bitte wählen Sie ein angezeigtes Auto, durch eingabe der Nummer aus!");
                //show chosen car.
                console.log(this.allCarInfo[carNumber.value]);
                this.currentCar = carNumber.value;
            }

        } else {
            //Less than 10 cars, show all availible cars.
            console.log("Es werden " + this.allCarInfo.length + " Autos angezeigt!")
            console.log("-----------------------------");
            for (let i = 0; i < this.allCarInfo.length; i++) {

                console.log([i] + ": " + this.allCarInfo[i].description);
            }
            let carNumber: Answers<string> = await Console.benutzerAbfrage("Bitte wählen Sie ein angezeigtes Auto, durch eingabe der Nummer aus!");
            console.log(this.allCarInfo[carNumber.value]);
            this.currentCar = carNumber.value;
            
        }
    }

    public async searchCar() {

        let carExsists: boolean = false;

        console.log("Hier könen Sie nach einem bestimmten Auto suchen");
        //User enters a car description and a engine type.
        let careDescription = await Console.benutzerAbfrage("Bitte geben Sie ein Gewünschtes Auto an")
        let carEngineType = await Console.benutzerAbfrage("Bitte geben Sie mit true und false an welche Antriebsart Sie bevorzugen!")
        //Check for each car entry if description and engintype match. 
        for (let i = 0; i < this.allCarInfo.length; i++) {

            if (careDescription.value == this.allCarInfo[i].description && this.allCarInfo[i].type == carEngineType.value) {

                carExsists = true;
                this.currentCar = i;
                break;

            } else {
                carExsists = false;
            }
        }
        //If a car is available, show all information.
        if (carExsists == true) {
            console.log(this.allCarInfo[this.currentCar]);
            //Ask user for next steps.
            let userDesition: Answers<string> = await Console.showOnlyTwoOptions(["Möchten Sie für dieses Auto eine Anfrage stellen?", "Möchten Sie nach einem anderen Auto suchen?"], "Weitere Optionen?");
            if (userDesition.value == 1) {
                //start inquiry of the chosen car. 
                this.requestCar();
            } else {
                //Start again. 
                this.searchCar();
            }
        } else {
            console.log("Das Gewünschte Auto wurde nicht gefunden");
            console.log("Versuchen Sie es erneut");
            console.log("-----------------------");
            this.searchCar();
        }
    }

    public async requestCar(): Promise<userBookingInfo> {
        this.userDate = await Console.dateQuestion("Geben Sie ein Datum ein und eine Uhrzeit an");
        this.userTime = await Console.numberQuestion("Bitte geben Sie eine Zeit in Minuten an!");
        let minTime: number = new Date(this.allCarInfo[this.currentCar].earliestTime).getHours();
        let maxTime: number = new Date(this.allCarInfo[this.currentCar].latestTime).getHours();
        let usingTime: number = this.userDate.value.getHours();

        //Check Nutzungszeit & maximale Dauer 
        if (this.userTime.value > this.allCarInfo[this.currentCar].maxUse) {
            console.log("Die maximale Nutzungsdauer wurde überschritten")

        } else if (usingTime < minTime || usingTime > maxTime || (usingTime / 60) + minTime > maxTime) {
            console.log("Ihre gewählte Nutzungsdauer passt leider nicht zu Ihrem gewählten Auto");
        } else if (this.allBokkingInfo.length == 0) {

            this.calculateFinPrice();
        } else {
            let userDateNumber: number = this.userDate.value.getTime();
            let userTimeNumber: number = (this.userTime.value * 60) * 1000;
            let completeUserTime: number = userDateNumber + userTimeNumber;
            let checkTimeForBooking: boolean = false;

            for (let i = 0; i < this.allBokkingInfo.length; i++) {
                let bookingTime = new Date(this.allBokkingInfo[i].date).getTime();
                let bookingDuration = (this.allBokkingInfo[i].duration * 60) * 1000;
                let completeBookingTime = bookingTime + bookingDuration;

                if (bookingTime == userDateNumber && completeBookingTime == completeUserTime ||
                    completeBookingTime >= userDateNumber && completeBookingTime <= completeUserTime ||
                    bookingTime <= completeUserTime && bookingTime >= userDateNumber) {
                    checkTimeForBooking = false;
                } else {
                    checkTimeForBooking = true;
                }
            }
            if (checkTimeForBooking == false) {
                console.log("Leider ist der gewählte Zeitraum für dieses Auto schon belegt")
            } else {
                this.calculateFinPrice();
            }
        }
        
        return { date: this.userDate.value, car: this.currentCar, duration: this.userTime.value, price: this.finalPrice }
        this.finalPrice =0;
    }

    public async addCar(): Promise<void> {
        console.log("Auto hinzufügen!");
        console.log("----------------");
        //read all user input from the console and store it in the car interface.
        let carId = await Console.benutzerAbfrage("Bitte geben Sie eine ID für das Auto ein!");
        this.car.id = carId.value;

        let carDiscription = await Console.benutzerAbfrage("Bitte geben Sie eine Beschreibung für das Auto an!");
        this.car.description = carDiscription.value;

        let carType = await Console.yesNo("Hat das Auto einen Elektroantrieb?");
        this.car.type = carType.value;
        if(carType.value == true){
            console.log("E wurde hinzugefügt");
            this.car.description = carDiscription.value + " (E)";
        }

        let carMinTime = await Console.dateQuestion("Bitte geben Sie eine frühste Nutztungsuhrzeit an!");
        this.car.earliestTime = carMinTime.value;

        let carMaxTime = await Console.dateQuestion("Bitte geben Sie eine späteste Nutzungszeit an!");
        this.car.latestTime = carMaxTime.value;

        let carUseTime = await Console.numberQuestion("Btte geben Sie eine maximale Nutzungsdauer an!");
        this.car.maxUse = carUseTime.value;

        let carPrice = await Console.benutzerAbfrage("Bitte geben Sie einen Preis für das Auto an!");
        this.car.price = carPrice.value;

        let carPricePerMin = await Console.benutzerAbfrage("Bitte geben Sie einen pro Minute für das Auto an");
        this.car.pricePerMin = carPricePerMin.value;
        //push the interface with the data into the car array.
        this.allCarInfo.push(this.car);
        //write the array into the json file.
        FileHandler.writeJsonFile("json/car.json", this.allCarInfo);
        console.log("Das neue Auto wurde gespeichert!");
        console.log("HIER FUNKTION FÜR ZURÜCK ZUM HAUPTMENÜ")
    }

    public async filterCar(): Promise<userBookingInfo> {
        this.userDate = await Console.dateQuestion("Geben Sie ein Datum ein und eine Uhrzeit an");
        this.userTime = await Console.numberQuestion("Bitte geben Sie eine Zeit in Minuten an!");

        let usingTimeHours: number = this.userDate.value.getHours() * 60;
        let usingTimeMinute: number = this.userDate.value.getMinutes();
        let usingTime: number = usingTimeHours + usingTimeMinute;

        let userDateNumber: number = this.userDate.value.getTime();
        let userTimeNumber: number = (this.userTime.value * 60) * 1000;
        let completeUserTime: number = userDateNumber + userTimeNumber;

        let foundCars: string [] = []; 
        let rdyForPrice: boolean = false;

        for (let i = 0; i < this.allCarInfo.length; i++) {

            let minTimeHour: number = new Date(this.allCarInfo[i].earliestTime).getHours() * 60;
            let minTimeMin: number = new Date(this.allCarInfo[i].earliestTime).getMinutes();
            let maxTimeHour: number = new Date(this.allCarInfo[i].latestTime).getHours() * 60;
            let maxTimeMin: number = new Date(this.allCarInfo[i].latestTime).getHours();

            let minTime: number = minTimeHour + minTimeMin;
            let maxTime: number = maxTimeHour + maxTimeMin;

            if (this.userTime.value > this.allCarInfo[i].maxUse) {
                rdyForPrice = false;

            } else if (usingTime < minTime || usingTime > maxTime) {
                rdyForPrice = false;

            } else if (this.allBokkingInfo.length == 0) {
                rdyForPrice = true;

            } else {
                for (let i = 0; i < this.allBokkingInfo.length; i++) {

                    let bookingTime = new Date(this.allBokkingInfo[i].date).getTime();
                    let bookingDuration = (this.allBokkingInfo[i].duration * 60) * 1000;
                    let completeBookingTime = bookingTime + bookingDuration;

                    if (bookingTime == userDateNumber && completeBookingTime == completeUserTime || completeBookingTime >= userDateNumber && completeBookingTime <= completeUserTime || bookingTime <= completeUserTime && bookingTime >= userDateNumber) {
                        rdyForPrice = false;
                    } else {
                        rdyForPrice = true;
                        break;
                    }
                }
            }
            if (rdyForPrice == true) {

                foundCars.push(this.allCarInfo[i].description);
            }
        }
        console.log("Es werden " + foundCars.length + " Autos angezeigt!")
        console.log("-----------------------------");

        for(let i = 0; i< foundCars.length; i++){
            console.log([i]+": " + foundCars[i]);
        }
        let carNumber: Answers<string> = await Console.benutzerAbfrage("Bitte wählen Sie ein angezeigtes Auto, durch eingabe der Nummer aus!");
        let chosenCar: string = foundCars[carNumber.value];

         for(let i = 0; i< this.allCarInfo.length;i++){
            if(chosenCar == this.allCarInfo[i].description){
                this.currentCar = i;
                break;
            }
        }
        this.calculateFinPrice();
        //console.log(this.userDate.value,this.currentCar, this.userTime.value, this.finalPrice);
        return { date: this.userDate.value, car: this.currentCar , duration: this.userTime.value , price: this.finalPrice}
    }

    public calculateFinPrice(): void {

        let pricePerMinute: number = this.allCarInfo[this.currentCar].pricePerMin * this.userTime.value;
        let groundPrice: number = this.allCarInfo[this.currentCar].price * 1;
        this.finalPrice = pricePerMinute + groundPrice;
        console.log("Ihr Finaler Preis für diese Fahrt beträgt: " + this.finalPrice);
        
    }
}