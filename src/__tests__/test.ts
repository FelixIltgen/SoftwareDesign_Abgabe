import {User} from "../classes/User";
let user: User = new User;

describe("Check name of user", () => {

  let invalid: Array<string> = ["Peter#Pan","#%dude","Ben - Holger"];
  let valid: Array<string> = ["FelixIltgen","MaxMueller6"];

  for(let nameOfUser of invalid){
    test("Check invalid username", () => {
      expect(user.regEx(nameOfUser)).toBeFalsy();
    });
  }

  for(let nameOfUser of valid){
    test("Check valid username", () => {
      expect(user.regEx(nameOfUser)).toBeTruthy();
    });
  }

  
});