/// <reference path="./../../typings/tsd.d.ts"/>

class Email {
    public email : string;
    constructor(email : string){
        if(this.validateEmail(email)) {
          this.email = email;
        }
        else {
            throw new Error("Invalid email!");
        }
    }
    private validateEmail(email : string) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }
}


class Person {
	public name : string;
	public surname : string;
	public email : Email;
	constructor(name : string, surname : string, email : Email){
		this.name = name;
		this.surname = surname;
		this.email = email;
	}
	greet() {
		console.log("Hi!");
	}
}

class Teacher extends Person {
	public subjects : string[];
	constructor(name : string, surname : string, email : Email, subjects : string[]){
		super(name, surname, email);
		this.subjects = subjects;
	}
	greet() {
		super.greet();
		console.log("Hi!");
	}
	teach() {
		console.log("Welcome to Maths class!");
	}
}

class SchoolPrincipal extends Teacher {
	manageTeachers() {
		console.log("We need to help students to get better results!");
	}
}

var principal = new SchoolPrincipal("remo", "jansen", new Email("remo.jansen@wolksoftware.com"), []);
principal.greet();
principal.teach();
principal.manageTeachers();

class Mammal100 {
  breathe() : string {
    return "I'm alive!";
  }
}

class WingedAnimal100 {
  fly() : string{
    return "I can fly!";
  }
}

class Bat100 implements Mammal100, WingedAnimal100 {
  breathe : () => string;
  fly : () => string;
}

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      if (name !== 'constructor') {
        derivedCtor.prototype[name] = baseCtor.prototype[name];
      }
    });
  });
}

applyMixins(Bat100, [Mammal100, WingedAnimal100]);


class Animal {
  eat() : string {
    return "Delicious!";
  }
}

class Mammal extends Animal {
  breathe() : string {
    return "I'm alive!";
  }
  move() : string {
    return "I can move like a mammal!";
  }
}

class WingedAnimal extends Animal {
  fly() : string{
    return "I can fly!";
  }
  move() : string {
    return "I can move like a bird!";
  }
}

class Bat1 implements Mammal, WingedAnimal {
  eat : () => string;
  breathe : () => string;
  fly : () => string;
  move : () => string;
}

applyMixins(Bat1, [Mammal, WingedAnimal]);
var bat1 = new Bat1();
bat1.breathe();
bat1.fly();

class User {
  public name : string;
  public password : string;
}

class NotGenericUserRepository {
  private _url : string;
  constructor(url : string) {
    this._url = url;
  }

  public getAsync() {
    return Q.Promise<User[]>((resolve : (users : User[]) => void, reject: any) => {
      $.ajax({
        url: this._url,
        type: "GET",
        success: (data) => {
          var users = <User[]>data.items;
          resolve(users);
        },
        error: (e) => {
          reject(e);
        }
      });
    });
  }
}

var notGenericUserRepository = new NotGenericUserRepository("http://twitter-cors.herokuapp.com/feed?count=1&user_names=liviu_ignat");
notGenericUserRepository.getAsync()
  .then(function(users : User[]){
    console.log('notGenericUserRepository => ', users);
  }, function(users : User[]){
    console.error('notGenericUserRepository => ');
  }).catch(function () {
    console.error('notGenericUserRepository => ');
  });

class Talk {
  public title : string;
  public description : string;
  public language : string;
  public url : string;
  public year : string;
}

class NotGenericTalkRepository {
  private _url : string;
  constructor(url : string) {
    this._url = url;
  }
  public getAsync() {
    return Q.Promise((resolve : (talks : Talk[]) => void, reject: any) => {
      $.ajax({
        url: this._url,
        type: "GET",
        dataType: "json",
        success: (data) => {
          var users = <Talk[]>data.items;
          resolve(users);
        },
        error: (e) => {
          reject(e);
        }
      });
    });
  }
}

