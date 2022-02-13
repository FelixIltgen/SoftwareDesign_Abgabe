import { Answers } from "prompts";
import { bookingData } from "./dao/booking";
import { userBookingInfo } from "./dao/bookingInfo";
import { carData } from "./dao/carInformation";
import { userData } from "./dao/userInterface";
import Console from "./singletons/Console";
import FileHandler from "./singletons/FileHandler";


export class Car {

    public car: carData = { id: 0, description: "", type: false, earliestTime: new Date(), latestTime: new Date, maxUse: 0, price: 0, pricePerMin: 0 };
    public allCarInfo: carData[] = FileHandler.readJsonFile("json/car.json");

    public data: userData = { username: "", password: "" };
    public allUserInfo: userData[] = FileHandler.readJsonFile("json/user.json");
    
    public booking: bookingData = { date: new Date(), car: "", customer: "", duration: 0, price: 0 };
    public allBokkingInfo: bookingData[] = FileHandler.readJsonFile("json/booking.json");

    public bookingInfo: userBookingInfo = { date: new Date(), car: 0, duration: 0, price: 0 };

    public currentCar: number = 0;
    public finalPrice: number = 0;
    public userDate: Answers<string> = [];
    public userTime: Answers<string> = [];
    public carNumber: Answers <string> = [];

    public async showAllCars(): Promise<void> {
        //check if there are more then ten cars.
        if (this.allCarInfo.length > 10) {
            //when more than ten cars, print the first ten and wait.
            console.log("Es werden die ersten 10 Autos angezeigt!");
            console.log("-----------------------------");
            //print first ten cars.
            for (let i = 0; i = 9; i++) {

                console.log([i] + ": " + this.allCarInfo[i].description);
            }
            //ask user for the next step
            let userDesition: Answers<string> = await Console.showOnlyTwoOptions(["Alle restlichen Autos anzeigen", "Auto auswählen"], "Ihre weiteren Möglichkeiten");
            //choice one: show remaining cars
            if (userDesition.value == 1) {
                //print the reamining cars, start at the 10th. 
                for (let i = 9; i < this.allCarInfo.length; i++) {
                    console.log(this.allCarInfo[i].description);
                }
                //ask user to chose one car 
                this.carNumber  = await Console.userQuestion("Bitte wählen Sie ein angezeigtes Auto, durch eingabe der Nummer aus!");
                //show chosen car.
                this.showChosenCar();
                this.currentCar = this.carNumber.value;

            } else {
                //choice two: chose one car out of the first ten
                this.carNumber = await Console.userQuestion("Bitte wählen Sie ein angezeigtes Auto, durch eingabe der Nummer aus!");
                
                this.showChosenCar()
                this.currentCar = this.carNumber.value;
            }

        } else {
            //less than 10 cars, show all availible cars.
            console.log("Es werden " + this.allCarInfo.length + " Autos angezeigt!");
            console.log("-----------------------------");
            for (let i = 0; i < this.allCarInfo.length; i++) {

                console.log([i] + ": " + this.allCarInfo[i].description);
            }
            //ask user for decision
            this.carNumber = await Console.userQuestion("Bitte wählen Sie ein angezeigtes Auto, durch eingabe der Nummer aus!");
            this.showChosenCar();
            this.currentCar = this.carNumber.value;
        }
    }

    public async searchCar(): Promise<void> {

        let carExsists: boolean = false;

        console.log("Hier könen Sie nach einem bestimmten Auto suchen");
        //user enters a car description and a engine type.
        let careDescription: Answers<string> = await Console.userQuestion("Bitte geben Sie ein Gewünschtes Auto an");
        let carEngineType: Answers<string> = await Console.yesNo("Möchten Sie ein Benzin oder Diesel betriebens Auto?");
        
        //check for each car entry if description and engintype match.
        
        for (let i = 0; i < this.allCarInfo.length; i++) {
              
            if (careDescription.value == this.allCarInfo[i].description && this.allCarInfo[i].type == carEngineType.value) {

                carExsists = true;
                this.currentCar = i;
                this.carNumber.value = i;
                break;

            } else {
                carExsists = false;
            }
        }
        //if a car is available, show all information.
        if (carExsists == true) {
            this.showChosenCar();
            //ask user for next steps.
            let userDesition: Answers<string> = await Console.showOnlyTwoOptions(["Möchten Sie für dieses Auto eine Anfrage stellen?", "Möchten Sie nach einem anderen Auto suchen?"], "Weitere Optionen?");
            if (userDesition.value == 1) {
                //start inquiry of the chosen car. 
                this.requestCar();
            } else {
                //start again. 
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
        this.finalPrice = 0;
        //get user input information 
        this.userDate = await Console.dateQuestion("Geben Sie ein Datum ein und eine Uhrzeit an");
        this.userTime = await Console.numberQuestion("Bitte geben Sie eine Zeit in Minuten an!");
        //convert user input time in hours und minutes 
        let minTime: number = new Date(this.allCarInfo[this.currentCar].earliestTime).getHours();
        let maxTime: number = new Date(this.allCarInfo[this.currentCar].latestTime).getHours();
        let usingTime: number = this.userDate.value.getHours();

        // check max time of use
        if (this.userTime.value > this.allCarInfo[this.currentCar].maxUse) {
            console.log("Die maximale Nutzungsdauer wurde überschritten");
            //check if use of time from input matches the given use of time for the car
        } else if (usingTime < minTime || usingTime > maxTime || (usingTime / 60) + minTime > maxTime) {
            console.log("Ihre gewählte Nutzungsdauer passt leider nicht zu Ihrem gewählten Auto");
            //check if a Booking already exsists.
        } else if (this.allBokkingInfo.length == 0) {
            //calculate final price with given data
            this.calculateFinPrice();
        } else {
            //convert variabels
            let userDateNumber: number = this.userDate.value.getTime();
            let userTimeNumber: number = (this.userTime.value * 60) * 1000;
            let completeUserTime: number = userDateNumber + userTimeNumber;
            let checkTimeForBooking: boolean = false;
            //check for all exsisting booking if the input time interfers with a given booking time. 
            for (let i = 0; i < this.allBokkingInfo.length; i++) {
                //get importatnt data for each car
                let bookingTime = new Date(this.allBokkingInfo[i].date).getTime();
                let bookingDuration = (this.allBokkingInfo[i].duration * 60) * 1000;
                let completeBookingTime = bookingTime + bookingDuration;
                //check the data 
                if (bookingTime == userDateNumber && completeBookingTime == completeUserTime ||
                    completeBookingTime >= userDateNumber && completeBookingTime <= completeUserTime ||
                    bookingTime <= completeUserTime && bookingTime >= userDateNumber) {
                    checkTimeForBooking = false;
                } else {
                    checkTimeForBooking = true;
                    break;
                }
            }
            if (checkTimeForBooking == false) {
                console.log("Leider ist der gewählte Zeitraum für dieses Auto schon belegt");
                
            } else {
                //calculate final price with given data
                this.calculateFinPrice();
            }
        }
        //return values for future use
        return { date: this.userDate.value, car: this.currentCar, duration: this.userTime.value, price: this.finalPrice };
    }

    public async addCar(): Promise<void> {
        console.log("Auto hinzufügen!");
        console.log("----------------");
        //read all user input from the console and store it in the car interface.
        let carId = await Console.userQuestion("Bitte geben Sie eine ID für das Auto ein!");
        this.car.id = carId.value;

        let carDiscription = await Console.userQuestion("Bitte geben Sie eine Beschreibung für das Auto an!");
        this.car.description = carDiscription.value;

        let carType = await Console.yesNo("Hat das Auto einen Elektroantrieb?");
        this.car.type = carType.value;
        //when the car has a electric engine, add (E) in description
        if (carType.value == true) {
            console.log("E wurde hinzugefügt");
            this.car.description = carDiscription.value + " (E)";
        }

        let carMinTime = await Console.dateQuestion("Bitte geben Sie eine frühste Nutztungsuhrzeit an!");
        this.car.earliestTime = carMinTime.value;

        let carMaxTime = await Console.dateQuestion("Bitte geben Sie eine späteste Nutzungszeit an!");
        this.car.latestTime = carMaxTime.value;

        let carUseTime = await Console.numberQuestion("Btte geben Sie eine maximale Nutzungsdauer an!");
        this.car.maxUse = carUseTime.value;

        let carPrice = await Console.userQuestion("Bitte geben Sie einen Preis für das Auto an!");
        this.car.price = carPrice.value;

        let carPricePerMin = await Console.userQuestion("Bitte geben Sie einen pro Minute für das Auto an");
        this.car.pricePerMin = carPricePerMin.value;
        //push the interface with the data into the car array.
        this.allCarInfo.push(this.car);
        //write the array into the json file.
        FileHandler.writeJsonFile("json/car.json", this.allCarInfo);
        console.log("Das neue Auto wurde gespeichert!");
    }

    public async filterCar(): Promise<userBookingInfo> {
        // get date, time and duration from the user
        this.userDate = await Console.dateQuestion("Geben Sie ein Datum ein und eine Uhrzeit an");
        this.userTime = await Console.numberQuestion("Bitte geben Sie eine Zeit in Minuten an!");
        //convert given time into needed variables
        let usingTimeHours: number = this.userDate.value.getHours() * 60;
        let usingTimeMinute: number = this.userDate.value.getMinutes();
        let usingTime: number = usingTimeHours + usingTimeMinute;

        let userDateNumber: number = this.userDate.value.getTime();
        let userTimeNumber: number = (this.userTime.value * 60) * 1000;
        let completeUserTime: number = userDateNumber + userTimeNumber;

        let foundCars: string[] = [];
        let rdyForPrice: boolean = false;

        for (let i = 0; i < this.allCarInfo.length; i++) {
            //get time for each car and convert it into hours and minutes 
            let minTimeHour: number = new Date(this.allCarInfo[i].earliestTime).getHours() * 60;
            let minTimeMin: number = new Date(this.allCarInfo[i].earliestTime).getMinutes();
            let maxTimeHour: number = new Date(this.allCarInfo[i].latestTime).getHours() * 60;
            let maxTimeMin: number = new Date(this.allCarInfo[i].latestTime).getHours();
            //calculate complete time interval for each car
            let minTime: number = minTimeHour + minTimeMin;
            let maxTime: number = maxTimeHour + maxTimeMin;
            // check if given time is bigger than max using Time of the car 
            if (this.userTime.value > this.allCarInfo[i].maxUse) {
                rdyForPrice = false;
                //check if user input time is inside the using tme of the car
            } else if (usingTime < minTime || usingTime > maxTime) {
                rdyForPrice = false;
                //check if any bokking already exsists 
            } else if (this.allBokkingInfo.length == 0) {
                rdyForPrice = true;
            } else {
                //check all exsisting booking if the given time interfers with any time in the bookings
                for (let i = 0; i < this.allBokkingInfo.length; i++) {
                    //get needed data from each booking 
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
            //check result
            if (rdyForPrice == true) {
                //add every matching car description 
                foundCars.push(this.allCarInfo[i].description);
            }
        }
        console.log("Es werden " + foundCars.length + " Autos angezeigt!")
        console.log("-----------------------------");
        //show user every found car
        for (let i = 0; i < foundCars.length; i++) {
            console.log([i] + ": " + foundCars[i]);
        }
        //ask user for a decision
        let carNumber: Answers<string> = await Console.userQuestion("Bitte wählen Sie ein angezeigtes Auto, durch eingabe der Nummer aus!");
        let chosenCar: string = foundCars[carNumber.value];
        //check if the chosen car description matches a description of a car 
        for (let i = 0; i < this.allCarInfo.length; i++) {
            //if so get the array number of the car
            if (chosenCar == this.allCarInfo[i].description) {
                this.currentCar = i;
                break;
            }
        }
        this.calculateFinPrice();
        // return the needed data for the booking 
        return { date: this.userDate.value, car: this.currentCar, duration: this.userTime.value, price: this.finalPrice };
    }

    public calculateFinPrice(): void {

        let pricePerMinute: number = this.allCarInfo[this.currentCar].pricePerMin * this.userTime.value;
        let groundPrice: number = this.allCarInfo[this.currentCar].price * 1;
        this.finalPrice = pricePerMinute + groundPrice;
        console.log("Ihr Finaler Preis für diese Fahrt beträgt: " + this.finalPrice);

    }

    public showChosenCar(): void{

            console.log("Beschreibung: " + this.allCarInfo[this.carNumber.value].description);
            console.log("Frühste Benutzungszeit: " + this.allCarInfo[this.carNumber.value].earliestTime);
            console.log("Späteste Benutzungszeit: " + this.allCarInfo[this.carNumber.value].latestTime);
            console.log("Maximlae Nutzungszeit: " + this.allCarInfo[this.carNumber.value].maxUse + " Minuten.");
            console.log("Grundpreis: " + this.allCarInfo[this.carNumber.value].price + " Euro.");
            console.log("Preis pro Minute: " + this.allCarInfo[this.carNumber.value].pricePerMin + " Euro.");
    }
}