class GenericRepository<T> {
  private _url : string;
  constructor(url : string){
    this._url = url;
  }
  public getAsync() {
    return Q.Promise((resolve : (talks : T[]) => void, reject: any) => {
      $.ajax({
        url: this._url,
        type: "GET",
        dataType: "json",
        success: (data) => {
          var list = <T[]>data.items;
          resolve(list);
        },
        error: (e) => {
          reject(e);
        }
      });
    });
  }
}

var userRepository = new GenericRepository<User>("http://twitter-cors.herokuapp.com/feed?count=1&user_names=liviu_ignat");
userRepository.getAsync()
              .then(function(users : User[]){
                console.log('userRepository => ', users);
              });

var talkRepository = new GenericRepository<Talk>("http://twitter-cors.herokuapp.com/feed?count=1&user_names=liviu_ignat");
talkRepository.getAsync()
  .then(function(talks : Talk[]){
    console.log('talkRepository => ', talks);
  });

interface ValidatableInterface {
  isValid() : boolean;
}

class User1 implements ValidatableInterface {
  public name : string;
  public password : string;
  public isValid() : boolean {
    // user validation...
    return true;
  }
}

class Talk1 implements ValidatableInterface {
  public title : string;
  public description : string;
  public language : string;
  public url : string;
  public year : string;
  public isValid() : boolean {
    // talk validation...
    return true;
  }
}

class GenericRepositoryWithConstraint<T extends ValidatableInterface> {
  private _url : string;
  constructor(url : string){
    this._url = url;
  }
  public getAsync() {
    return Q.Promise((resolve : (talks : T[]) => void, reject: any) => {
      $.ajax({
        url: this._url,
        type: "GET",
        dataType: "json",
        success: (data) => {
          var list : T[];
          for(var item in <T[]>data.items){
            if(item.isValid()) {
              list.push(item);
            }
          }
          resolve(list);
        },
        error: (e) => {
          reject(e);
        }
      });
    });
  }
}

var userRepository1 = new
  GenericRepositoryWithConstraint<User1>("http://twitter-cors.herokuapp.com/feed?count=1&user_names=liviu_ignat");

userRepository1.getAsync()
  .then(function(users : User[]){
    console.log(users);
  });

var talkRepository1 = new
  GenericRepositoryWithConstraint<Talk1>("http://twitter-cors.herokuapp.com/feed?count=1&user_names=liviu_ignat");

talkRepository1.getAsync()
  .then(function(talks : Talk[]){
    console.log(talks);
  });



interface PersistanceServiceInterface {
	save(entity : any) : number;
}

class CookiePersitanceService implements PersistanceServiceInterface{
  save(entity : any) : number {
    var id =  Math.floor((Math.random() * 100) + 1);
    // Cookie persistance logic...
    return id;
  }
}

class FavouritesController {
  private _persistanceService : PersistanceServiceInterface;
  constructor(persistanceService : PersistanceServiceInterface) {
    this._persistanceService = persistanceService;
  }
  public saveAsFavourite(articleId : number) {
    return this._persistanceService.save(articleId);
  }
}

var favController = new FavouritesController(new CookiePersitanceService());

class LocalStoragePersitanceService implements PersistanceServiceInterface{
  save(entity : any) : number {
    var id =  Math.floor((Math.random() * 100) + 1);
    // Local storage persistance logic...
    return id;
  }
}

favController = new FavouritesController(new LocalStoragePersitanceService());

interface VehicleInterface {
	getSpeed() : number;
	getVehicleType: string;
	isTaxPayed() : boolean;
	isLightsOn() : boolean;
}

interface LightsInterface {
	isLightsOn() : boolean;
	isLightsOff() : boolean;
}

interface RadioInterface {
	startRadio() : void;
	playCd : void;
	stopRadio() : void;
}

interface EngineInterface {
	startEngine() : void;
	acelerate() : number;
	stopEngine() : void;
}


module app {
  export module models {
    export class UserModel {
      // ...
    }

    export class TalkModel {
      // ...
    }
  }
}

var user = new app.models.UserModel();
var talk = new app.models.TalkModel();

module app.validation {
// ...
}
module app.models {
// ...
}
